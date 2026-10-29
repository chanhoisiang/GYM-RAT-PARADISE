import React, { useMemo } from 'react';
import { Activity, Plus } from 'lucide-react';
import AnatomyIllustration, { getExerciseMuscles, MusclePartIcon } from './AnatomyIllustration';

const MUSCLE_GROUPS = [
  { id: 'Chest', label: 'Chest (Pecs)', targetSets: 8 },
  { id: 'Shoulders', label: 'Shoulders (Delts)', targetSets: 8 },
  { id: 'Back', label: 'Back & Lats', targetSets: 10 },
  { id: 'Legs', label: 'Legs (Quads & Glutes)', targetSets: 10 },
  { id: 'Triceps', label: 'Triceps', targetSets: 6 },
  { id: 'Biceps', label: 'Biceps', targetSets: 6 },
];

export default function MuscleHeatmapCard({
  exercises = [],
  unit = 'KG',
  onQuickAddMuscle,
}) {
  const { primaryMuscles, secondaryMuscles, muscleStats } = useMemo(() => {
    const priSet = new Set();
    const secSet = new Set();
    const map = {
      Chest: { plannedSets: 0, doneSets: 0, volume: 0 },
      Shoulders: { plannedSets: 0, doneSets: 0, volume: 0 },
      Back: { plannedSets: 0, doneSets: 0, volume: 0 },
      Legs: { plannedSets: 0, doneSets: 0, volume: 0 },
      Triceps: { plannedSets: 0, doneSets: 0, volume: 0 },
      Biceps: { plannedSets: 0, doneSets: 0, volume: 0 },
    };

    exercises.forEach((ex) => {
      const m = getExerciseMuscles(ex.name, ex.muscle);
      m.primary.forEach((p) => priSet.add(p));
      m.secondary.forEach((s) => secSet.add(s));

      const cat = map[ex.muscle] ? ex.muscle : 'Chest';
      (ex.sets || []).forEach((s) => {
        map[cat].plannedSets += 1;
        if (s.done) {
          map[cat].doneSets += 1;
          map[cat].volume += (Number(s.weight) || 0) * (Number(s.reps) || 0);
        }
      });
    });

    return {
      primaryMuscles: Array.from(priSet),
      secondaryMuscles: Array.from(secSet).filter((x) => !priSet.has(x)),
      muscleStats: map,
    };
  }, [exercises]);

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-200/80 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-100 text-red-800">
            FULL SESSION ANATOMY MAP
          </span>
          <h3 className="text-xl font-extrabold text-slate-900 mt-1 flex items-center gap-2">
            <Activity className="w-5 h-5 text-red-600" /> Session Target Muscles
          </h3>
        </div>

        <div className="flex items-center gap-4 text-xs font-extrabold bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200">
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-sm bg-[#BD1E1E] border border-black inline-block" /> Primary Target
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-sm bg-[#FF8A8A] border border-black inline-block" /> Secondary / Synergist
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-sm bg-[#969696] border border-black inline-block" /> Rested
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Full Session Anatomical Diagram */}
        <div className="lg:col-span-5 bg-slate-50 rounded-3xl p-4 border border-slate-200/80 flex flex-col items-center justify-center">
          <AnatomyIllustration
            customPrimary={primaryMuscles}
            customSecondary={secondaryMuscles}
            size="lg"
          />
          <span className="text-xs font-bold text-slate-500 mt-1">
            Combined Front & Back Muscle Activation Today
          </span>
        </div>

        {/* Right: Muscle Group Volume Breakdown with Anatomical Badges */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {MUSCLE_GROUPS.map((m) => {
            const stat = muscleStats[m.id] || { plannedSets: 0, doneSets: 0, volume: 0 };
            const pct = Math.min(100, Math.round((stat.doneSets / m.targetSets) * 100));
            return (
              <div
                key={m.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <MusclePartIcon muscle={m.id} />
                    <div>
                      <div className="font-extrabold text-sm text-slate-900">{m.label}</div>
                      <div className="text-xs font-bold text-slate-500">
                        {stat.doneSets} / {stat.plannedSets} sets done
                      </div>
                    </div>
                  </div>
                  {onQuickAddMuscle && (
                    <button
                      onClick={() => onQuickAddMuscle(m.id)}
                      className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-extrabold text-red-700 hover:bg-red-50 flex items-center gap-1 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  )}
                </div>

                <div className="h-2.5 bg-white rounded-full overflow-hidden border border-slate-200 my-2.5">
                  <div
                    className="h-full bg-[#BD1E1E] rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="text-xs font-bold text-slate-500">
                  Volume: <strong className="text-slate-900">{stat.volume.toLocaleString()} {unit.toLowerCase()}</strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}