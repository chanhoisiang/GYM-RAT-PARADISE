import React, { useState } from 'react';
import {
  Zap, Database, CheckCircle2, Plus, Trash2, Check, X, Search
} from 'lucide-react';
import { WORKOUT_TEMPLATES, EXERCISE_LIBRARY, calc1RM } from './gymConstants';
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
  setRestSeconds,
  syncSessionToSupabase,
  syncingCloud,
  setShowSqlModal,
  showToast,
}) {
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [muscleFilter, setMuscleFilter] = useState('All');

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

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-900 text-white p-6 shadow-lg">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
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
          <button
            onClick={() => setShowSqlModal(true)}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition"
          >
            <Database className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-5 pt-4 border-t border-white/10">
          <div className="bg-white/5 rounded-2xl p-4">
            <div className="text-xs font-semibold text-slate-400">VOLUME</div>
            <div className="text-2xl sm:text-3xl font-extrabold mt-0.5">
              {workoutStats.totalVol.toLocaleString()}{' '}
              <span className="text-xs font-normal text-slate-400">{unit.toLowerCase()}</span>
            </div>
          </div>
          <div className="bg-white/5 rounded-2xl p-4">
            <div className="text-xs font-semibold text-slate-400">SETS DONE</div>
            <div className="text-2xl sm:text-3xl font-extrabold mt-0.5 text-emerald-400">
              {workoutStats.doneSets}
              <span className="text-base font-semibold text-slate-400">
                /{workoutStats.totalSets}
              </span>
            </div>
          </div>
          <div className="bg-white/5 rounded-2xl p-4">
            <div className="text-xs font-semibold text-slate-400">AVG RPE</div>
            <div className="text-2xl sm:text-3xl font-extrabold mt-0.5 text-orange-400">
              {workoutStats.avgRpe}
            </div>
          </div>
        </div>

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
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md"
          >
            <CheckCircle2 className="w-4 h-4" />
            {syncingCloud ? 'Syncing...' : 'Finish & Save Session'}
          </button>
        </div>
      </div>

      {/* Split Templates Bar */}
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
          EACH EXERCISE CARD WITH ITS OWN ANATOMICAL MUSCLE DIAGRAM
      ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {currentWorkout.exercises.map((ex, exIndex) => {
          const muscleTargets = getExerciseMuscles(ex.name, ex.muscle);
          return (
            <div
              key={ex.id}
              className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 flex flex-col justify-between"
            >
              <div>
                {/* Exercise Card Top Header + Individual Anatomy Diagram */}
                <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="w-7 h-7 rounded-xl bg-red-100 text-red-700 font-extrabold text-sm flex items-center justify-center shrink-0">
                        {exIndex + 1}
                      </span>
                      <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 truncate">
                        {ex.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {ex.muscle} · {ex.equipment}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        Best: <strong className="text-slate-800">{ex.prevBest}</strong>
                      </span>
                    </div>

                    {/* Primary & Secondary Muscle Pills */}
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      {muscleTargets.primary.map((m) => (
                        <span
                          key={m}
                          className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-[#BD1E1E] text-white"
                        >
                          🎯 {m.replace('_', ' ')}
                        </span>
                      ))}
                      {muscleTargets.secondary.map((m) => (
                        <span
                          key={m}
                          className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-[#FF8A8A]/40 text-red-950 border border-[#FF8A8A]"
                        >
                          + {m.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Per-Exercise Front & Back Anatomical Figure */}
                  <div className="flex items-center gap-1 shrink-0 bg-slate-50 p-1.5 rounded-2xl border border-slate-200/80">
                    <AnatomyIllustration
                      exerciseName={ex.name}
                      fallbackMuscle={ex.muscle}
                      size="sm"
                    />
                    <button
                      onClick={() => removeExercise(ex.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-xl self-start"
                      title="Remove Exercise"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Sets Table Header */}
                <div className="grid grid-cols-12 gap-2 px-2 pb-2 text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  <div className="col-span-2">SET</div>
                  <div className="col-span-3 text-center">{unit}</div>
                  <div className="col-span-3 text-center">REPS</div>
                  <div className="col-span-2 text-center">RPE</div>
                  <div className="col-span-2 text-right">DONE</div>
                </div>

                {/* Sets Rows */}
                <div className="space-y-2.5">
                  {ex.sets.map((s) => {
                    const e1rm = calc1RM(s.weight, s.reps);
                    return (
                      <div
                        key={s.id}
                        className={`grid grid-cols-12 items-center gap-2 p-2.5 rounded-2xl border transition ${
                          s.done
                            ? 'bg-emerald-50/90 border-emerald-300'
                            : 'bg-slate-50/70 border-slate-200/80'
                        }`}
                      >
                        <div className="col-span-2">
                          <button
                            onClick={() => cycleSetType(ex.id, s.id)}
                            className="w-10 h-11 rounded-xl font-extrabold text-sm border bg-white text-slate-800 border-slate-200"
                          >
                            {s.type}
                          </button>
                        </div>
                        <div className="col-span-3">
                          <input
                            type="number"
                            step="0.5"
                            value={s.weight}
                            onChange={(e) =>
                              updateSetField(ex.id, s.id, 'weight', e.target.value)
                            }
                            className="w-full h-11 text-center font-extrabold text-lg bg-white rounded-xl border border-slate-300"
                          />
                        </div>
                        <div className="col-span-3">
                          <input
                            type="number"
                            value={s.reps}
                            onChange={(e) =>
                              updateSetField(ex.id, s.id, 'reps', e.target.value)
                            }
                            className="w-full h-11 text-center font-extrabold text-lg bg-white rounded-xl border border-slate-300"
                          />
                        </div>
                        <div className="col-span-2">
                          <select
                            value={s.rpe}
                            onChange={(e) =>
                              updateSetField(ex.id, s.id, 'rpe', e.target.value)
                            }
                            className="w-full h-11 text-center font-bold text-sm bg-white rounded-xl border border-slate-300"
                          >
                            {[6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10].map((val) => (
                              <option key={val} value={val}>
                                {val}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-span-2 flex justify-end">
                          <button
                            onClick={() => toggleSetDone(ex.id, s.id)}
                            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition ${
                              s.done
                                ? 'bg-emerald-600 text-white shadow-md'
                                : 'bg-white text-slate-400 border border-slate-300'
                            }`}
                          >
                            <Check className="w-6 h-6 stroke-[2.5]" />
                          </button>
                        </div>
                        <div className="col-span-12 flex items-center justify-between px-1 pt-1 text-xs text-slate-500">
                          <span>
                            Est. 1RM: <strong className="text-slate-900">{e1rm} {unit.toLowerCase()}</strong>
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() =>
                                updateSetField(ex.id, s.id, 'weight', Math.max(0, Number(s.weight) - 2.5))
                              }
                              className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 font-bold text-slate-700"
                            >
                              -2.5
                            </button>
                            <button
                              onClick={() =>
                                updateSetField(ex.id, s.id, 'weight', Number(s.weight) + 2.5)
                              }
                              className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 font-bold text-slate-700"
                            >
                              +2.5
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
              </div>

              <button
                onClick={() => addSetToExercise(ex.id)}
                className="mt-4 w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Set
              </button>
            </div>
          );
        })}
      </div>

      {/* Full Session Combined Muscle Heatmap Card at Bottom */}
      <MuscleHeatmapCard
        exercises={currentWorkout.exercises}
        unit={unit}
        onQuickAddMuscle={(muscleName) => {
          setMuscleFilter(muscleName);
          setShowExercisePicker(true);
        }}
      />

      {/* Exercise Picker Modal (With Mini Anatomy Illustrations for Every Exercise!) */}
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