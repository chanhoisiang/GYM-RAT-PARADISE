import React, { useState, useEffect, useRef } from 'react';
import {
  Database, CheckCircle2, Plus, Trash2, Check, X, Search,
  Clock, Play, Pause, Edit3, Flame, ChevronDown, ChevronLeft, ChevronRight
} from 'lucide-react';
import { WORKOUT_TEMPLATES, EXERCISE_LIBRARY, calc1RM, formatDuration } from './gymConstants';
import MuscleHeatmapCard from './MuscleHeatmapCard';
import AnatomyIllustration from './AnatomyIllustration';

/**
 * Custom Gesture Hook: Swipe Right to Return / Close Drawer or Modal
 */
export function useSwipeRightToClose(onClose, threshold = 65) {
  const startX = useRef(null);
  const startY = useRef(null);
  const [dragOffset, setDragOffset] = useState(0);

  const onTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
  };

  const onTouchMove = (e) => {
    if (startX.current === null || startY.current === null) return;
    const dx = e.touches[0].clientX - startX.current;
    const dy = Math.abs(e.touches[0].clientY - startY.current);
    // Only track horizontal right swipes
    if (dx > 0 && dx > dy) {
      setDragOffset(dx);
    }
  };

  const onTouchEnd = () => {
    if (dragOffset > threshold && onClose) {
      onClose();
    }
    setDragOffset(0);
    startX.current = null;
    startY.current = null;
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    style: dragOffset > 0 ? { transform: `translateX(${dragOffset}px)`, transition: 'none' } : undefined,
  };
}

export default function WorkoutTab({
  currentWorkout,
  setCurrentWorkout,
  workoutStats,
  unit,
  autoStartRest,
  setAutoStartRest,
  restPreset,
  setRestPreset,
  restSeconds,
  setRestSeconds,
  sessionSeconds = 1740,
  sessionRunning = true,
  setSessionRunning = () => {},
  syncSessionToSupabase,
  syncingCloud,
  setShowSqlModal,
  showToast,
}) {
  const [activeExIdx, setActiveExIdx] = useState(0);
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [showHeatmapModal, setShowHeatmapModal] = useState(false);
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [muscleFilter, setMuscleFilter] = useState('All');
  const [setModalData, setSetModalData] = useState(null);

  // Swipe gestures for modals
  const setModalSwipe = useSwipeRightToClose(() => setSetModalData(null));
  const pickerModalSwipe = useSwipeRightToClose(() => setShowExercisePicker(false));
  const heatmapModalSwipe = useSwipeRightToClose(() => setShowHeatmapModal(false));

  // Horizontal swipe on Exercise Card to switch between exercises
  const cardTouchX = useRef(null);
  const handleCardTouchStart = (e) => {
    cardTouchX.current = e.touches[0].clientX;
  };
  const handleCardTouchEnd = (e) => {
    if (cardTouchX.current === null) return;
    const dx = e.changedTouches[0].clientX - cardTouchX.current;
    if (dx > 75 && activeExIdx > 0) {
      setActiveExIdx((i) => i - 1);
    } else if (dx < -75 && activeExIdx < currentWorkout.exercises.length - 1) {
      setActiveExIdx((i) => i + 1);
    }
    cardTouchX.current = null;
  };

  useEffect(() => {
    if (activeExIdx >= currentWorkout.exercises.length) {
      setActiveExIdx(Math.max(0, currentWorkout.exercises.length - 1));
    }
  }, [currentWorkout.exercises.length, activeExIdx]);

  const getContextualMuscle = () => {
    const t = currentWorkout.title.toLowerCase();
    if (t.includes('chest') || t.includes('push')) return 'Chest';
    if (t.includes('back') || t.includes('pull')) return 'Back';
    if (t.includes('leg') || t.includes('squat') || t.includes('lower')) return 'Legs';
    if (t.includes('shoulder')) return 'Shoulders';
    if (t.includes('arm')) return 'Biceps';
    return currentWorkout.exercises[activeExIdx]?.muscle || 'All';
  };

  const activeExercise = currentWorkout.exercises[activeExIdx];

  const cycleRestPreset = () => {
    const presets = [60, 90, 120, 180];
    const next = presets[(presets.indexOf(restPreset) + 1) % presets.length] || 90;
    if (setRestPreset) setRestPreset(next);
    showToast(`Rest timer preset: ${next}s`);
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

  const openAddSetModal = (ex) => {
    const lastSet = ex.sets[ex.sets.length - 1] || { weight: 60, reps: 10, rpe: 8.5 };
    setSetModalData({
      mode: 'add',
      exId: ex.id,
      exName: ex.name,
      setId: `s-${Date.now()}`,
      type: String(ex.sets.length + 1),
      weight: Number(lastSet.weight) || 60,
      reps: Number(lastSet.reps) || 10,
      rpe: Number(lastSet.rpe) || 8.5,
      done: true,
    });
  };

  const openEditSetModal = (ex, s) => {
    setSetModalData({
      mode: 'edit',
      exId: ex.id,
      exName: ex.name,
      setId: s.id,
      type: s.type,
      weight: Number(s.weight) || 0,
      reps: Number(s.reps) || 0,
      rpe: Number(s.rpe) || 8.5,
      done: s.done,
    });
  };

  const handleSaveSetModal = (e) => {
    e.preventDefault();
    if (!setModalData) return;

    setCurrentWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) => {
        if (ex.id !== setModalData.exId) return ex;
        if (setModalData.mode === 'add') {
          return {
            ...ex,
            sets: [
              ...ex.sets,
              {
                id: setModalData.setId,
                type: setModalData.type,
                weight: Number(setModalData.weight) || 0,
                reps: Number(setModalData.reps) || 0,
                rpe: Number(setModalData.rpe) || 8.5,
                done: setModalData.done,
              },
            ],
          };
        }
        return {
          ...ex,
          sets: ex.sets.map((s) =>
            s.id !== setModalData.setId
              ? s
              : {
                  ...s,
                  type: setModalData.type,
                  weight: Number(setModalData.weight) || 0,
                  reps: Number(setModalData.reps) || 0,
                  rpe: Number(setModalData.rpe) || 8.5,
                  done: setModalData.done,
                }
          ),
        };
      }),
    }));

    if (setModalData.done && autoStartRest) {
      setRestSeconds(restPreset);
    }
    showToast(
      setModalData.mode === 'add'
        ? `Logged ${setModalData.weight}${unit.toLowerCase()} × ${setModalData.reps}`
        : 'Updated set'
    );
    setSetModalData(null);
  };

  const handleDeleteSetFromModal = () => {
    if (!setModalData) return;
    setCurrentWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) =>
        ex.id !== setModalData.exId
          ? ex
          : { ...ex, sets: ex.sets.filter((s) => s.id !== setModalData.setId) }
      ),
    }));
    setSetModalData(null);
    showToast('Deleted set');
  };

  const removeExercise = (exId) => {
    setCurrentWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((ex) => ex.id !== exId),
    }));
  };

  const addExerciseFromLibrary = (item) => {
    const newIndex = currentWorkout.exercises.length;
    setCurrentWorkout((prev) => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        {
          id: `ex-${Date.now()}`,
          name: item.name,
          muscle: item.muscle,
          equipment: item.equipment,
          imageUrl: item.imageUrl || null,
          prevBest: item.defaultBest || 'New Lift',
          sets: [
            { id: `s-${Date.now()}-1`, type: '1', weight: 40, reps: 10, rpe: 8.0, done: false },
          ],
        },
      ],
    }));
    setActiveExIdx(newIndex);
    setShowExercisePicker(false);
    showToast(`Added ${item.name}`);
  };

  return (
    <div className="space-y-3 max-w-5xl mx-auto">
      {/* =====================================================================
           FLOATING POP-OUT REST COUNTDOWN PILL
      ===================================================================== */}
      {restSeconds > 0 && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 backdrop-blur-md text-white px-5 py-2.5 rounded-2xl shadow-2xl border border-white/15 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-400 animate-spin" />
            <span className="text-lg font-mono font-extrabold text-white">
              {formatDuration(restSeconds)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setRestSeconds((s) => Math.max(0, s - 15))}
              className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold"
            >
              -15s
            </button>
            <button
              onClick={() => setRestSeconds((s) => s + 30)}
              className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold"
            >
              +30s
            </button>
            <button
              onClick={() => setRestSeconds(0)}
              className="px-2.5 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-xs font-bold"
            >
              Skip
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          1. RESPONSIVE HUD HEADER (NO TRUNCATED WORKOUT TITLE)
      ===================================================================== */}
      <div className="rounded-3xl bg-slate-900 text-white p-4 shadow-md border border-slate-800 space-y-3">
        {/* Row 1: Split Selector + Full Visible Workout Title */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
          <div className="flex items-center gap-2 w-full">
            <div className="relative shrink-0">
              <select
                value={
                  Object.keys(WORKOUT_TEMPLATES).find((k) =>
                    currentWorkout.title.startsWith(k)
                  ) || ''
                }
                onChange={(e) => {
                  const tplName = e.target.value;
                  if (!tplName) return;
                  setCurrentWorkout({
                    title: WORKOUT_TEMPLATES[tplName].title,
                    exercises: WORKOUT_TEMPLATES[tplName].exercises,
                  });
                  setActiveExIdx(0);
                  showToast(`Switched to ${tplName}`);
                }}
                className="appearance-none bg-orange-500/20 text-orange-400 border border-orange-500/30 font-extrabold text-xs rounded-xl pl-3 pr-7 py-2 focus:outline-none cursor-pointer"
              >
                <option value="" disabled>
                  Switch Split
                </option>
                {Object.keys(WORKOUT_TEMPLATES).map((tplName) => (
                  <option key={tplName} value={tplName} className="bg-slate-900 text-white">
                    {tplName}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-orange-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <input
              type="text"
              value={currentWorkout.title}
              onChange={(e) =>
                setCurrentWorkout((prev) => ({ ...prev, title: e.target.value }))
              }
              className="flex-1 min-w-0 bg-transparent text-base sm:text-lg font-extrabold tracking-tight text-white focus:outline-none border-b border-transparent focus:border-orange-500"
            />
          </div>
        </div>

        {/* Row 2: Controls Bar (Wraps cleanly on small phones) */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setSessionRunning(!sessionRunning)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-mono font-bold"
              title="Toggle Session Timer"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  sessionRunning ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              {formatDuration(sessionSeconds)}
              {sessionRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </button>

            <button
              onClick={cycleRestPreset}
              onDoubleClick={() => setRestSeconds(restPreset)}
              className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-extrabold text-slate-200 flex items-center gap-1"
              title="Tap to cycle rest preset"
            >
              <Clock className="w-3.5 h-3.5 text-orange-400" />
              {restPreset}s
            </button>

            <button
              onClick={() => setShowHeatmapModal(true)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-orange-400 transition"
              title="Session Muscle Heatmap"
            >
              <Flame className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowSqlModal(true)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 transition"
              title="Cloud & Backup"
            >
              <Database className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={syncSessionToSupabase}
            disabled={syncingCloud}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-extrabold text-xs flex items-center gap-1 shadow-sm active:scale-95 transition shrink-0"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{syncingCloud ? 'Syncing' : 'Finish'}</span>
          </button>
        </div>

        {/* Row 3: Slim Responsive KPI Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10 text-xs">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <div>
              <span className="text-slate-400 font-semibold mr-1">VOL:</span>
              <span className="font-extrabold text-white">
                {workoutStats.totalVol.toLocaleString()} {unit.toLowerCase()}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold mr-1">SETS:</span>
              <span className="font-extrabold text-emerald-400">
                {workoutStats.doneSets}/{workoutStats.totalSets}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold mr-1">RPE:</span>
              <span className="font-extrabold text-orange-400">{workoutStats.avgRpe}</span>
            </div>
          </div>

          <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={autoStartRest}
              onChange={(e) => setAutoStartRest(e.target.checked)}
              className="rounded accent-orange-500 w-3.5 h-3.5"
            />
            Auto-Rest
          </label>
        </div>
      </div>

      {/* =====================================================================
          2. HORIZONTAL EXERCISE STEPPER (FULL TEXT VISIBLE ON ACTIVE PILL)
      ===================================================================== */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        {currentWorkout.exercises.map((ex, idx) => {
          const isCurrent = idx === activeExIdx;
          const doneCount = ex.sets.filter((s) => s.done).length;
          const allDone = ex.sets.length > 0 && doneCount === ex.sets.length;

          return (
            <button
              key={ex.id}
              onClick={() => setActiveExIdx(idx)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap flex items-center gap-2 transition border shrink-0 ${
                isCurrent
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : allDone
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] shrink-0 ${
                  isCurrent
                    ? 'bg-orange-500 text-white'
                    : allDone
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {allDone ? '✓' : idx + 1}
              </span>
              <span className={isCurrent ? '' : 'max-w-[160px] sm:max-w-none truncate'}>
                {ex.name}
              </span>
              <span className="text-[10px] opacity-75">
                {doneCount}/{ex.sets.length}
              </span>
            </button>
          );
        })}

        <button
          onClick={() => {
            setMuscleFilter(getContextualMuscle());
            setShowExercisePicker(true);
          }}
          className="px-3.5 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 flex items-center gap-1 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" /> Add Lift
        </button>
      </div>

      {/* =====================================================================
          3. ACTIVE EXERCISE FOCUS CARD (3D EXERCISE ILLUSTRATION + FULL TEXT)
      ===================================================================== */}
      {activeExercise ? (
        <div
          onTouchStart={handleCardTouchStart}
          onTouchEnd={handleCardTouchEnd}
          className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-slate-200/80 space-y-4"
        >
          {/* Exercise Header: Responsive layout so long names NEVER truncate to "Bar..." */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
            <div className="flex items-center gap-3.5">
              {/* Exercise Movement Illustration Box (Like FitnessProgramer Reference) */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-center overflow-hidden shrink-0 p-1">
                <AnatomyIllustration
                  exerciseName={activeExercise.name}
                  imageUrl={activeExercise.imageUrl}
                  size="lg"
                />
              </div>

              {/* Full Exercise Title & Metadata (No muscle target tag clutter here) */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {activeExercise.equipment}
                  </span>

                  {/* Mobile Action Buttons aligned cleanly at top-right */}
                  <div className="flex sm:hidden items-center gap-1">
                    <button
                      onClick={() => setActiveExIdx((i) => Math.max(0, i - 1))}
                      disabled={activeExIdx === 0}
                      className="p-1.5 rounded-xl bg-slate-100 text-slate-600 disabled:opacity-30"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        setActiveExIdx((i) =>
                          Math.min(currentWorkout.exercises.length - 1, i + 1)
                        )
                      }
                      disabled={activeExIdx === currentWorkout.exercises.length - 1}
                      className="p-1.5 rounded-xl bg-slate-100 text-slate-600 disabled:opacity-30"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeExercise(activeExercise.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Full responsive title — wraps across lines instead of cutting off */}
                <h3 className="text-lg sm:text-2xl font-extrabold text-slate-900 leading-snug break-words">
                  {activeExercise.name}
                </h3>

                <div className="text-xs font-semibold text-slate-500">
                  PR / Prev Best: <strong className="text-slate-900">{activeExercise.prevBest}</strong>
                </div>
              </div>
            </div>

            {/* Desktop Prev / Next & Delete Controls */}
            <div className="hidden sm:flex items-center gap-1.5 shrink-0 self-start sm:self-center">
              <button
                onClick={() => setActiveExIdx((i) => Math.max(0, i - 1))}
                disabled={activeExIdx === 0}
                className="p-2 rounded-xl bg-slate-100 text-slate-600 disabled:opacity-30 hover:bg-slate-200"
                title="Previous Exercise"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  setActiveExIdx((i) =>
                    Math.min(currentWorkout.exercises.length - 1, i + 1)
                  )
                }
                disabled={activeExIdx === currentWorkout.exercises.length - 1}
                className="p-2 rounded-xl bg-slate-100 text-slate-600 disabled:opacity-30 hover:bg-slate-200"
                title="Next Exercise"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => removeExercise(activeExercise.id)}
                className="p-2 text-slate-400 hover:text-red-600 rounded-xl ml-1"
                title="Remove Exercise"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 2-Column Set Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {activeExercise.sets.map((s, idx) => {
              const e1rm = calc1RM(s.weight, s.reps);
              return (
                <div
                  key={s.id}
                  className={`flex items-center justify-between gap-2 p-3 rounded-2xl border transition ${
                    s.done
                      ? 'bg-emerald-50/90 border-emerald-300'
                      : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200/80'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => openEditSetModal(activeExercise, s)}
                    className="flex-1 flex items-center justify-between text-left pr-2 min-w-0"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`w-7 h-7 rounded-xl font-extrabold text-xs flex items-center justify-center border shrink-0 ${
                          s.type === 'W'
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : s.type === 'D'
                            ? 'bg-purple-100 text-purple-800 border-purple-300'
                            : s.type === 'F'
                            ? 'bg-red-100 text-red-800 border-red-300'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        {s.type || idx + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="font-extrabold text-base text-slate-900 truncate">
                          {s.weight} {unit.toLowerCase()} × {s.reps}
                        </div>
                        <div className="text-[11px] font-semibold text-slate-500">
                          RPE {s.rpe} · 1RM: <strong>{e1rm}</strong>
                        </div>
                      </div>
                    </div>
                    <Edit3 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleSetDone(activeExercise.id, s.id)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition active:scale-90 shrink-0 ${
                      s.done
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white text-slate-400 border border-slate-300'
                    }`}
                  >
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  </button>
                </div>
              );
            })}

            <button
              onClick={() => openAddSetModal(activeExercise)}
              className="min-h-[62px] rounded-2xl border-2 border-dashed border-slate-300 hover:border-slate-900 text-slate-600 hover:text-slate-900 font-extrabold text-sm flex items-center justify-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" /> Log Next Set
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 text-center border border-slate-200">
          <p className="text-sm font-bold text-slate-500 mb-3">No exercises in this session yet.</p>
          <button
            onClick={() => {
              setMuscleFilter(getContextualMuscle());
              setShowExercisePicker(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-extrabold text-xs inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add First Exercise
          </button>
        </div>
      )}

      {/* =====================================================================
          POP-OUT MODAL: MUSCLE HEATMAP (SWIPE RIGHT TO RETURN)
      ===================================================================== */}
      {showHeatmapModal && (
        <div
          onClick={() => setShowHeatmapModal(false)}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            {...heatmapModalSwipe}
            className="bg-white w-full max-w-2xl rounded-3xl p-5 max-h-[90vh] overflow-y-auto shadow-2xl space-y-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Session Muscle Activation</h3>
                <p className="text-[11px] font-semibold text-slate-400">Swipe right or tap X to return</p>
              </div>
              <button
                onClick={() => setShowHeatmapModal(false)}
                className="p-2 rounded-full bg-slate-100 text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <MuscleHeatmapCard
              exercises={currentWorkout.exercises}
              unit={unit}
              onQuickAddMuscle={(muscleName) => {
                setShowHeatmapModal(false);
                setMuscleFilter(muscleName);
                setShowExercisePicker(true);
              }}
            />
          </div>
        </div>
      )}

      {/* =====================================================================
          POP-OUT WINDOW 1: ADD / EDIT SET MODAL (SWIPE RIGHT TO RETURN)
      ===================================================================== */}
      {setModalData && (
        <div
          onClick={() => setSetModalData(null)}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSaveSetModal}
            {...setModalSwipe}
            className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 space-y-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-red-100 text-red-800">
                  {setModalData.mode === 'add' ? 'NEW SET' : 'EDIT SET'} · Swipe Right to Return
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1 break-words">
                  {setModalData.exName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSetModalData(null)}
                className="p-2 rounded-full bg-slate-100 text-slate-600 shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-extrabold uppercase text-slate-400">
                Set Type
              </label>
              <div className="grid grid-cols-4 gap-2 mt-1.5">
                {[
                  { id: '1', label: 'Working' },
                  { id: 'W', label: 'Warmup' },
                  { id: 'D', label: 'Dropset' },
                  { id: 'F', label: 'Failure' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSetModalData({ ...setModalData, type: t.id })}
                    className={`py-2.5 rounded-xl font-extrabold text-xs border transition ${
                      (setModalData.type === t.id ||
                        (!['W', 'D', 'F'].includes(setModalData.type) && t.id === '1'))
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                <label className="text-xs font-extrabold uppercase text-slate-500">
                  Weight ({unit})
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={setModalData.weight}
                  onChange={(e) =>
                    setSetModalData({ ...setModalData, weight: e.target.value })
                  }
                  className="w-full py-2 text-center font-extrabold text-2xl sm:text-3xl bg-white rounded-xl border border-slate-300 text-slate-900"
                />
                <div className="flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setSetModalData({
                        ...setModalData,
                        weight: Math.max(0, Number(setModalData.weight) - 2.5),
                      })
                    }
                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 font-extrabold text-xs text-slate-700"
                  >
                    -2.5
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setSetModalData({
                        ...setModalData,
                        weight: Number(setModalData.weight) + 2.5,
                      })
                    }
                    className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-extrabold text-xs"
                  >
                    +2.5
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                <label className="text-xs font-extrabold uppercase text-slate-500">
                  Reps
                </label>
                <input
                  type="number"
                  value={setModalData.reps}
                  onChange={(e) =>
                    setSetModalData({ ...setModalData, reps: e.target.value })
                  }
                  className="w-full py-2 text-center font-extrabold text-2xl sm:text-3xl bg-white rounded-xl border border-slate-300 text-slate-900"
                />
                <div className="flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setSetModalData({
                        ...setModalData,
                        reps: Math.max(1, Number(setModalData.reps) - 1),
                      })
                    }
                    className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-300 font-extrabold text-xs text-slate-700"
                  >
                    -1
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setSetModalData({
                        ...setModalData,
                        reps: Number(setModalData.reps) + 1,
                      })
                    }
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white font-extrabold text-xs"
                  >
                    +1
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-extrabold text-slate-500 mb-1.5">
                <span>Effort (RPE)</span>
                <span className="text-orange-600">
                  Est. 1RM: {calc1RM(setModalData.weight, setModalData.reps)}{' '}
                  {unit.toLowerCase()}
                </span>
              </div>
              <div className="grid grid-cols-6 gap-1.5">
                {[7, 7.5, 8, 8.5, 9, 10].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setSetModalData({ ...setModalData, rpe: val })}
                    className={`py-2 rounded-xl font-extrabold text-xs border ${
                      Number(setModalData.rpe) === val
                        ? 'bg-orange-600 text-white border-orange-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              {setModalData.mode === 'edit' && (
                <button
                  type="button"
                  onClick={handleDeleteSetFromModal}
                  className="p-4 rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 font-extrabold"
                  title="Delete Set"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
              <button
                type="submit"
                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-extrabold text-base shadow-lg flex items-center justify-center gap-2 active:scale-98 transition"
              >
                <Check className="w-5 h-5 stroke-[2.5]" />
                {setModalData.mode === 'add' ? 'Log Set & Start Rest' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =====================================================================
          POP-OUT WINDOW 2: EXERCISE PICKER MODAL (SWIPE RIGHT TO RETURN)
      ===================================================================== */}
      {showExercisePicker && (
        <div
          onClick={() => setShowExercisePicker(false)}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            {...pickerModalSwipe}
            className="bg-white w-full max-w-xl rounded-t-3xl sm:rounded-3xl p-5 max-h-[85vh] flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between mb-3 gap-2">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Add Exercise ({muscleFilter})
                </h3>
                <p className="text-xs font-semibold text-slate-400">
                  Swipe right or tap X to return
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={muscleFilter}
                  onChange={(e) => setMuscleFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 font-extrabold text-xs focus:outline-none"
                >
                  {['All', 'Chest', 'Back', 'Shoulders', 'Legs', 'Triceps', 'Biceps'].map(
                    (m) => (
                      <option key={m} value={m}>
                        {m === 'All' ? 'All Muscles' : m}
                      </option>
                    )
                  )}
                </select>
                <button
                  onClick={() => setShowExercisePicker(false)}
                  className="p-2 rounded-full bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="relative mb-3">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={exerciseSearch}
                onChange={(e) => setExerciseSearch(e.target.value)}
                placeholder="Search lift or equipment..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-100 text-sm font-medium text-slate-900 focus:outline-none"
              />
            </div>

            <div className="overflow-y-auto space-y-2 flex-1 pr-1">
              {EXERCISE_LIBRARY.filter((item) => {
                const matchesMuscle =
                  muscleFilter === 'All' || item.muscle === muscleFilter;
                const matchesText =
                  item.name.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
                  item.equipment.toLowerCase().includes(exerciseSearch.toLowerCase());
                return matchesMuscle && matchesText;
              }).map((item) => (
                <button
                  key={item.name}
                  onClick={() => addExerciseFromLibrary(item)}
                  className="w-full p-2.5 rounded-2xl bg-slate-50 hover:bg-orange-50/60 border border-slate-200 flex items-center justify-between text-left transition gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-14 h-14 bg-white p-1 rounded-xl border border-slate-200 shrink-0 flex items-center justify-center overflow-hidden">
                      <AnatomyIllustration
                        exerciseName={item.name}
                        imageUrl={item.imageUrl}
                        size="sm"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="font-extrabold text-sm text-slate-900 break-words">
                        {item.name}
                      </div>
                      <div className="text-xs font-semibold text-slate-500">
                        {item.equipment} · Best: {item.defaultBest}
                      </div>
                    </div>
                  </div>
                  <Plus className="w-5 h-5 text-orange-600 shrink-0 mr-1" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}