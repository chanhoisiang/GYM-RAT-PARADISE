import React, { useState, useRef, useEffect } from 'react';
import {
  Camera, Video, Sparkles, CheckCircle2, AlertTriangle,
  Play, Square, RotateCcw, Activity
} from 'lucide-react';
import { PoseLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

const LIFT_MODES = [
  {
    id: 'squat',
    name: 'Squat',
    emoji: '🏋️‍♂️',
    primaryJoint: 'Knee Angle',
    jointsIdx: [23, 25, 27], // Hip -> Knee -> Ankle
    bottomThreshold: 100,    // < 100 deg = Good Depth
    topThreshold: 160,       // > 160 deg = Standing Lockout
    targetCue: 'Aim for < 95° Knee Angle at the bottom for parallel depth',
  },
  {
    id: 'deadlift',
    name: 'Deadlift / RDL',
    emoji: '🧲',
    primaryJoint: 'Hip Hinge Angle',
    jointsIdx: [11, 23, 25], // Shoulder -> Hip -> Knee
    bottomThreshold: 110,
    topThreshold: 165,
    targetCue: 'Hinge hips back (< 110°) while keeping spine neutral, lock out > 165°',
  },
  {
    id: 'bench',
    name: 'Bench / Push-Up',
    emoji: '🛌',
    primaryJoint: 'Elbow Angle',
    jointsIdx: [11, 13, 15], // Shoulder -> Elbow -> Wrist
    bottomThreshold: 95,
    topThreshold: 160,
    targetCue: 'Lower until elbow hits ~90°, press to > 160° lockout',
  },
  {
    id: 'ohp',
    name: 'Shoulder Press',
    emoji: '🙌',
    primaryJoint: 'Elbow Extension',
    jointsIdx: [11, 13, 15],
    bottomThreshold: 90,
    topThreshold: 165,
    targetCue: 'Start below chin (< 90°), press overhead to full > 165° lockout',
  },
  {
    id: 'curl',
    name: 'Bicep Curl / Row',
    emoji: '💪',
    primaryJoint: 'Elbow Flexion',
    jointsIdx: [11, 13, 15],
    bottomThreshold: 65,
    topThreshold: 150,
    targetCue: 'Full stretch > 150° at bottom, squeeze < 65° at top without swinging torso',
  },
];

// Calculate 3-point biomechanical joint angle in degrees
function calculateAngle(a, b, c) {
  if (!a || !b || !c) return 0;
  const radians =
    Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);
  if (angle > 180.0) angle = 360 - angle;
  return Math.round(angle);
}

export default function FormCheckAnalyzer({ showToast }) {
  const [selectedLift, setSelectedLift] = useState(LIFT_MODES[0]);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [videoSrc, setVideoSrc] = useState(null);

  // Live Biomechanical Telemetry State
  const [liveAngle, setLiveAngle] = useState(175);
  const [minBottomAngle, setMinBottomAngle] = useState(180);
  const [torsoLeanAngle, setTorsoLeanAngle] = useState(12);
  const [repCount, setRepCount] = useState(0);
  const [liveFormStatus, setLiveFormStatus] = useState('Stand in frame to start tracking');

  // Gemini AI Deep Analysis Report
  const [aiLoading, setAiLoading] = useState(false);
  const [aiReport, setAiReport] = useState({
    score: 88,
    verdict: 'READY FOR LIVE SCAN',
    good: [
      'Real-time MediaPipe 33-point skeletal tracking initialized.',
      'Joint goniometer ready to measure knee, hip, and elbow flexion.',
    ],
    fixes: [
      'Start Live Camera or upload a lifting video to measure your real joint angles.',
    ],
    cue: '🎯 Film from a 45° or side profile so all joints are visible!',
  });

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const landmarkerRef = useRef(null);
  const rafRef = useRef(null);
  const repStageRef = useRef('up'); // 'up' | 'down'
  const minAngleTrackerRef = useRef(180);

  // 1. Initialize Google MediaPipe PoseLandmarker on Mount
  useEffect(() => {
    let active = true;
    async function initPoseModel() {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
        );
        const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numPoses: 1,
        });
        if (active) {
          landmarkerRef.current = poseLandmarker;
          setModelLoaded(true);
        }
      } catch (err) {
        console.error('Failed to load MediaPipe Pose model:', err);
      }
    }
    initPoseModel();

    return () => {
      active = false;
      stopStreamAndLoop();
    };
  }, []);

  const stopStreamAndLoop = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  // 2. Start Live Webcam / Phone Camera
  const startLiveCamera = async () => {
    stopStreamAndLoop();
    setVideoSrc(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadeddata = () => {
          videoRef.current.play();
          setCameraActive(true);
          requestAnimationFrame(predictPoseLoop);
        };
      }
      showToast('📹 Live AI Skeleton Tracking Active!');
    } catch (err) {
      console.error(err);
      showToast('⚠️ Camera permission denied or unavailable.');
    }
  };

  // 3. Handle Uploaded Lifting Video
  const handleVideoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    stopStreamAndLoop();
    const url = URL.createObjectURL(file);
    setVideoSrc(url);
    setRepCount(0);
    minAngleTrackerRef.current = 180;
    setMinBottomAngle(180);
    showToast('🎬 Video loaded! Press Play on the video to track your skeleton.');
  };

  // 4. Real-Time 30-60 FPS Pose Detection & Joint Angle Loop
  const predictPoseLoop = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const landmarker = landmarkerRef.current;

    if (!video || !canvas || !landmarker) return;

    if (video.readyState >= 2 && !video.paused && !video.ended) {
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const startTimeMs = performance.now();
      const result = landmarker.detectForVideo(video, startTimeMs);

      if (result.landmarks && result.landmarks.length > 0) {
        const lm = result.landmarks[0];
        const [idxA, idxB, idxC] = selectedLift.jointsIdx;

        // Pick left side (or right side if more visible)
        const useRight = (lm[idxB + 1]?.visibility || 0) > (lm[idxB]?.visibility || 0);
        const pA = lm[useRight ? idxA + 1 : idxA];
        const pB = lm[useRight ? idxB + 1 : idxB];
        const pC = lm[useRight ? idxC + 1 : idxC];

        // Calculate Primary Joint Angle
        const angle = calculateAngle(pA, pB, pC);
        setLiveAngle(angle);

        // Calculate Torso Lean Angle (Shoulder to Hip vs Vertical)
        const shoulder = lm[useRight ? 12 : 11];
        const hip = lm[useRight ? 24 : 23];
        if (shoulder && hip) {
          const verticalPt = { x: hip.x, y: hip.y - 0.3 };
          const lean = calculateAngle(shoulder, hip, verticalPt);
          setTorsoLeanAngle(lean);
        }

        // Track deepest bottom angle & Auto-Count Reps
        if (angle < minAngleTrackerRef.current && angle > 30) {
          minAngleTrackerRef.current = angle;
          setMinBottomAngle(angle);
        }

        if (angle < selectedLift.bottomThreshold) {
          repStageRef.current = 'down';
          setLiveFormStatus('🟢 GOOD DEPTH / BOTTOM HIT!');
        } else if (angle > selectedLift.topThreshold && repStageRef.current === 'down') {
          repStageRef.current = 'up';
          setRepCount((r) => r + 1);
          setLiveFormStatus('🔥 REP COMPLETED! LOCKED OUT!');
        } else if (angle <= selectedLift.topThreshold && angle >= selectedLift.bottomThreshold) {
          setLiveFormStatus('🟡 DESCENDING — GO DEEPER FOR FULL ROM');
        }

        // Draw Skeleton Connections
        const connections = [
          [11, 12], [11, 13], [13, 15], [12, 14], [14, 16], // Upper body
          [11, 23], [12, 24], [23, 24],                     // Torso core
          [23, 25], [25, 27], [24, 26], [26, 28]            // Lower body legs
        ];

        ctx.lineWidth = 4;
        ctx.strokeStyle = angle < selectedLift.bottomThreshold ? '#10B981' : '#F97316';

        connections.forEach(([i, j]) => {
          const pt1 = lm[i];
          const pt2 = lm[j];
          if (pt1 && pt2 && pt1.visibility > 0.35 && pt2.visibility > 0.35) {
            ctx.beginPath();
            ctx.moveTo(pt1.x * canvas.width, pt1.y * canvas.height);
            ctx.lineTo(pt2.x * canvas.width, pt2.y * canvas.height);
            ctx.stroke();
          }
        });

        // Draw Joint Keypoints
        lm.forEach((pt, idx) => {
          if (pt.visibility > 0.4 && idx >= 11 && idx <= 28) {
            ctx.beginPath();
            ctx.arc(pt.x * canvas.width, pt.y * canvas.height, 6, 0, 2 * Math.PI);
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#0F172A';
            ctx.stroke();
          }
        });

        // Draw Live Angle Badge right on the active Joint (pB)
        if (pB) {
          const bx = pB.x * canvas.width;
          const by = pB.y * canvas.height;
          ctx.fillStyle = '#0F172A';
          ctx.beginPath();
          ctx.roundRect(bx + 12, by - 22, 68, 32, 8);
          ctx.fill();
          ctx.fillStyle = '#10B981';
          ctx.font = 'bold 16px -apple-system, sans-serif';
          ctx.fillText(`${angle}°`, bx + 24, by);
        }
      }
    }

    rafRef.current = requestAnimationFrame(predictPoseLoop);
  };

  // 5. Send Real Measured Biomechanics + Snapshot Frame to Gemini 2.5 Flash
  const handleAskGeminiCoach = async () => {
    setAiLoading(true);
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    // Capture composite snapshot (video + skeleton)
    let frameBase64 = null;
    if (videoRef.current) {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = videoRef.current.videoWidth || 640;
      tempCanvas.height = videoRef.current.videoHeight || 480;
      const tCtx = tempCanvas.getContext('2d');
      tCtx.drawImage(videoRef.current, 0, 0, tempCanvas.width, tempCanvas.height);
      if (canvasRef.current) {
        tCtx.drawImage(canvasRef.current, 0, 0, tempCanvas.width, tempCanvas.height);
      }
      frameBase64 = tempCanvas.toDataURL('image/jpeg', 0.85).split(',')[1];
    }

    const telemetrySummary = `Exercise: ${selectedLift.name}, Current ${selectedLift.primaryJoint}: ${liveAngle}°, Deepest Bottom Angle Reached: ${minBottomAngle}°, Torso Lean Angle: ${torsoLeanAngle}°, Completed Reps: ${repCount}.`;

    try {
      if (apiKey && !apiKey.includes('your-gemini')) {
        const parts = [
          {
            text: `You are an elite NASM/ACE biomechanics coach. Analyze this lifter's real MediaPipe Pose telemetry: [${telemetrySummary}]. Target threshold for bottom depth is ${selectedLift.bottomThreshold}°.
Return ONLY valid JSON:
{
  "score": number (0-100),
  "verdict": string (short uppercase),
  "good": [string, string],
  "fixes": [string, string],
  "cue": string
}`,
          },
        ];
        if (frameBase64) {
          parts.push({ inlineData: { mimeType: 'image/jpeg', data: frameBase64 } });
        }

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts }],
              generationConfig: { responseMimeType: 'application/json' },
            }),
          }
        );
        const data = await res.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const parsed = JSON.parse(rawText);
          setAiReport({
            score: Number(parsed.score) || 88,
            verdict: parsed.verdict || 'BIOMECHANICS SCANNED',
            good: parsed.good || [],
            fixes: parsed.fixes || [],
            cue: parsed.cue || selectedLift.targetCue,
          });
          showToast(`✅ Gemini Biomechanics Score: ${parsed.score}/100`);
          setAiLoading(false);
          return;
        }
      }

      // Smart Local Telemetry Evaluation if Gemini key is not yet set
      await new Promise((r) => setTimeout(r, 600));
      const hitDepth = minBottomAngle <= selectedLift.bottomThreshold;
      setAiReport({
        score: hitDepth ? 92 : 76,
        verdict: hitDepth ? 'GREAT DEPTH & ROM' : 'SHALLOW ROM DETECTED',
        good: [
          `Tracked ${repCount} full reps with Torso Lean at ${torsoLeanAngle}°.`,
          hitDepth
            ? `Hit optimal bottom flexion (${minBottomAngle}° vs ${selectedLift.bottomThreshold}° target).`
            : `Good upper-body stability throughout movement.`,
        ],
        fixes: [
          hitDepth
            ? 'Maintain 360° core bracing coming out of the bottom sticking point.'
            : `Your lowest angle was ${minBottomAngle}°. Aim to reach ≤ ${selectedLift.bottomThreshold}° for full muscle fiber recruitment.`,
        ],
        cue: selectedLift.targetCue,
      });
      showToast('✅ Biomechanical Telemetry Analyzed!');
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* STEP 1: PICK EXERCISE */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            1. Select Exercise for 33-Point AI Skeleton Tracking
          </span>
          <span
            className={`text-xs font-extrabold px-2.5 py-1 rounded-full ${
              modelLoaded
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {modelLoaded ? '🟢 MediaPipe Neural Net Ready' : '⏳ Loading AI Vision...'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {LIFT_MODES.map((lift) => {
            const active = selectedLift.id === lift.id;
            return (
              <button
                key={lift.id}
                onClick={() => {
                  setSelectedLift(lift);
                  setRepCount(0);
                  minAngleTrackerRef.current = 180;
                  setMinBottomAngle(180);
                }}
                className={`p-3.5 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition active:scale-95 ${
                  active
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                    : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-orange-400'
                }`}
              >
                <span className="text-3xl">{lift.emoji}</span>
                <span className="font-extrabold text-sm">{lift.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 2: LIVE SKELETON VIEWPORT + TELEMETRY GAUGES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Video + Real-Time Skeleton Canvas */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 shadow-xs border border-slate-200 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="font-extrabold text-base text-slate-900">
              {liveFormStatus}
            </div>
            <button
              onClick={() => {
                setRepCount(0);
                minAngleTrackerRef.current = 180;
                setMinBottomAngle(180);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Counter
            </button>
          </div>

          {/* Video & Skeleton Overlay Stack */}
          <div className="relative w-full h-80 sm:h-96 rounded-3xl bg-slate-950 overflow-hidden flex items-center justify-center border-2 border-slate-800">
            <video
              ref={videoRef}
              src={videoSrc || undefined}
              controls={Boolean(videoSrc)}
              playsInline
              muted
              onPlay={() => requestAnimationFrame(predictPoseLoop)}
              className="w-full h-full object-contain"
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            />

            {!cameraActive && !videoSrc && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <div className="text-6xl mb-2">{selectedLift.emoji}</div>
                <div className="text-white font-extrabold text-lg">
                  Start Live Camera or Upload Lift Video
                </div>
                <p className="text-xs max-w-xs mt-1">
                  MediaPipe Pose will draw your 33 body landmarks in real time, measure your {selectedLift.primaryJoint}, and count reps automatically.
                </p>
              </div>
            )}
          </div>

          {/* 3 Live Telemetry Gauges */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-900 text-white text-center">
              <div className="text-[10px] font-extrabold uppercase text-slate-400">
                {selectedLift.primaryJoint}
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-extrabold text-emerald-400 mt-0.5">
                {liveAngle}°
              </div>
              <div className="text-[10px] text-slate-400">
                Best Depth: {minBottomAngle === 180 ? '—' : `${minBottomAngle}°`}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 text-white text-center">
              <div className="text-[10px] font-extrabold uppercase text-slate-400">
                TORSO LEAN
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-extrabold text-orange-400 mt-0.5">
                {torsoLeanAngle}°
              </div>
              <div className="text-[10px] text-slate-400">Spine Alignment</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 text-white text-center">
              <div className="text-[10px] font-extrabold uppercase text-slate-400">
                AI REP COUNTER
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-extrabold text-sky-400 mt-0.5">
                {repCount}
              </div>
              <div className="text-[10px] text-slate-400">Auto-Tracked</div>
            </div>
          </div>

          {/* Camera & Upload Action Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {!cameraActive ? (
              <button
                onClick={startLiveCamera}
                className="py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95 transition"
              >
                <Camera className="w-5 h-5" /> Start Live Camera
              </button>
            ) : (
              <button
                onClick={stopStreamAndLoop}
                className="py-3.5 px-4 rounded-2xl bg-red-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <Square className="w-4 h-4 fill-white" /> Stop Camera
              </button>
            )}

            <label className="py-3.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition">
              <Video className="w-5 h-5 text-orange-600" />
              <span>Upload Video</span>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
              />
            </label>

            <button
              onClick={handleAskGeminiCoach}
              disabled={aiLoading}
              className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition"
            >
              <Sparkles className="w-5 h-5" />
              <span>{aiLoading ? 'Analyzing...' : 'AI Deep Report'}</span>
            </button>
          </div>
        </div>

        {/* Right: AI Biomechanical Report Card */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 shadow-xs border border-slate-200 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between p-4 rounded-3xl bg-slate-900 text-white">
            <div>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-orange-500">
                {aiReport.verdict}
              </span>
              <h4 className="text-xl font-extrabold mt-1">
                {selectedLift.name} Evaluation
              </h4>
              <p className="text-xs text-slate-300 mt-1">{aiReport.cue}</p>
            </div>
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 flex flex-col items-center justify-center shrink-0">
              <span className="text-2xl font-extrabold">{aiReport.score}</span>
              <span className="text-[10px] font-bold uppercase">/ 100</span>
            </div>
          </div>

          <div className="space-y-3 flex-1">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1.5">
              <div className="text-xs font-extrabold uppercase text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Biomechanical Strengths
              </div>
              {aiReport.good.map((g, idx) => (
                <div key={idx} className="text-sm font-bold text-emerald-950">
                  ✅ {g}
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1.5">
              <div className="text-xs font-extrabold uppercase text-amber-800 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" /> Corrections & Cues
              </div>
              {aiReport.fixes.map((f, idx) => (
                <div key={idx} className="text-sm font-bold text-amber-950">
                  ⚠️ {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}