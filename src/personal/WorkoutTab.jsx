import React, { useState } from 'react';
import {
  Zap, Database, CheckCircle2, Plus, Trash2, Check, X, Search,
  Clock, Play, Pause, RotateCcw, Edit3
} from 'lucide-react';
import { WORKOUT_TEMPLATES, EXERCISE_LIBRARY, calc1RM, formatDuration } from './gymConstants';
import MuscleHeatmapCard from './MuscleHeatmapCard';
import AnatomyIllustration, { getExerciseMuscles } from './AnatomyIllustration';

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
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [muscleFilter, setMuscleFilter] = useState('All');

  // Pop-Out Set Editor / Add Set Modal State
  const [setModalData, setSetModalData] = useState(null);
  // Structure: { mode: 'add' | 'edit', exId, exName, setId, type, weight, reps, rpe, done }

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

  // Open Pop-Out Modal to Add a New Set
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
      done: true, // Default mark done & trigger rest when logging via pop-out
    });
  };

  // Open Pop-Out Modal to Edit an Existing Set
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

  // Save Set from Pop-Out Modal
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
        ? `✅ Logged ${setModalData.weight}${unit.toLowerCase()} × ${setModalData.reps}!`
        : '✅ Updated set!'
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
          ],
        },
      ],
    }));
    setShowExercisePicker(false);
    showToast(`Added ${item.name}`);
  };

  return (
    <div className="space-y-6">
      {/* =====================================================================
           FLOATING POP-OUT REST COUNTDOWN PILL (ONLY APPEARS WHEN RESTING)
      ===================================================================== */}
      {restSeconds > 0 && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 backdrop-blur-md text-white px-5 py-3 rounded-3xl shadow-2xl border border-white/15 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-400 animate-spin" />
            <div>
              <div className="text-[10px] font-extrabold uppercase text-slate-400">
                REST TIMER
              </div>
              <div className="text-xl font-mono font-extrabold text-white">
                {formatDuration(restSeconds)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setRestSeconds((s) => Math.max(0, s - 15))}
              className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-extrabold"
            >
              -15s
            </button>
            <button
              onClick={() => setRestSeconds((s) => s + 30)}
              className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-extrabold"
            >
              +30s
            </button>
            <button
              onClick={() => setRestSeconds(0)}
              className="px-3 py-1.5 rounded-xl bg-red-500 hover:bg-red-600 text-xs font-extrabold"
            >
              Skip
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          WORKOUT HERO BANNER (NOW INCLUDES SESSION TIMER & REST CONTROLS)
      ===================================================================== */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-900 text-white p-6 shadow-lg space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1 min-w-[220px]">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-500/15 px-3 py-1 rounded-full mb-2">
              <Zap className="w-3.5 h-3.5" /> Active Training Session ({unit})
            </span>
            <input
              type="text"
              value={currentWorkout.title}
              onChange={(e) =>
                setCurrentWorkout((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full bg-transparent text-2xl sm:text-3xl font-extrabold tracking-tight text-white focus:outline-none border-b border-transparent focus:border-orange-500 pb-0.5"
            />
          </div>

          {/* Integrated Workout Stopwatch & Rest Preset Bar */}
          <div className="flex flex-wrap items-center gap-2 bg-white/10 p-2 rounded-2xl border border-white/10">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80">
              <span
                className={`w-2 h-2 rounded-full ${
                  sessionRunning ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span className="font-mono font-extrabold text-sm">
                {formatDuration(sessionSeconds)}
              </span>
              <button
                onClick={() => setSessionRunning(!sessionRunning)}
                className="p-1 hover:bg-white/10 rounded-lg"
              >
                {sessionRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Quick Rest Timer Trigger inside Workout */}
            <div className="flex items-center gap-1">
              {[60, 90, 120].map((sec) => (
                <button
                  key={sec}
                  onClick={() => {
                    if ( setRestPreset ) setRestPreset(sec);
                    setRestSeconds(sec);
                  }}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-extrabold transition ${
                    restSeconds > 0 && restPreset === sec
                      ? 'bg-orange-500 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-slate-200'
                  }`}
                >
                  ⏱️ {sec}s
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowSqlModal(true)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
              title="Cloud & Backup"
            >
              <Database className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3 Clean KPI Metrics */}
        <div className="grid grid-cols-3 gap-4 pt-3 border-t border-white/10">
          <div className="bg-white/5 rounded-2xl p-3.5">
            <div className="text-xs font-semibold text-slate-400">VOLUME</div>
            <div className="text-xl sm:text-2xl font-extrabold mt-0.5">
              {workoutStats.totalVol.toLocaleString()}{' '}
              <span className="text-xs font-normal text-slate-400">{unit.toLowerCase()}</span>
            </div>
          </div>
          <div className="bg-white/5 rounded-2xl p-3.5">
            <div className="text-xs font-semibold text-slate-400">SETS DONE</div>
            <div className="text-xl sm:text-2xl font-extrabold mt-0.5 text-emerald-400">
              {workoutStats.doneSets}
              <span className="text-sm font-semibold text-slate-400">
                /{workoutStats.totalSets}
              </span>
            </div>
          </div>
          <div className="bg-white/5 rounded-2xl p-3.5">
            <div className="text-xs font-semibold text-slate-400">AVG RPE</div>
            <div className="text-xl sm:text-2xl font-extrabold mt-0.5 text-orange-400">
              {workoutStats.avgRpe}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={autoStartRest}
              onChange={(e) => setAutoStartRest(e.target.checked)}
              className="rounded accent-orange-500 w-4 h-4"
            />
            Auto-Rest Timer ({restPreset}s) on ✓
          </label>
          <button
            onClick={syncSessionToSupabase}
            disabled={syncingCloud}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition"
          >
            <CheckCircle2 className="w-4 h-4" />
            {syncingCloud ? 'Syncing...' : 'Finish & Save Session'}
          </button>
        </div>
      </div>

      {/* Split Templates & Add Exercise Bar */}
      <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1">
        {Object.keys(WORKOUT_TEMPLATES).map((tplName) => (
          <button
            key={tplName}
            onClick={() => {
              setCurrentWorkout({
                title: WORKOUT_TEMPLATES[tplName].title,
                exercises: WORKOUT_TEMPLATES[tplName].exercises,
              });
              showToast(`Loaded ${tplName}`);
            }}
            className={`px-4 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition ${
              currentWorkout.title.startsWith(tplName)
                ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md'
                : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            {tplName}
          </button>
        ))}
        <button
          onClick={() => {
            setMuscleFilter('All');
            setShowExercisePicker(true);
          }}
          className="px-4 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap bg-slate-900 text-white flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Exercise
        </button>
      </div>

      {/* =====================================================================
          ULTRA-CLEAN EXERCISE CARDS (TAP SET TO EDIT OR "+ ADD SET" POP-OUT)
      ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {currentWorkout.exercises.map((ex, exIndex) => {
          const muscleTargets = getExerciseMuscles(ex.name, ex.muscle);
          return (
            <div
              key={ex.id}
              className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Header + Per-Exercise Anatomical Figure */}
                <div className="flex items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-xl bg-red-100 text-red-700 font-extrabold text-sm flex items-center justify-center shrink-0">
                        {exIndex + 1}
                      </span>
                      <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 truncate">
                        {ex.name}
                      </h3>
                    </div>

                    <div className="text-xs font-semibold text-slate-500 mt-1">
                      {ex.muscle} · {ex.equipment} · Best: <strong className="text-slate-800">{ex.prevBest}</strong>
                    </div>

                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      {muscleTargets.primary.map((m) => (
                        <span
                          key={m}
                          className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-[#BD1E1E] text-white"
                        >
                          {m.replace('_', ' ')}
                        </span>
                      ))}
                      {muscleTargets.secondary.map((m) => (
                        <span
                          key={m}
                          className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-[#FF8A8A]/35 text-red-950 border border-[#FF8A8A]"
                        >
                          + {m.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 bg-slate-50 p-1.5 rounded-2xl border border-slate-200/80">
                    <AnatomyIllustration
                      exerciseName={ex.name}
                      fallbackMuscle={ex.muscle}
                      size="sm"
                    />
                    <button
                      onClick={() => removeExercise(ex.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-xl self-start"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Clean Set Pills List (Tap Pill to Open Pop-Out Editor, Tap ✓ to Complete) */}
                <div className="space-y-2 mt-3">
                  {ex.sets.map((s, idx) => {
                    const e1rm = calc1RM(s.weight, s.reps);
                    return (
                      <div
                        key={s.id}
                        className={`flex items-center justify-between gap-3 p-3 rounded-2xl border transition ${
                          s.done
                            ? 'bg-emerald-50/90 border-emerald-300'
                            : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200/80'
                        }`}
                      >
                        {/* Click anywhere on the left side to open the Pop-Out Set Editor */}
                        <button
                          type="button"
                          onClick={() => openEditSetModal(ex, s)}
                          className="flex-1 flex items-center justify-between text-left pr-2"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-8 h-8 rounded-xl font-extrabold text-xs flex items-center justify-center border ${
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
                            <div>
                              <div className="font-extrabold text-base sm:text-lg text-slate-900">
                                {s.weight} {unit.toLowerCase()} × {s.reps} reps
                              </div>
                              <div className="text-xs font-semibold text-slate-500">
                                RPE {s.rpe} · Est. 1RM: <strong>{e1rm} {unit.toLowerCase()}</strong>
                              </div>
                            </div>
                          </div>
                          <Edit3 className="w-4 h-4 text-slate-400 shrink-0" />
                        </button>

                        {/* 1-Tap Checkmark Button */}
                        <button
                          type="button"
                          onClick={() => toggleSetDone(ex.id, s.id)}
                          className={`w-11 h-11 rounded-2xl flex items-center justify-center transition active:scale-90 shrink-0 ${
                            s.done
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'bg-white text-slate-400 border border-slate-300'
                          }`}
                        >
                          <Check className="w-6 h-6 stroke-[2.5]" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pop-Out "+ Add Set" Trigger Button */}
              <button
                onClick={() => openAddSetModal(ex)}
                className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xs active:scale-98 transition"
              >
                <Plus className="w-4 h-4" /> Add Set
              </button>
            </div>
          );
        })}
      </div>

      {/* Full Session Combined Muscle Heatmap Card */}
      <MuscleHeatmapCard
        exercises={currentWorkout.exercises}
        unit={unit}
        onQuickAddMuscle={(muscleName) => {
          setMuscleFilter(muscleName);
          setShowExercisePicker(true);
        }}
      />

      {/* =====================================================================
          POP-OUT WINDOW 1: ADD / EDIT SET MODAL
      ===================================================================== */}
      {setModalData && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <form
            onSubmit={handleSaveSetModal}
            className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 space-y-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-red-100 text-red-800">
                  {setModalData.mode === 'add' ? 'NEW SET' : 'EDIT SET'}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                  {setModalData.exName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSetModalData(null)}
                className="p-2 rounded-full bg-slate-100 text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Set Type Selector */}
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
                      (setModalData.type === t.id || (!['W', 'D', 'F'].includes(setModalData.type) && t.id === '1'))
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Big Weight & Reps Steppers */}
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
                  className="w-full py-2 text-center font-extrabold text-3xl bg-white rounded-xl border border-slate-300"
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
                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 font-extrabold text-xs"
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
                  className="w-full py-2 text-center font-extrabold text-3xl bg-white rounded-xl border border-slate-300"
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
                    className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-300 font-extrabold text-xs"
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

            {/* RPE Effort Pill Selector */}
            <div>
              <div className="flex justify-between text-xs font-extrabold text-slate-500 mb-1.5">
                <span>Effort (RPE)</span>
                <span className="text-orange-600">
                  Est. 1RM: {calc1RM(setModalData.weight, setModalData.reps)} {unit.toLowerCase()}
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

            {/* Action Buttons */}
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
          POP-OUT WINDOW 2: EXERCISE PICKER MODAL
      ===================================================================== */}
      {showExercisePicker && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-xl rounded-t-3xl sm:rounded-3xl p-5 max-h-[88vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-extrabold text-slate-900">Select Exercise</h3>
              <button onClick={() => setShowExercisePicker(false)} className="p-2 rounded-full bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative mb-3">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={exerciseSearch}
                onChange={(e) => setExerciseSearch(e.target.value)}
                placeholder="Search exercise or equipment..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-100 font-medium focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar mb-3 pb-1">
              {['All', 'Chest', 'Back', 'Shoulders', 'Legs', 'Triceps', 'Biceps'].map((m) => (
                <button
                  key={m}
                  onClick={() => setMuscleFilter(m)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition ${
                    muscleFilter === m
                      ? 'bg-[#BD1E1E] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <div className="overflow-y-auto space-y-2.5 flex-1 pr-1">
              {EXERCISE_LIBRARY.filter((item) => {
                const matchesMuscle = muscleFilter === 'All' || item.muscle === muscleFilter;
                const matchesText =
                  item.name.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
                  item.equipment.toLowerCase().includes(exerciseSearch.toLowerCase());
                return matchesMuscle && matchesText;
              }).map((item) => (
                <button
                  key={item.name}
                  onClick={() => addExerciseFromLibrary(item)}
                  className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-red-50/50 border border-slate-200 flex items-center justify-between text-left transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-1 rounded-xl border border-slate-200 shrink-0">
                      <AnatomyIllustration
                        exerciseName={item.name}
                        fallbackMuscle={item.muscle}
                        size="sm"
                      />
                    </div>
                    <div>
                      <div className="font-extrabold text-base text-slate-900">{item.name}</div>
                      <div className="text-xs font-bold text-slate-500 mt-0.5">
                        {item.muscle} · {item.equipment} · Best: {item.defaultBest}
                      </div>
                    </div>
                  </div>
                  <Plus className="w-6 h-6 text-[#BD1E1E] shrink-0 mr-1" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}