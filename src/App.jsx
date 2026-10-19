import React, { useState, useEffect, useMemo } from 'react';
import {
  Dumbbell, Flame, Brain, TrendingUp, Play, Pause, RotateCcw,
  Plus, Trash2, Check, ChevronLeft, ChevronRight, Sparkles,
  Camera, Volume2, VolumeX, Database, Download, Upload, Search,
  Award, Zap, Clock, Calendar, Target, Scale, X,
  Utensils, CheckCircle2, Trophy, Cloud, CloudOff, RefreshCw,
  FlameKindling, Activity, Sliders, ChevronRight as ArrowRight
} from 'lucide-react';

// ============================================================================
// EXERCISE LIBRARY & DEFAULT TEMPLATES
// ============================================================================
const EXERCISE_LIBRARY = [
  { name: 'Barbell Bench Press', muscle: 'Chest', equipment: 'Barbell', defaultBest: '85kg × 8' },
  { name: 'Incline Dumbbell Press', muscle: 'Chest', equipment: 'Dumbbell', defaultBest: '32.5kg × 10' },
  { name: 'Smith Machine Incline Press', muscle: 'Chest', equipment: 'Smith Machine', defaultBest: '75kg × 10' },
  { name: 'Cable Chest Fly', muscle: 'Chest', equipment: 'Cable', defaultBest: '20kg × 15' },
  { name: 'Weighted Chest Dips', muscle: 'Chest', equipment: 'Bodyweight', defaultBest: '+15kg × 10' },
  { name: 'Overhead Barbell Press (OHP)', muscle: 'Shoulders', equipment: 'Barbell', defaultBest: '55kg × 8' },
  { name: 'Seated Dumbbell Shoulder Press', muscle: 'Shoulders', equipment: 'Dumbbell', defaultBest: '26kg × 10' },
  { name: 'Dumbbell Lateral Raise', muscle: 'Shoulders', equipment: 'Dumbbell', defaultBest: '14kg × 15' },
  { name: 'Cable Rope Tricep Pushdown', muscle: 'Triceps', equipment: 'Cable', defaultBest: '27.5kg × 12' },
  { name: 'Overhead Cable Tricep Extension', muscle: 'Triceps', equipment: 'Cable', defaultBest: '25kg × 12' },
  { name: 'Skullcrushers (EZ-Bar)', muscle: 'Triceps', equipment: 'Barbell', defaultBest: '35kg × 10' },
  { name: 'Lat Pulldown (Wide Grip)', muscle: 'Back', equipment: 'Cable', defaultBest: '70kg × 10' },
  { name: 'Barbell Bent-Over Row', muscle: 'Back', equipment: 'Barbell', defaultBest: '80kg × 8' },
  { name: 'Chest-Supported T-Bar Row', muscle: 'Back', equipment: 'Machine', defaultBest: '60kg × 10' },
  { name: 'Seated Cable Row', muscle: 'Back', equipment: 'Cable', defaultBest: '65kg × 12' },
  { name: 'Face Pulls', muscle: 'Shoulders', equipment: 'Cable', defaultBest: '25kg × 15' },
  { name: 'Incline Dumbbell Curl', muscle: 'Biceps', equipment: 'Dumbbell', defaultBest: '16kg × 10' },
  { name: 'Barbell EZ-Bar Curl', muscle: 'Biceps', equipment: 'Barbell', defaultBest: '37.5kg × 10' },
  { name: 'Hammer Curls', muscle: 'Biceps', equipment: 'Dumbbell', defaultBest: '18kg × 12' },
  { name: 'Barbell Back Squat', muscle: 'Legs', equipment: 'Barbell', defaultBest: '120kg × 6' },
  { name: 'Smith Machine Squat', muscle: 'Legs', equipment: 'Smith Machine', defaultBest: '110kg × 8' },
  { name: 'Romanian Deadlift (RDL)', muscle: 'Legs', equipment: 'Barbell', defaultBest: '110kg × 8' },
  { name: 'Leg Press (45°)', muscle: 'Legs', equipment: 'Machine', defaultBest: '200kg × 10' },
  { name: 'Seated Leg Curl', muscle: 'Legs', equipment: 'Machine', defaultBest: '55kg × 12' },
  { name: 'Leg Extension', muscle: 'Legs', equipment: 'Machine', defaultBest: '65kg × 15' },
  { name: 'Standing Calf Raise', muscle: 'Legs', equipment: 'Machine', defaultBest: '80kg × 15' },
];

const WORKOUT_TEMPLATES = {
  'Push Day': {
    title: 'Push Day (Chest, Shoulders & Triceps)',
    exercises: [
      {
        id: 'ex-1',
        name: 'Barbell Bench Press',
        muscle: 'Chest',
        equipment: 'Barbell',
        prevBest: '85kg × 8',
        sets: [
          { id: 's-1', type: 'W', weight: 60, reps: 10, rpe: 6.5, done: true },
          { id: 's-2', type: '1', weight: 85, reps: 8, rpe: 8.5, done: true },
          { id: 's-3', type: '2', weight: 85, reps: 8, rpe: 9.0, done: false },
          { id: 's-4', type: '3', weight: 82.5, reps: 8, rpe: 9.5, done: false },
        ],
      },
      {
        id: 'ex-2',
        name: 'Smith Machine Incline Press',
        muscle: 'Chest',
        equipment: 'Smith Machine',
        prevBest: '75kg × 10',
        sets: [
          { id: 's-5', type: '1', weight: 75, reps: 10, rpe: 8.5, done: true },
          { id: 's-6', type: '2', weight: 75, reps: 9, rpe: 9.0, done: false },
          { id: 's-7', type: '3', weight: 70, reps: 10, rpe: 9.5, done: false },
        ],
      },
      {
        id: 'ex-3',
        name: 'Dumbbell Lateral Raise',
        muscle: 'Shoulders',
        equipment: 'Dumbbell',
        prevBest: '14kg × 15',
        sets: [
          { id: 's-8', type: '1', weight: 14, reps: 15, rpe: 8.5, done: false },
          { id: 's-9', type: '2', weight: 14, reps: 15, rpe: 9.0, done: false },
          { id: 's-10', type: 'D', weight: 10, reps: 15, rpe: 10, done: false },
        ],
      },
      {
        id: 'ex-4',
        name: 'Cable Rope Tricep Pushdown',
        muscle: 'Triceps',
        equipment: 'Cable',
        prevBest: '27.5kg × 12',
        sets: [
          { id: 's-11', type: '1', weight: 27.5, reps: 12, rpe: 8.5, done: false },
          { id: 's-12', type: 'F', weight: 27.5, reps: 11, rpe: 10, done: false },
        ],
      },
    ],
  },
  'Pull Day': {
    title: 'Pull Day (Back, Rear Delts & Biceps)',
    exercises: [
      {
        id: 'ex-p1',
        name: 'Lat Pulldown (Wide Grip)',
        muscle: 'Back',
        equipment: 'Cable',
        prevBest: '70kg × 10',
        sets: [
          { id: 'sp-1', type: 'W', weight: 50, reps: 12, rpe: 6.5, done: false },
          { id: 'sp-2', type: '1', weight: 70, reps: 10, rpe: 8.5, done: false },
          { id: 'sp-3', type: '2', weight: 70, reps: 10, rpe: 9.0, done: false },
        ],
      },
      {
        id: 'ex-p2',
        name: 'Barbell Bent-Over Row',
        muscle: 'Back',
        equipment: 'Barbell',
        prevBest: '80kg × 8',
        sets: [
          { id: 'sp-4', type: '1', weight: 80, reps: 8, rpe: 8.5, done: false },
          { id: 'sp-5', type: '2', weight: 80, reps: 8, rpe: 9.0, done: false },
          { id: 'sp-6', type: '3', weight: 75, reps: 10, rpe: 9.0, done: false },
        ],
      },
      {
        id: 'ex-p3',
        name: 'Face Pulls',
        muscle: 'Shoulders',
        equipment: 'Cable',
        prevBest: '25kg × 15',
        sets: [
          { id: 'sp-7', type: '1', weight: 25, reps: 15, rpe: 8.0, done: false },
          { id: 'sp-8', type: '2', weight: 25, reps: 15, rpe: 8.5, done: false },
        ],
      },
      {
        id: 'ex-p4',
        name: 'Incline Dumbbell Curl',
        muscle: 'Biceps',
        equipment: 'Dumbbell',
        prevBest: '16kg × 10',
        sets: [
          { id: 'sp-9', type: '1', weight: 16, reps: 10, rpe: 9.0, done: false },
          { id: 'sp-10', type: 'F', weight: 16, reps: 9, rpe: 10, done: false },
        ],
      },
    ],
  },
  'Leg Day': {
    title: 'Leg Day (Quads, Hamstrings & Calves)',
    exercises: [
      {
        id: 'ex-l1',
        name: 'Barbell Back Squat',
        muscle: 'Legs',
        equipment: 'Barbell',
        prevBest: '120kg × 6',
        sets: [
          { id: 'sl-1', type: 'W', weight: 80, reps: 8, rpe: 6.5, done: false },
          { id: 'sl-2', type: '1', weight: 120, reps: 6, rpe: 8.5, done: false },
          { id: 'sl-3', type: '2', weight: 120, reps: 6, rpe: 9.0, done: false },
          { id: 'sl-4', type: '3', weight: 110, reps: 8, rpe: 9.0, done: false },
        ],
      },
      {
        id: 'ex-l2',
        name: 'Romanian Deadlift (RDL)',
        muscle: 'Legs',
        equipment: 'Barbell',
        prevBest: '110kg × 8',
        sets: [
          { id: 'sl-5', type: '1', weight: 110, reps: 8, rpe: 8.5, done: false },
          { id: 'sl-6', type: '2', weight: 110, reps: 8, rpe: 9.0, done: false },
        ],
      },
      {
        id: 'ex-l3',
        name: 'Seated Leg Curl',
        muscle: 'Legs',
        equipment: 'Machine',
        prevBest: '55kg × 12',
        sets: [
          { id: 'sl-7', type: '1', weight: 55, reps: 12, rpe: 8.5, done: false },
          { id: 'sl-8', type: 'F', weight: 55, reps: 12, rpe: 10, done: false },
        ],
      },
    ],
  },
  'Upper Hypertrophy': {
    title: 'Upper Body Hypertrophy (V-Taper Focus)',
    exercises: [
      {
        id: 'ex-u1',
        name: 'Smith Machine Incline Press',
        muscle: 'Chest',
        equipment: 'Smith Machine',
        prevBest: '75kg × 10',
        sets: [
          { id: 'su-1', type: '1', weight: 75, reps: 10, rpe: 8.5, done: false },
          { id: 'su-2', type: '2', weight: 75, reps: 10, rpe: 9.0, done: false },
        ],
      },
      {
        id: 'ex-u2',
        name: 'Lat Pulldown (Wide Grip)',
        muscle: 'Back',
        equipment: 'Cable',
        prevBest: '70kg × 10',
        sets: [
          { id: 'su-3', type: '1', weight: 70, reps: 10, rpe: 8.5, done: false },
          { id: 'su-4', type: '2', weight: 70, reps: 10, rpe: 9.0, done: false },
        ],
      },
      {
        id: 'ex-u3',
        name: 'Dumbbell Lateral Raise',
        muscle: 'Shoulders',
        equipment: 'Dumbbell',
        prevBest: '14kg × 15',
        sets: [
          { id: 'su-5', type: '1', weight: 14, reps: 15, rpe: 9.0, done: false },
          { id: 'su-6', type: 'D', weight: 10, reps: 15, rpe: 10, done: false },
        ],
      },
    ],
  },
};

const GYM_FOOD_STAPLES = [
  { name: 'Chicken Breast (150g cooked)', cal: 248, p: 46, c: 0, f: 5, slot: 'Lunch', icon: '🍗' },
  { name: 'Whole Eggs (3 Large)', cal: 215, p: 19, c: 1, f: 15, slot: 'Breakfast', icon: '🥚' },
  { name: 'Cooked White Rice (200g)', cal: 260, p: 5, c: 56, f: 0, slot: 'Lunch', icon: '🍚' },
  { name: 'Pork Noodle / Chu Yuk Fun (1 Bowl)', cal: 520, p: 34, c: 58, f: 16, slot: 'Lunch', icon: '🍜' },
  { name: 'Whey Isolate Shake (1.5 Scoop)', cal: 180, p: 38, c: 3, f: 1, slot: 'Post-Workout', icon: '🥤' },
  { name: 'Rolled Oats (80g dry)', cal: 304, p: 11, c: 54, f: 5, slot: 'Breakfast', icon: '🥣' },
  { name: 'Grilled Salmon (150g)', cal: 312, p: 34, c: 0, f: 19, slot: 'Dinner', icon: '🐟' },
  { name: 'Egg Whites (200g)', cal: 104, p: 22, c: 1, f: 0, slot: 'Breakfast', icon: '🍳' },
];

const COACH_QUICK_PROMPTS = [
  'Analyze my workout volume & RPE today',
  'What should I eat post-workout to hit my protein?',
  'How do I break my 85kg Bench Press plateau?',
  'Check if my Push/Pull/Legs volume is balanced',
];

// Epley 1RM Formula: weight * (1 + reps / 30)
const calc1RM = (weight, reps) => {
  const w = Number(weight) || 0;
  const r = Number(reps) || 0;
  if (w <= 0 || r <= 0) return 0;
  if (r === 1) return Math.round(w);
  return Math.round(w * (1 + r / 30));
};

export default function App() {
  // Navigation & Active Date
  const [activeTab, setActiveTab] = useState('workout');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [logoError, setLogoError] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  // Supabase Environment Check
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey && !supabaseUrl.includes('your-project'));
  const [syncingCloud, setSyncingCloud] = useState(false);

  // Multi-date Workout Logs Store: { [date]: { title, exercises } }
  const [workoutHistory, setWorkoutHistory] = useState(() => {
    const saved = localStorage.getItem('ironlog_history_v3');
    if (saved) return JSON.parse(saved);
    const today = new Date().toISOString().split('T')[0];
    return {
      [today]: {
        title: WORKOUT_TEMPLATES['Push Day'].title,
        exercises: WORKOUT_TEMPLATES['Push Day'].exercises,
      },
    };
  });

  // Current Date's Workout Accessor
  const currentWorkout = useMemo(() => {
    return (
      workoutHistory[selectedDate] || {
        title: WORKOUT_TEMPLATES['Push Day'].title,
        exercises: WORKOUT_TEMPLATES['Push Day'].exercises,
      }
    );
  }, [workoutHistory, selectedDate]);

  const setCurrentWorkout = (updater) => {
    setWorkoutHistory((prev) => {
      const existing = prev[selectedDate] || {
        title: WORKOUT_TEMPLATES['Push Day'].title,
        exercises: WORKOUT_TEMPLATES['Push Day'].exercises,
      };
      const updated = typeof updater === 'function' ? updater(existing) : updater;
      return { ...prev, [selectedDate]: updated };
    });
  };

  // Timers
  const [sessionSeconds, setSessionSeconds] = useState(1450); // 24:10 active look
  const [sessionRunning, setSessionRunning] = useState(true);
  const [restSeconds, setRestSeconds] = useState(0);
  const [restPreset, setRestPreset] = useState(90);
  const [autoStartRest, setAutoStartRest] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Modals / Drawers
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [muscleFilter, setMuscleFilter] = useState('All');
  const [showSqlModal, setShowSqlModal] = useState(false);

  // Nutrition State
  const [targets, setTargets] = useState(() => {
    const saved = localStorage.getItem('ironlog_targets_v3');
    return saved ? JSON.parse(saved) : { cal: 2550, p: 185, c: 280, f: 75 };
  });

  const [foodLogsByDate, setFoodLogsByDate] = useState(() => {
    const saved = localStorage.getItem('ironlog_food_v3');
    if (saved) return JSON.parse(saved);
    const today = new Date().toISOString().split('T')[0];
    return {
      [today]: [
        { id: 'f-1', name: 'Rolled Oats (80g) + 3 Whole Eggs', slot: 'Breakfast', cal: 519, p: 30, c: 55, f: 20 },
        { id: 'f-2', name: 'Pork Noodle / Chu Yuk Fun (Extra Lean Pork)', slot: 'Lunch', cal: 540, p: 36, c: 58, f: 16 },
        { id: 'f-3', name: 'Whey Isolate Shake + Banana', slot: 'Post-Workout', cal: 275, p: 39, c: 27, f: 1 },
      ],
    };
  });

  const foodLogs = useMemo(() => foodLogsByDate[selectedDate] || [], [foodLogsByDate, selectedDate]);
  const setFoodLogs = (updater) => {
    setFoodLogsByDate((prev) => {
      const currentList = prev[selectedDate] || [];
      const nextList = typeof updater === 'function' ? updater(currentList) : updater;
      return { ...prev, [selectedDate]: nextList };
    });
  };

  const [aiFoodPrompt, setAiFoodPrompt] = useState('');
  const [selectedMealSlot, setSelectedMealSlot] = useState('Dinner');
  const [aiFoodLoading, setAiFoodLoading] = useState(false);
  const [foodImagePreview, setFoodImagePreview] = useState(null);
  const [foodImageBase64, setFoodImageBase64] = useState(null);
  const [showManualFoodForm, setShowManualFoodForm] = useState(false);
  const [manualFood, setManualFood] = useState({ name: '', cal: '', p: '', c: '', f: '' });

  // AI Coach & Plate Calculator
  const [targetBarbellWeight, setTargetBarbellWeight] = useState(100);
  const [barWeight, setBarWeight] = useState(20); // 20kg Olympic, 15kg Women's, 10kg Smith
  const [coachMessages, setCoachMessages] = useState([
    {
      role: 'assistant',
      text: "Welcome back! Your Push Day volume is looking strong (85kg × 8 on Barbell Bench Press at RPE 8.5 gives an estimated 1RM of 108kg). You have 1,216 kcal and 80g protein left today. Tap a quick prompt below or ask me anything!",
    },
  ]);
  const [coachInput, setCoachInput] = useState('');
  const [coachLoading, setCoachLoading] = useState(false);

  // Bodyweight & TDEE Calculator State
  const [bodyweightLogs, setBodyweightLogs] = useState(() => {
    const saved = localStorage.getItem('ironlog_bw_v3');
    return saved
      ? JSON.parse(saved)
      : [
          { date: '13 Oct', weight: 74.8 },
          { date: '14 Oct', weight: 74.6 },
          { date: '15 Oct', weight: 74.9 },
          { date: '16 Oct', weight: 74.5 },
          { date: '17 Oct', weight: 74.4 },
          { date: '18 Oct', weight: 74.3 },
          { date: '19 Oct', weight: 74.2 },
        ];
  });
  const [newWeightInput, setNewWeightInput] = useState('74.2');

  // TDEE Calculator Inputs
  const [tdeeForm, setTdeeForm] = useState({
    weight: 74.2,
    height: 175,
    age: 22,
    activity: 1.55, // Moderate 3-5 days/wk
    goal: 'lean_bulk', // cut (-400), recomp (0), lean_bulk (+250)
  });

  // Helper Toast
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2800);
  };

  // Persist to localStorage automatically
  useEffect(() => {
    localStorage.setItem('ironlog_history_v3', JSON.stringify(workoutHistory));
  }, [workoutHistory]);
  useEffect(() => {
    localStorage.setItem('ironlog_food_v3', JSON.stringify(foodLogsByDate));
  }, [foodLogsByDate]);
  useEffect(() => {
    localStorage.setItem('ironlog_targets_v3', JSON.stringify(targets));
  }, [targets]);
  useEffect(() => {
    localStorage.setItem('ironlog_bw_v3', JSON.stringify(bodyweightLogs));
  }, [bodyweightLogs]);

  // Web Audio Multi-Beep Gym Alarm
  const playGymBeep = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      [0, 0.18, 0.36].forEach((offset) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, ctx.currentTime + offset);
        gain.gain.setValueAtTime(0.3, ctx.currentTime + offset);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + offset + 0.14);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + offset);
        osc.stop(ctx.currentTime + offset + 0.14);
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Active Session Stopwatch
  useEffect(() => {
    if (!sessionRunning) return;
    const interval = setInterval(() => setSessionSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [sessionRunning]);

  // Rest Timer Countdown
  useEffect(() => {
    if (restSeconds <= 0) return;
    const interval = setInterval(() => {
      setRestSeconds((prev) => {
        if (prev <= 1) {
          playGymBeep();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [restSeconds, soundEnabled]);

  const formatDuration = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  const shiftDate = (days) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  // ============================================================================
  // SUPABASE CLOUD SYNC (DIRECT REST API — ZERO EXTRA PACKAGES NEEDED)
  // ============================================================================
  const syncSessionToSupabase = async () => {
    if (!isSupabaseConfigured) {
      setShowSqlModal(true);
      showToast('Saved locally! Add Supabase keys in .env for cloud sync.');
      return;
    }
    setSyncingCloud(true);
    try {
      // 1. Insert Workout Header
      const wRes = await fetch(`${supabaseUrl}/rest/v1/workouts`, {
        method: 'POST',
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify({
          date: selectedDate,
          name: currentWorkout.title,
          duration_seconds: sessionSeconds,
          completed: true,
        }),
      });
      const wData = await wRes.json();
      const workoutId = wData?.[0]?.id;

      // 2. Insert Sets if workoutId returned
      if (workoutId) {
        const setsPayload = [];
        currentWorkout.exercises.forEach((ex) => {
          ex.sets.forEach((s, idx) => {
            setsPayload.push({
              workout_id: workoutId,
              exercise_name: ex.name,
              set_number: idx + 1,
              set_type: s.type,
              weight: Number(s.weight) || 0,
              reps: Number(s.reps) || 0,
              rpe: Number(s.rpe) || 8.0,
              completed: Boolean(s.done),
            });
          });
        });
        if (setsPayload.length > 0) {
          await fetch(`${supabaseUrl}/rest/v1/workout_sets`, {
            method: 'POST',
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(setsPayload),
          });
        }
      }
      showToast('Synced workout & sets to Supabase Cloud!');
    } catch (err) {
      console.error(err);
      showToast('Saved on device! Check Supabase table policies.');
    } finally {
      setSyncingCloud(false);
    }
  };

  // ============================================================================
  // WORKOUT COMPUTATIONS & HANDLERS
  // ============================================================================
  const workoutStats = useMemo(() => {
    let totalVol = 0;
    let doneSets = 0;
    let totalSets = 0;
    let rpeSum = 0;
    let rpeCount = 0;
    const muscleSets = { Chest: 0, Back: 0, Legs: 0, Shoulders: 0, Triceps: 0, Biceps: 0 };

    currentWorkout.exercises.forEach((ex) => {
      ex.sets.forEach((s) => {
        totalSets++;
        if (s.done) {
          doneSets++;
          totalVol += (Number(s.weight) || 0) * (Number(s.reps) || 0);
          if (s.type !== 'W' && muscleSets[ex.muscle] !== undefined) {
            muscleSets[ex.muscle] += 1;
          }
          if (s.rpe) {
            rpeSum += Number(s.rpe);
            rpeCount++;
          }
        }
      });
    });

    return {
      totalVol: Math.round(totalVol),
      doneSets,
      totalSets,
      avgRpe: rpeCount > 0 ? (rpeSum / rpeCount).toFixed(1) : '—',
      muscleSets,
    };
  }, [currentWorkout]);

  // All-Time PR Leaderboard across exercises
  const prLeaderboard = useMemo(() => {
    const map = {};
    Object.values(workoutHistory).forEach((day) => {
      (day.exercises || []).forEach((ex) => {
        ex.sets.forEach((s) => {
          const e1rm = calc1RM(s.weight, s.reps);
          if (!map[ex.name] || e1rm > map[ex.name].e1rm) {
            map[ex.name] = {
              name: ex.name,
              muscle: ex.muscle,
              weight: s.weight,
              reps: s.reps,
              e1rm,
            };
          }
        });
      });
    });
    return Object.values(map).sort((a, b) => b.e1rm - a.e1rm);
  }, [workoutHistory]);

  const updateSetField = (exId, setId, field, value) => {
    setCurrentWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) =>
        ex.id !== exId
          ? ex
          : {
              ...ex,
              sets: ex.sets.map((s) => (s.id === setId ? { ...s, [field]: value } : s)),
            }
      ),
    }));
  };

  const toggleSetDone = (exId, setId) => {
    setCurrentWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) => {
        if (ex.id !== exId) return ex;
        return {
          ...ex,
          sets: ex.sets.map((s) => {
            if (s.id !== setId) return s;
            const nextDone = !s.done;
            if (nextDone && autoStartRest) {
              setRestSeconds(restPreset);
            }
            return { ...s, done: nextDone };
          }),
        };
      }),
    }));
  };

  const cycleSetType = (exId, setId) => {
    const order = ['1', 'W', 'D', 'F'];
    setCurrentWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) => {
        if (ex.id !== exId) return ex;
        return {
          ...ex,
          sets: ex.sets.map((s, idx) => {
            if (s.id !== setId) return s;
            const current = ['W', 'D', 'F'].includes(s.type) ? s.type : '1';
            const next = order[(order.indexOf(current) + 1) % order.length];
            return { ...s, type: next === '1' ? String(idx + 1) : next };
          }),
        };
      }),
    }));
  };

  const addSetToExercise = (exId) => {
    setCurrentWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) => {
        if (ex.id !== exId) return ex;
        const lastSet = ex.sets[ex.sets.length - 1] || { weight: 60, reps: 10, rpe: 8.5 };
        return {
          ...ex,
          sets: [
            ...ex.sets,
            {
              id: `s-${Date.now()}`,
              type: String(ex.sets.length + 1),
              weight: lastSet.weight,
              reps: lastSet.reps,
              rpe: lastSet.rpe,
              done: false,
            },
          ],
        };
      }),
    }));
  };

  const removeSet = (exId, setId) => {
    setCurrentWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) =>
        ex.id !== exId ? ex : { ...ex, sets: ex.sets.filter((s) => s.id !== setId) }
      ),
    }));
  };

  const removeExercise = (exId) => {
    setCurrentWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((ex) => ex.id !== exId),
    }));
  };

  const addExerciseFromLibrary = (item) => {
    setCurrentWorkout((prev) => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        {
          id: `ex-${Date.now()}`,
          name: item.name,
          muscle: item.muscle,
          equipment: item.equipment,
          prevBest: item.defaultBest || 'New Lift',
          sets: [
            { id: `s-${Date.now()}-1`, type: '1', weight: 40, reps: 10, rpe: 8.0, done: false },
            { id: `s-${Date.now()}-2`, type: '2', weight: 40, reps: 10, rpe: 8.5, done: false },
          ],
        },
      ],
    }));
    setShowExercisePicker(false);
    showToast(`Added ${item.name}`);
  };

  // ============================================================================
  // NUTRITION & GEMINI AI FOOD CALCULATOR
  // ============================================================================
  const macroTotals = useMemo(() => {
    return foodLogs.reduce(
      (acc, item) => ({
        cal: acc.cal + (Number(item.cal) || 0),
        p: acc.p + (Number(item.p) || 0),
        c: acc.c + (Number(item.c) || 0),
        f: acc.f + (Number(item.f) || 0),
      }),
      { cal: 0, p: 0, c: 0, f: 0 }
    );
  }, [foodLogs]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFoodImagePreview(reader.result);
      setFoodImageBase64(reader.result.split(',')[1]);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyzeFoodWithAI = async () => {
    if (!aiFoodPrompt.trim() && !foodImageBase64) return;
    setAiFoodLoading(true);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    try {
      if (apiKey && !apiKey.includes('your-gemini')) {
        const parts = [
          {
            text: `You are an expert sports nutritionist. Estimate the calories and macronutrients for this meal: "${
              aiFoodPrompt || 'Uploaded meal photo'
            }". Return ONLY valid JSON with keys: {"name": string, "cal": number, "p": number, "c": number, "f": number}. Use accurate Malaysian/Asian & gym portion values.`,
          },
        ];
        if (foodImageBase64) {
          parts.push({
            inlineData: { mimeType: 'image/jpeg', data: foodImageBase64 },
          });
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
          const newEntry = {
            id: `f-${Date.now()}`,
            name: parsed.name || aiFoodPrompt,
            slot: selectedMealSlot,
            cal: Math.round(Number(parsed.cal) || 350),
            p: Math.round(Number(parsed.p) || 25),
            c: Math.round(Number(parsed.c) || 35),
            f: Math.round(Number(parsed.f) || 10),
          };
          setFoodLogs((prev) => [newEntry, ...prev]);
          setAiFoodPrompt('');
          setFoodImagePreview(null);
          setFoodImageBase64(null);
          showToast(`Logged ${newEntry.name} (${newEntry.cal} kcal)`);
          setAiFoodLoading(false);
          return;
        }
      }

      // Smart Local Portion Parser Fallback if API key is not yet active
      await new Promise((r) => setTimeout(r, 650));
      const lower = aiFoodPrompt.toLowerCase();
      let est = { name: aiFoodPrompt || 'Custom Gym Meal', cal: 420, p: 32, c: 42, f: 12 };
      if (lower.includes('chicken') && lower.includes('rice')) {
        est = { name: aiFoodPrompt, cal: 540, p: 46, c: 62, f: 9 };
      } else if (lower.includes('pork') || lower.includes('noodle') || lower.includes('chu yuk')) {
        est = { name: aiFoodPrompt, cal: 530, p: 34, c: 58, f: 16 };
      } else if (lower.includes('egg')) {
        est = { name: aiFoodPrompt, cal: 285, p: 24, c: 2, f: 19 };
      } else if (lower.includes('salmon')) {
        est = { name: aiFoodPrompt, cal: 460, p: 40, c: 25, f: 22 };
      } else if (lower.includes('oat') || lower.includes('whey')) {
        est = { name: aiFoodPrompt, cal: 440, p: 42, c: 52, f: 6 };
      }
      setFoodLogs((prev) => [{ id: `f-${Date.now()}`, slot: selectedMealSlot, ...est }, ...prev]);
      setAiFoodPrompt('');
      setFoodImagePreview(null);
      setFoodImageBase64(null);
      showToast(`Logged ${est.name} (${est.cal} kcal)`);
    } catch (err) {
      console.error(err);
    } finally {
      setAiFoodLoading(false);
    }
  };

  const handleAddManualFood = (e) => {
    e.preventDefault();
    if (!manualFood.name) return;
    setFoodLogs((prev) => [
      {
        id: `f-${Date.now()}`,
        name: manualFood.name,
        slot: selectedMealSlot,
        cal: Number(manualFood.cal) || 0,
        p: Number(manualFood.p) || 0,
        c: Number(manualFood.c) || 0,
        f: Number(manualFood.f) || 0,
      },
      ...prev,
    ]);
    setManualFood({ name: '', cal: '', p: '', c: '', f: '' });
    setShowManualFoodForm(false);
    showToast('Added custom food entry!');
  };

  // ============================================================================
  // PLATE CALCULATOR & AI COACH
  // ============================================================================
  const plateBreakdown = useMemo(() => {
    const perSide = Math.max(0, (Number(targetBarbellWeight) - Number(barWeight)) / 2);
    let rem = perSide;
    const plates = [
      { w: 25, color: 'bg-red-600 text-white', h: 'h-24' },
      { w: 20, color: 'bg-blue-600 text-white', h: 'h-24' },
      { w: 15, color: 'bg-amber-400 text-zinc-900', h: 'h-20' },
      { w: 10, color: 'bg-emerald-600 text-white', h: 'h-18' },
      { w: 5, color: 'bg-slate-900 text-white', h: 'h-14' },
      { w: 2.5, color: 'bg-slate-500 text-white', h: 'h-12' },
      { w: 1.25, color: 'bg-slate-300 text-slate-900', h: 'h-10' },
    ];
    const result = [];
    plates.forEach((p) => {
      const count = Math.floor((rem + 0.001) / p.w);
      if (count > 0) {
        result.push({ ...p, count });
        rem -= count * p.w;
      }
    });
    return { perSide, result };
  }, [targetBarbellWeight, barWeight]);

  const askAiCoach = async (customPrompt) => {
    const question = customPrompt || coachInput;
    if (!question.trim()) return;
    setCoachMessages((prev) => [...prev, { role: 'user', text: question }]);
    if (!customPrompt) setCoachInput('');
    setCoachLoading(true);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    try {
      if (apiKey && !apiKey.includes('your-gemini')) {
        const contextPayload = {
          date: selectedDate,
          workout: currentWorkout.title,
          exercises: currentWorkout.exercises.map((e) => ({
            name: e.name,
            sets: e.sets.map((s) => `${s.weight}kg x ${s.reps} @ RPE ${s.rpe}`),
          })),
          volumeKg: workoutStats.totalVol,
          avgRpe: workoutStats.avgRpe,
          macrosToday: macroTotals,
          macroTargets: targets,
          bodyweightKg: bodyweightLogs[bodyweightLogs.length - 1]?.weight,
        };

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `You are an elite strength & hypertrophy coach. Here is the lifter's live data: ${JSON.stringify(
                        contextPayload
                      )}. Give specific, actionable advice with exact kg/reps/macro numbers in 3-4 short sentences: ${question}`,
                    },
                  ],
                },
              ],
            }),
          }
        );
        const data = await res.json();
        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply) {
          setCoachMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
          setCoachLoading(false);
          return;
        }
      }

      await new Promise((r) => setTimeout(r, 600));
      const remProtein = Math.max(0, targets.p - macroTotals.p);
      const remCal = Math.max(0, targets.cal - macroTotals.cal);
      setCoachMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `Based on today's ${currentWorkout.title} (${workoutStats.totalVol.toLocaleString()} kg volume, Avg RPE ${
            workoutStats.avgRpe
          }): Keep 1–2 reps in reserve (RPE 8.5–9) on your compound sets and push only the final isolation set to failure (RPE 10). You have ${remCal} kcal and ${remProtein}g protein remaining today—a 150g chicken breast + 200g white rice meal or a 1.5-scoop whey shake will lock in your recovery.`,
        },
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setCoachLoading(false);
    }
  };

  // TDEE & Macro Recommendation Calculation (Mifflin-St Jeor)
  const calculatedTdee = useMemo(() => {
    const bmr = 10 * Number(tdeeForm.weight) + 6.25 * Number(tdeeForm.height) - 5 * Number(tdeeForm.age) + 5;
    const maintenance = Math.round(bmr * Number(tdeeForm.activity));
    let targetCal = maintenance;
    if (tdeeForm.goal === 'cut') targetCal = maintenance - 400;
    if (tdeeForm.goal === 'lean_bulk') targetCal = maintenance + 250;

    // Lifter macros: 2.2g/kg protein, 25% calories from fat, rest carbs
    const p = Math.round(Number(tdeeForm.weight) * 2.2);
    const f = Math.round((targetCal * 0.25) / 9);
    const c = Math.max(50, Math.round((targetCal - p * 4 - f * 9) / 4));
    return { maintenance, cal: targetCal, p, c, f };
  }, [tdeeForm]);

  // Calorie Ring Progress Calculation
  const calPercent = Math.min(100, Math.round((macroTotals.cal / Math.max(1, targets.cal)) * 100));
  const ringRadius = 46;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference - (calPercent / 100) * ringCircumference;

  return (
    <div className="min-h-screen bg-[#F2F2F7] text-[#1C1C1E] pb-32 select-none sm:select-auto">
      {/* Floating Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white px-4 py-2.5 rounded-2xl shadow-xl text-sm font-bold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* =====================================================================
          STICKY TOP FITNESS HEADER (MOBILE-FIRST, APPLE FITNESS VIBE)
      ===================================================================== */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-2xl mx-auto px-4 py-3">
          {/* Row 1: Brand + cbumlogo.png + Active Session Pill */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              {/* Automatically loads /cbumlogo.png from public/ folder */}
              {!logoError ? (
                <img
                  src="/cbumlogo.png"
                  alt="IRONLOG Logo"
                  onError={() => setLogoError(true)}
                  className="w-11 h-11 rounded-2xl object-cover shadow-md border border-slate-200 bg-white shrink-0"
                />
              ) : (
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white shadow-md shadow-orange-500/25 shrink-0">
                  <Dumbbell className="w-6 h-6" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                    IRONLOG
                  </h1>
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      isSupabaseConfigured
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {isSupabaseConfigured ? 'CLOUD READY' : 'PRO'}
                  </span>
                </div>
                {/* Date Switcher Mini Bar */}
                <div className="flex items-center gap-1 mt-0.5">
                  <button
                    onClick={() => shiftDate(-1)}
                    className="p-0.5 rounded-md hover:bg-slate-100 text-slate-500"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="text-xs font-bold text-slate-600 bg-transparent focus:outline-none cursor-pointer"
                  />
                  <button
                    onClick={() => shiftDate(1)}
                    className="p-0.5 rounded-md hover:bg-slate-100 text-slate-500"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Live Workout Timer Pill */}
            <div className="flex items-center gap-1.5 bg-slate-900 text-white px-3.5 py-2 rounded-2xl shadow-sm">
              <div
                className={`w-2 h-2 rounded-full ${
                  sessionRunning ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span className="font-mono font-bold text-base tracking-tight">
                {formatDuration(sessionSeconds)}
              </span>
              <button
                onClick={() => setSessionRunning(!sessionRunning)}
                className="p-1 hover:bg-white/10 rounded-lg active:scale-95 transition"
                title="Play/Pause Workout Timer"
              >
                {sessionRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setSessionSeconds(0)}
                className="p-1 hover:bg-white/10 rounded-lg active:scale-95 transition"
                title="Reset Timer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Row 2: Interactive Rest Timer Bar */}
          <div className="mt-2.5 flex items-center justify-between gap-2 bg-slate-100/90 p-2 rounded-2xl border border-slate-200/70">
            <div className="flex items-center gap-1.5">
              <div
                className={`px-3 py-1.5 rounded-xl font-mono font-extrabold text-sm flex items-center gap-1.5 transition ${
                  restSeconds > 0
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>REST {formatDuration(restSeconds)}</span>
              </div>

              {restSeconds > 0 && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setRestSeconds((s) => Math.max(0, s - 15))}
                    className="px-2 py-1 text-xs font-bold bg-white rounded-lg border border-slate-200 text-slate-700 active:scale-95"
                  >
                    -15s
                  </button>
                  <button
                    onClick={() => setRestSeconds((s) => s + 30)}
                    className="px-2 py-1 text-xs font-bold bg-white rounded-lg border border-slate-200 text-slate-700 active:scale-95"
                  >
                    +30s
                  </button>
                  <button
                    onClick={() => setRestSeconds(0)}
                    className="px-2 py-1 text-xs font-bold bg-red-100 text-red-700 rounded-lg active:scale-95"
                  >
                    Skip
                  </button>
                </div>
              )}
            </div>

            {/* Quick Rest Presets */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {[60, 90, 120, 180].map((sec) => (
                <button
                  key={sec}
                  onClick={() => {
                    setRestPreset(sec);
                    setRestSeconds(sec);
                  }}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 ${
                    restPreset === sec
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  {sec}s
                </button>
              ))}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-600"
                title="Toggle Rest Alarm Sound"
              >
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-400" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* =====================================================================
          MAIN MOBILE CONTAINER (MAX-W-2XL FOR IPHONE / ANDROID ERGONOMICS)
      ===================================================================== */}
      <main className="max-w-2xl mx-auto px-4 pt-4 space-y-5">
        {/* ===================================================================
            TAB 1: WORKOUT LOGGER
        =================================================================== */}
        {activeTab === 'workout' && (
          <div className="space-y-5">
            {/* Hero Fitness Banner Card */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-900 text-white p-5 shadow-lg">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-500/15 px-3 py-1 rounded-full mb-2">
                    <Zap className="w-3.5 h-3.5" /> Active Training Session
                  </span>
                  <input
                    type="text"
                    value={currentWorkout.title}
                    onChange={(e) =>
                      setCurrentWorkout((prev) => ({ ...prev, title: e.target.value }))
                    }
                    className="w-full bg-transparent text-xl sm:text-2xl font-extrabold tracking-tight text-white focus:outline-none border-b border-transparent focus:border-orange-500 pb-0.5"
                  />
                  <p className="text-sm text-slate-300 mt-1">
                    Tap ✓ on any set to log & auto-start your {restPreset}s rest timer.
                  </p>
                </div>
                <button
                  onClick={() => setShowSqlModal(true)}
                  className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition shrink-0"
                  title="Backup & Supabase Sync"
                >
                  <Database className="w-5 h-5" />
                </button>
              </div>

              {/* 3 Big Gym Stat Blocks */}
              <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-white/10">
                <div className="bg-white/5 rounded-2xl p-3">
                  <div className="text-xs font-semibold text-slate-400">VOLUME</div>
                  <div className="text-xl sm:text-2xl font-extrabold mt-0.5">
                    {workoutStats.totalVol.toLocaleString()}{' '}
                    <span className="text-xs font-normal text-slate-400">kg</span>
                  </div>
                </div>
                <div className="bg-white/5 rounded-2xl p-3">
                  <div className="text-xs font-semibold text-slate-400">SETS DONE</div>
                  <div className="text-xl sm:text-2xl font-extrabold mt-0.5 text-emerald-400">
                    {workoutStats.doneSets}
                    <span className="text-sm font-semibold text-slate-400">
                      /{workoutStats.totalSets}
                    </span>
                  </div>
                </div>
                <div className="bg-white/5 rounded-2xl p-3">
                  <div className="text-xs font-semibold text-slate-400">AVG RPE</div>
                  <div className="text-xl sm:text-2xl font-extrabold mt-0.5 text-orange-400">
                    {workoutStats.avgRpe}
                  </div>
                </div>
              </div>

              {/* Save / Cloud Sync Action Bar */}
              <div className="mt-4 flex items-center justify-between gap-2 pt-3 border-t border-white/10">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoStartRest}
                    onChange={(e) => setAutoStartRest(e.target.checked)}
                    className="rounded accent-orange-500 w-4 h-4"
                  />
                  Auto-Rest Timer on ✓
                </label>

                <button
                  onClick={syncSessionToSupabase}
                  disabled={syncingCloud}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {syncingCloud ? 'Syncing...' : 'Finish & Save Session'}
                </button>
              </div>
            </div>

            {/* Workout Split Template Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {Object.keys(WORKOUT_TEMPLATES).map((tplName) => (
                <button
                  key={tplName}
                  onClick={() => {
                    setCurrentWorkout({
                      title: WORKOUT_TEMPLATES[tplName].title,
                      exercises: WORKOUT_TEMPLATES[tplName].exercises,
                    });
                    showToast(`Loaded ${tplName} template`);
                  }}
                  className={`px-4 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition active:scale-95 ${
                    currentWorkout.title.startsWith(tplName)
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md shadow-orange-500/20'
                      : 'bg-white text-slate-700 border border-slate-200/90 shadow-2xs'
                  }`}
                >
                  {tplName}
                </button>
              ))}
              <button
                onClick={() => setShowExercisePicker(true)}
                className="px-4 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap bg-slate-900 text-white flex items-center gap-1.5 active:scale-95 shrink-0"
              >
                <Plus className="w-4 h-4" /> Add Exercise
              </button>
            </div>

            {/* Exercise Cards List */}
            <div className="space-y-4">
              {currentWorkout.exercises.map((ex, exIndex) => (
                <div
                  key={ex.id}
                  className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-slate-200/80 transition"
                >
                  {/* Exercise Card Header */}
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="w-7 h-7 rounded-xl bg-orange-100 text-orange-700 font-extrabold text-sm flex items-center justify-center">
                          {exIndex + 1}
                        </span>
                        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                          {ex.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {ex.muscle} · {ex.equipment}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          Target / Prev: <strong className="text-slate-800">{ex.prevBest}</strong>
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => removeExercise(ex.id)}
                      className="p-2 text-slate-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition"
                      title="Remove Exercise"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Column Labels */}
                  <div className="grid grid-cols-12 gap-2 px-2 pb-2 text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    <div className="col-span-2">SET</div>
                    <div className="col-span-3 text-center">KG</div>
                    <div className="col-span-3 text-center">REPS</div>
                    <div className="col-span-2 text-center">RPE</div>
                    <div className="col-span-2 text-right">DONE</div>
                  </div>

                  {/* Sets Rows */}
                  <div className="space-y-2.5">
                    {ex.sets.map((s) => {
                      const e1rm = calc1RM(s.weight, s.reps);
                      const badgeStyle =
                        s.type === 'W'
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : s.type === 'D'
                          ? 'bg-purple-100 text-purple-800 border-purple-300'
                          : s.type === 'F'
                          ? 'bg-red-100 text-red-800 border-red-300'
                          : 'bg-slate-100 text-slate-800 border-slate-200';

                      return (
                        <div
                          key={s.id}
                          className={`grid grid-cols-12 items-center gap-2 p-2.5 rounded-2xl border transition ${
                            s.done
                              ? 'bg-emerald-50/90 border-emerald-300'
                              : 'bg-slate-50/70 border-slate-200/80'
                          }`}
                        >
                          {/* Set Type Button (Tap to cycle Working -> Warmup W -> Dropset D -> Failure F) */}
                          <div className="col-span-2 flex flex-col items-start">
                            <button
                              onClick={() => cycleSetType(ex.id, s.id)}
                              className={`w-10 h-11 rounded-xl font-extrabold text-sm border flex items-center justify-center active:scale-95 ${badgeStyle}`}
                              title="Tap to cycle Set Type: Working / Warmup (W) / Dropset (D) / Failure (F)"
                            >
                              {s.type}
                            </button>
                          </div>

                          {/* Weight Input (Large 18px Apple font) */}
                          <div className="col-span-3">
                            <input
                              type="number"
                              step="0.5"
                              value={s.weight}
                              onChange={(e) =>
                                updateSetField(ex.id, s.id, 'weight', e.target.value)
                              }
                              className="w-full h-11 text-center font-extrabold text-lg bg-white rounded-xl border border-slate-300 focus:border-orange-500 focus:outline-none shadow-2xs"
                            />
                          </div>

                          {/* Reps Input */}
                          <div className="col-span-3">
                            <input
                              type="number"
                              value={s.reps}
                              onChange={(e) =>
                                updateSetField(ex.id, s.id, 'reps', e.target.value)
                              }
                              className="w-full h-11 text-center font-extrabold text-lg bg-white rounded-xl border border-slate-300 focus:border-orange-500 focus:outline-none shadow-2xs"
                            />
                          </div>

                          {/* RPE Selector */}
                          <div className="col-span-2">
                            <select
                              value={s.rpe}
                              onChange={(e) =>
                                updateSetField(ex.id, s.id, 'rpe', e.target.value)
                              }
                              className="w-full h-11 text-center font-bold text-sm bg-white rounded-xl border border-slate-300 focus:border-orange-500 focus:outline-none"
                            >
                              {[6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10].map((val) => (
                                <option key={val} value={val}>
                                  {val}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Done Check Button */}
                          <div className="col-span-2 flex justify-end items-center">
                            <button
                              onClick={() => toggleSetDone(ex.id, s.id)}
                              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition active:scale-90 ${
                                s.done
                                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                                  : 'bg-white text-slate-400 border border-slate-300 hover:border-slate-400'
                              }`}
                            >
                              <Check className="w-6 h-6 stroke-[2.5]" />
                            </button>
                          </div>

                          {/* Bottom Sub-row: 1RM Estimate & Quick Weight Bumpers */}
                          <div className="col-span-12 flex items-center justify-between px-1 pt-1 text-xs text-slate-500">
                            <span className="font-semibold flex items-center gap-1">
                              Est. 1RM: <strong className="text-slate-900">{e1rm} kg</strong>
                              {e1rm >= 100 && (
                                <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                                  PR PACE
                                </span>
                              )}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() =>
                                  updateSetField(
                                    ex.id,
                                    s.id,
                                    'weight',
                                    Math.max(0, Number(s.weight) - 2.5)
                                  )
                                }
                                className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 font-bold text-slate-700 active:scale-95"
                              >
                                -2.5kg
                              </button>
                              <button
                                onClick={() =>
                                  updateSetField(ex.id, s.id, 'weight', Number(s.weight) + 2.5)
                                }
                                className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 font-bold text-slate-700 active:scale-95"
                              >
                                +2.5kg
                              </button>
                              <button
                                onClick={() => removeSet(ex.id, s.id)}
                                className="text-slate-400 hover:text-red-500 ml-1 font-semibold"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add Set Button */}
                  <button
                    onClick={() => addSetToExercise(ex.id)}
                    className="mt-3 w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 font-bold text-sm flex items-center justify-center gap-1.5 transition active:scale-99"
                  >
                    <Plus className="w-4 h-4" /> Add Set
                  </button>
                </div>
              ))}
            </div>

            {/* Big Bottom Add Exercise Button */}
            <button
              onClick={() => setShowExercisePicker(true)}
              className="w-full py-4 rounded-3xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-extrabold text-base shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 active:scale-99 transition"
            >
              <Plus className="w-5 h-5" /> Add Exercise to Workout
            </button>
          </div>
        )}

        {/* ===================================================================
            TAB 2: NUTRITION & AI CALORIES
        =================================================================== */}
        {activeTab === 'nutrition' && (
          <div className="space-y-5">
            {/* Apple Fitness Style Calorie Ring & Macro Progress Card */}
            <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-extrabold text-slate-900">
                  Daily Macros ({selectedDate})
                </h3>
                <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-orange-50 text-orange-700">
                  {Math.max(0, targets.cal - macroTotals.cal)} kcal remaining
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                {/* Left: SVG Calorie Ring */}
                <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                  <svg className="w-28 h-28 -rotate-90" viewBox="0 0 108 108">
                    <circle
                      cx="54"
                      cy="54"
                      r={ringRadius}
                      stroke="#F1F5F9"
                      strokeWidth="10"
                      fill="transparent"
                    />
                    <circle
                      cx="54"
                      cy="54"
                      r={ringRadius}
                      stroke="#F97316"
                      strokeWidth="10"
                      strokeDasharray={ringCircumference}
                      strokeDashoffset={ringOffset}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-xl font-extrabold text-slate-900">
                      {macroTotals.cal}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      / {targets.cal} kcal
                    </span>
                  </div>
                </div>

                {/* Right: Protein, Carbs, Fats Progress Bars */}
                <div className="flex-1 space-y-3">
                  {/* Protein */}
                  <div>
                    <div className="flex justify-between text-sm font-bold mb-1">
                      <span className="text-slate-800">Protein</span>
                      <span className="text-emerald-600">
                        {macroTotals.p}g / {targets.p}g
                      </span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{
                          width: `${Math.min(100, (macroTotals.p / Math.max(1, targets.p)) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Carbs */}
                  <div>
                    <div className="flex justify-between text-sm font-bold mb-1">
                      <span className="text-slate-800">Carbs</span>
                      <span className="text-blue-600">
                        {macroTotals.c}g / {targets.c}g
                      </span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{
                          width: `${Math.min(100, (macroTotals.c / Math.max(1, targets.c)) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Fats */}
                  <div>
                    <div className="flex justify-between text-sm font-bold mb-1">
                      <span className="text-slate-800">Fats</span>
                      <span className="text-amber-600">
                        {macroTotals.f}g / {targets.f}g
                      </span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all"
                        style={{
                          width: `${Math.min(100, (macroTotals.f / Math.max(1, targets.f)) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Food Scanner & Natural Language Calculator */}
            <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    AI Calorie & Macro Scanner
                  </h3>
                </div>
                <select
                  value={selectedMealSlot}
                  onChange={(e) => setSelectedMealSlot(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 font-bold text-sm text-slate-800"
                >
                  {['Breakfast', 'Pre-Workout', 'Post-Workout', 'Lunch', 'Dinner', 'Snack'].map(
                    (slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    )
                  )}
                </select>
              </div>

              <textarea
                rows={2}
                value={aiFoodPrompt}
                onChange={(e) => setAiFoodPrompt(e.target.value)}
                placeholder="Type what you ate (e.g. '200g chicken breast, 1 bowl white rice, 2 eggs' or '1 bowl pork noodle')..."
                className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-orange-500 focus:outline-none text-base font-medium"
              />

              {foodImagePreview && (
                <div className="relative w-28 h-28 rounded-2xl overflow-hidden border border-slate-200">
                  <img
                    src={foodImagePreview}
                    alt="Meal preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => {
                      setFoodImagePreview(null);
                      setFoodImageBase64(null);
                    }}
                    className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2">
                <label className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm flex items-center gap-2 cursor-pointer active:scale-95 transition">
                  <Camera className="w-5 h-5 text-slate-600" />
                  <span>Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>

                <button
                  onClick={handleAnalyzeFoodWithAI}
                  disabled={aiFoodLoading}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-extrabold text-base shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 active:scale-98 transition disabled:opacity-50"
                >
                  <Sparkles className="w-5 h-5" />
                  {aiFoodLoading ? 'Analyzing Meal...' : 'AI Calculate & Log'}
                </button>
              </div>
            </div>

            {/* 1-Tap Gym Staples Grid */}
            <div>
              <div className="flex items-center justify-between mb-2.5 px-1">
                <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-500">
                  1-Tap Gym Staples
                </h4>
                <button
                  onClick={() => setShowManualFoodForm(!showManualFoodForm)}
                  className="text-xs font-extrabold text-orange-600 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Custom Macro Entry
                </button>
              </div>

              {showManualFoodForm && (
                <form
                  onSubmit={handleAddManualFood}
                  className="bg-white p-4 rounded-3xl border border-slate-200 mb-3 space-y-3 shadow-xs"
                >
                  <input
                    type="text"
                    placeholder="Food Name (e.g. Double Whey Shake)"
                    value={manualFood.name}
                    onChange={(e) => setManualFood({ ...manualFood, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                  />
                  <div className="grid grid-cols-4 gap-2">
                    <input
                      type="number"
                      placeholder="kcal"
                      value={manualFood.cal}
                      onChange={(e) => setManualFood({ ...manualFood, cal: e.target.value })}
                      className="px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-center"
                    />
                    <input
                      type="number"
                      placeholder="Prot (g)"
                      value={manualFood.p}
                      onChange={(e) => setManualFood({ ...manualFood, p: e.target.value })}
                      className="px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-center"
                    />
                    <input
                      type="number"
                      placeholder="Carb (g)"
                      value={manualFood.c}
                      onChange={(e) => setManualFood({ ...manualFood, c: e.target.value })}
                      className="px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-center"
                    />
                    <input
                      type="number"
                      placeholder="Fat (g)"
                      value={manualFood.f}
                      onChange={(e) => setManualFood({ ...manualFood, f: e.target.value })}
                      className="px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-center"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm"
                  >
                    Add to Today's Log
                  </button>
                </form>
              )}

              <div className="grid grid-cols-2 gap-2.5">
                {GYM_FOOD_STAPLES.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      setFoodLogs((prev) => [{ id: `f-${Date.now()}`, ...item }, ...prev]);
                      showToast(`Added ${item.name}`);
                    }}
                    className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs text-left hover:border-orange-400 active:scale-98 transition flex items-start gap-2.5"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-sm text-slate-900 truncate">
                        {item.name}
                      </div>
                      <div className="text-xs font-bold text-orange-600 mt-0.5">
                        {item.cal} kcal · {item.p}g P
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Logged Meals Today */}
            <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-3">
              <h3 className="text-lg font-extrabold text-slate-900">
                Logged Meals ({foodLogs.length})
              </h3>
              {foodLogs.length === 0 ? (
                <p className="text-sm text-slate-400 py-4 text-center">
                  No meals logged for this date yet. Tap a staple above or use the AI scanner!
                </p>
              ) : (
                <div className="space-y-2.5">
                  {foodLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70"
                    >
                      <div>
                        <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-orange-100 text-orange-800">
                          {log.slot}
                        </span>
                        <div className="font-bold text-base text-slate-900 mt-1">
                          {log.name}
                        </div>
                        <div className="text-xs font-semibold text-slate-500 mt-0.5">
                          <strong className="text-slate-800">{log.cal} kcal</strong> · P:{' '}
                          {log.p}g · C: {log.c}g · F: {log.f}g
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          setFoodLogs((prev) => prev.filter((f) => f.id !== log.id))
                        }
                        className="p-2 text-slate-400 hover:text-red-600 rounded-xl"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 3: AI COACH & BARBELL PLATE CALCULATOR
        =================================================================== */}
        {activeTab === 'coach' && (
          <div className="space-y-5">
            {/* AI Strength & Nutrition Personal Assistant Chat */}
            <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 text-white flex items-center justify-center shadow-sm shrink-0">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    AI Gym Personal Assistant
                  </h3>
                  <p className="text-xs font-medium text-slate-500">
                    Synced with your live sets, RPE & daily macros
                  </p>
                </div>
              </div>

              {/* 1-Tap Quick Coach Prompts */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {COACH_QUICK_PROMPTS.map((q) => (
                  <button
                    key={q}
                    onClick={() => askAiCoach(q)}
                    className="px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 font-bold text-xs whitespace-nowrap border border-orange-200/60 active:scale-95 transition"
                  >
                    {q}
                  </button>
                ))}
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {coachMessages.map((m, i) => (
                  <div
                    key={i}
                    className={`p-3.5 rounded-2xl text-sm sm:text-base leading-relaxed font-medium ${
                      m.role === 'user'
                        ? 'bg-slate-900 text-white ml-8'
                        : 'bg-slate-100 text-slate-800 mr-4'
                    }`}
                  >
                    {m.text}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={coachInput}
                  onChange={(e) => setCoachInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && askAiCoach()}
                  placeholder="Ask about form, RPE, next set weight, or meals..."
                  className="flex-1 h-12 px-4 rounded-2xl bg-slate-50 border border-slate-300 focus:border-orange-500 focus:outline-none font-medium"
                />
                <button
                  onClick={() => askAiCoach()}
                  disabled={coachLoading}
                  className="h-12 px-5 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-extrabold text-sm active:scale-95 transition"
                >
                  {coachLoading ? '...' : 'Ask'}
                </button>
              </div>
            </div>

            {/* Barbell & Smith Machine Plate Calculator */}
            <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-orange-600" /> Plate & Warm-Up Calculator
                </h3>
                {/* Bar Weight Selector (Olympic 20kg / 15kg / Smith 10kg) */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                  {[
                    { label: '20kg Bar', w: 20 },
                    { label: '15kg Bar', w: 15 },
                    { label: '10kg Smith', w: 10 },
                  ].map((b) => (
                    <button
                      key={b.w}
                      onClick={() => setBarWeight(b.w)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                        barWeight === b.w
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-500'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Target Lift (kg)
                  </label>
                  <input
                    type="number"
                    step="2.5"
                    value={targetBarbellWeight}
                    onChange={(e) => setTargetBarbellWeight(e.target.value)}
                    className="w-full mt-1 h-12 px-3 rounded-2xl bg-slate-50 border border-slate-300 font-extrabold text-xl text-center"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Load Per Side
                  </label>
                  <div className="mt-1 h-12 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center font-extrabold text-xl text-orange-700">
                    {plateBreakdown.perSide} kg / side
                  </div>
                </div>
              </div>

              {/* Visual Plate Graphic */}
              <div className="flex items-center justify-center gap-1.5 py-4 bg-slate-50 rounded-2xl border border-slate-200/80 min-h-28 overflow-x-auto">
                <div className="w-8 h-3 bg-slate-400 rounded-l-full" />
                <div className="w-3 h-10 bg-slate-500 rounded-xs" />
                {plateBreakdown.result.map((p, idx) =>
                  Array.from({ length: p.count }).map((_, i) => (
                    <div
                      key={`${idx}-${i}`}
                      className={`${p.color} ${p.h} px-2 rounded-md flex items-center justify-center font-extrabold text-xs shadow-xs`}
                    >
                      {p.w}
                    </div>
                  ))
                )}
                <div className="w-6 h-3 bg-slate-400 rounded-r-full" />
              </div>

              {/* Warm-Up Ramp Generator */}
              <div>
                <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                  Recommended Warm-Up Sets (Tap to set target)
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { pct: '40%', reps: '8 reps', mult: 0.4 },
                    { pct: '60%', reps: '5 reps', mult: 0.6 },
                    { pct: '75%', reps: '3 reps', mult: 0.75 },
                    { pct: '85%', reps: '1 rep', mult: 0.85 },
                  ].map((ramp) => {
                    const w = Math.max(
                      barWeight,
                      Math.round((Number(targetBarbellWeight) * ramp.mult) / 2.5) * 2.5
                    );
                    return (
                      <button
                        key={ramp.pct}
                        onClick={() => setTargetBarbellWeight(w)}
                        className="p-2.5 rounded-2xl bg-slate-50 hover:bg-orange-50 border border-slate-200 text-center transition"
                      >
                        <div className="text-xs font-bold text-orange-600">{ramp.pct}</div>
                        <div className="text-base font-extrabold text-slate-900">{w}kg</div>
                        <div className="text-[11px] font-medium text-slate-500">
                          {ramp.reps}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 4: PROGRESS, PR LEADERBOARD & TDEE CALCULATOR
        =================================================================== */}
        {activeTab === 'progress' && (
          <div className="space-y-5">
            {/* Estimated 1RM PR Leaderboard */}
            <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" /> Estimated 1RM Records
                </h3>
                <span className="text-xs font-bold text-slate-400">Epley Formula</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {prLeaderboard.slice(0, 6).map((item) => (
                  <div
                    key={item.name}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-sm text-slate-900">{item.name}</div>
                      <div className="text-xs font-semibold text-slate-500">
                        Best Set: {item.weight}kg × {item.reps}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-extrabold text-orange-600">
                        {item.e1rm} kg
                      </div>
                      <div className="text-[10px] font-bold uppercase text-slate-400">
                        Est. 1RM
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Morning Weigh-In Tracker */}
            <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    Morning Bodyweight Trend
                  </h3>
                  <p className="text-xs font-medium text-slate-500">
                    7-Day Moving Average:{' '}
                    <strong className="text-slate-800">
                      {(
                        bodyweightLogs.reduce((a, b) => a + Number(b.weight), 0) /
                        bodyweightLogs.length
                      ).toFixed(1)}{' '}
                      kg
                    </strong>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    value={newWeightInput}
                    onChange={(e) => setNewWeightInput(e.target.value)}
                    className="w-24 h-10 text-center font-extrabold rounded-xl bg-slate-50 border border-slate-300"
                  />
                  <button
                    onClick={() => {
                      setBodyweightLogs((prev) => [
                        ...prev.slice(1),
                        { date: 'Today', weight: Number(newWeightInput) || 74.2 },
                      ]);
                      showToast(`Logged morning weight: ${newWeightInput} kg`);
                    }}
                    className="h-10 px-3.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
                  >
                    Log kg
                  </button>
                </div>
              </div>

              {/* Clean Visual Bar Trend */}
              <div className="grid grid-cols-7 gap-2 pt-3 items-end h-36 bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                {bodyweightLogs.map((item, idx) => {
                  const pct = Math.min(100, Math.max(25, ((item.weight - 72.5) / 3.5) * 100));
                  return (
                    <div
                      key={idx}
                      className="flex flex-col items-center gap-1.5 h-full justify-end"
                    >
                      <span className="text-[11px] font-extrabold text-slate-700">
                        {item.weight}
                      </span>
                      <div
                        className="w-full max-w-[28px] rounded-t-xl bg-gradient-to-t from-orange-500 to-amber-400"
                        style={{ height: `${pct}%` }}
                      />
                      <span className="text-[10px] font-bold text-slate-400">
                        {item.date}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive TDEE & Lifter Macro Calculator */}
            <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    TDEE & Lifter Macro Calculator
                  </h3>
                  <p className="text-xs font-medium text-slate-500">
                    Mifflin-St Jeor formula + 2.2g/kg protein for strength athletes
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
                  <label className="text-[11px] font-bold text-slate-500">Weight (kg)</label>
                  <input
                    type="number"
                    value={tdeeForm.weight}
                    onChange={(e) => setTdeeForm({ ...tdeeForm, weight: e.target.value })}
                    className="w-full mt-1 font-extrabold text-base bg-white rounded-xl border border-slate-300 px-2 py-1 text-center"
                  />
                </div>
                <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
                  <label className="text-[11px] font-bold text-slate-500">Height (cm)</label>
                  <input
                    type="number"
                    value={tdeeForm.height}
                    onChange={(e) => setTdeeForm({ ...tdeeForm, height: e.target.value })}
                    className="w-full mt-1 font-extrabold text-base bg-white rounded-xl border border-slate-300 px-2 py-1 text-center"
                  />
                </div>
                <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
                  <label className="text-[11px] font-bold text-slate-500">Age</label>
                  <input
                    type="number"
                    value={tdeeForm.age}
                    onChange={(e) => setTdeeForm({ ...tdeeForm, age: e.target.value })}
                    className="w-full mt-1 font-extrabold text-base bg-white rounded-xl border border-slate-300 px-2 py-1 text-center"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'cut', label: 'Fat Loss (-400)' },
                  { id: 'recomp', label: 'Recomp (Maint.)' },
                  { id: 'lean_bulk', label: 'Lean Bulk (+250)' },
                ].map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setTdeeForm({ ...tdeeForm, goal: g.id })}
                    className={`py-2.5 px-2 rounded-2xl font-bold text-xs border transition ${
                      tdeeForm.goal === g.id
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200/80 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <div className="text-xs font-bold text-orange-800">
                    Recommended Daily Target
                  </div>
                  <div className="text-xl font-extrabold text-slate-900 mt-0.5">
                    {calculatedTdee.cal} kcal{' '}
                    <span className="text-xs font-bold text-slate-600">
                      ({calculatedTdee.p}g P · {calculatedTdee.c}g C · {calculatedTdee.f}g F)
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setTargets({
                      cal: calculatedTdee.cal,
                      p: calculatedTdee.p,
                      c: calculatedTdee.c,
                      f: calculatedTdee.f,
                    });
                    showToast('Applied new daily macro targets!');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-extrabold text-xs shadow-sm active:scale-95"
                >
                  Apply Targets
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* =====================================================================
          EXERCISE PICKER DRAWER (MODAL)
      ===================================================================== */}
      {showExercisePicker && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-extrabold text-slate-900">Select Exercise</h3>
              <button
                onClick={() => setShowExercisePicker(false)}
                className="p-2 rounded-full bg-slate-100 text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative mb-3">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={exerciseSearch}
                onChange={(e) => setExerciseSearch(e.target.value)}
                placeholder="Search bench, squat, row, lateral raise..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-100 font-medium focus:outline-none"
              />
            </div>

            {/* Muscle Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar mb-3 pb-1">
              {['All', 'Chest', 'Back', 'Shoulders', 'Legs', 'Triceps', 'Biceps'].map((m) => (
                <button
                  key={m}
                  onClick={() => setMuscleFilter(m)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap ${
                    muscleFilter === m
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <div className="overflow-y-auto space-y-2 flex-1 pr-1">
              {EXERCISE_LIBRARY.filter((e) => {
                const matchesMuscle = muscleFilter === 'All' || e.muscle === muscleFilter;
                const matchesText =
                  e.name.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
                  e.equipment.toLowerCase().includes(exerciseSearch.toLowerCase());
                return matchesMuscle && matchesText;
              }).map((item) => (
                <button
                  key={item.name}
                  onClick={() => addExerciseFromLibrary(item)}
                  className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-orange-50 border border-slate-200/80 flex items-center justify-between text-left transition"
                >
                  <div>
                    <div className="font-extrabold text-base text-slate-900">
                      {item.name}
                    </div>
                    <div className="text-xs font-bold text-slate-500 mt-0.5">
                      {item.muscle} · {item.equipment} · Best: {item.defaultBest}
                    </div>
                  </div>
                  <Plus className="w-5 h-5 text-orange-600 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          SUPABASE SQL & BACKUP MODAL
      ===================================================================== */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-slate-900">
                Data Backup & Supabase Cloud Status
              </h3>
              <button
                onClick={() => setShowSqlModal(false)}
                className="p-2 rounded-full bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div
              className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center gap-2.5 ${
                isSupabaseConfigured
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}
            >
              <Database className="w-5 h-5 shrink-0" />
              <span>
                {isSupabaseConfigured
                  ? 'Connected to your Supabase project via VITE_SUPABASE_URL!'
                  : 'Running in Local Device Storage mode. Add VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY to .env for cloud sync.'}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  const blob = new Blob(
                    [
                      JSON.stringify(
                        { workoutHistory, foodLogsByDate, targets, bodyweightLogs },
                        null,
                        2
                      ),
                    ],
                    { type: 'application/json' }
                  );
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `ironlog-backup-${selectedDate}.json`;
                  a.click();
                  showToast('Exported JSON backup!');
                }}
                className="flex-1 py-3 rounded-2xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Export Backup JSON
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          APPLE iOS-STYLE FIXED BOTTOM TAB NAVIGATION BAR
      ===================================================================== */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 pb-safe shadow-lg">
        <div className="max-w-2xl mx-auto grid grid-cols-4 px-2 py-2">
          {[
            {
              id: 'workout',
              label: 'Workout',
              icon: Dumbbell,
              badge: `${workoutStats.doneSets}/${workoutStats.totalSets}`,
            },
            {
              id: 'nutrition',
              label: 'Nutrition',
              icon: Flame,
              badge: `${macroTotals.cal}`,
            },
            { id: 'coach', label: 'AI Coach', icon: Brain, badge: 'AI' },
            {
              id: 'progress',
              label: 'Progress',
              icon: TrendingUp,
              badge: `${bodyweightLogs[bodyweightLogs.length - 1]?.weight || 74.2}kg`,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center py-1.5 rounded-2xl transition active:scale-95 ${
                  active ? 'text-orange-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <div className="flex items-center gap-1">
                  <Icon className={`w-6 h-6 ${active ? 'stroke-[2.5]' : 'stroke-2'}`} />
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      active
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {tab.badge}
                  </span>
                </div>
                <span className={`text-xs mt-1 ${active ? 'font-extrabold' : 'font-semibold'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}