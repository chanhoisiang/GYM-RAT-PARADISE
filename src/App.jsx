import React, { useState, useMemo } from 'react';
import { Trophy } from 'lucide-react';

export default function ProgressTab({
  prLeaderboard,
  bodyweightLogs,
  setBodyweightLogs,
  setTargets,
  showToast,
}) {
  const [newWeightInput, setNewWeightInput] = useState('74.2');
  const [tdeeForm, setTdeeForm] = useState({
    weight: 74.2,
    height: 175,
    age: 22,
    activity: 1.55,
    goal: 'lean_bulk',
  });

  const calculatedTdee = useMemo(() => {
    const bmr = 10 * Number(tdeeForm.weight) + 6.25 * Number(tdeeForm.height) - 5 * Number(tdeeForm.age) + 5;
    const maintenance = Math.round(bmr * Number(tdeeForm.activity));
    let targetCal = maintenance;
    if (tdeeForm.goal === 'cut') targetCal = maintenance - 400;
    if (tdeeForm.goal === 'lean_bulk') targetCal = maintenance + 250;
    const p = Math.round(Number(tdeeForm.weight) * 2.2);
    const f = Math.round((targetCal * 0.25) / 9);
    const c = Math.max(50, Math.round((targetCal - p * 4 - f * 9) / 4));
    return { maintenance, cal: targetCal, p, c, f };
  }, [tdeeForm]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1RM PR Leaderboard */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-3">
        <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" /> Estimated 1RM Records
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {prLeaderboard.slice(0, 6).map((item) => (
            <div key={item.name} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <div className="font-bold text-sm text-slate-900">{item.name}</div>
                <div className="text-xs font-semibold text-slate-500">Best: {item.weight}kg × {item.reps}</div>
              </div>
              <div className="text-lg font-extrabold text-orange-600">{item.e1rm} kg</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bodyweight & TDEE Column */}
      <div className="space-y-5">
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-slate-900">Morning Bodyweight Trend</h3>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.1"
                value={newWeightInput}
                onChange={(e) => setNewWeightInput(e.target.value)}
                className="w-20 h-9 text-center font-extrabold rounded-xl bg-slate-50 border border-slate-300"
              />
              <button
                onClick={() => {
                  setBodyweightLogs((prev) => [
                    ...prev.slice(1),
                    { date: 'Today', weight: Number(newWeightInput) || 74.2 },
                  ]);
                  showToast(`Logged weight: ${newWeightInput} kg`);
                }}
                className="h-9 px-3 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Log kg
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 pt-3 items-end h-32 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60">
            {bodyweightLogs.map((item, idx) => {
              const pct = Math.min(100, Math.max(25, ((item.weight - 72.5) / 3.5) * 100));
              return (
                <div key={idx} className="flex flex-col items-center gap-1 h-full justify-end">
                  <span className="text-[10px] font-extrabold text-slate-700">{item.weight}</span>
                  <div className="w-full max-w-[24px] rounded-t-xl bg-gradient-to-t from-orange-500 to-amber-400" style={{ height: `${pct}%` }} />
                  <span className="text-[9px] font-bold text-slate-400">{item.date}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* TDEE Calculator */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-4">
          <h3 className="text-lg font-extrabold text-slate-900">TDEE & Lifter Macro Calculator</h3>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'cut', label: 'Fat Loss (-400)' },
              { id: 'recomp', label: 'Recomp (Maint.)' },
              { id: 'lean_bulk', label: 'Lean Bulk (+250)' },
            ].map((g) => (
              <button
                key={g.id}
                onClick={() => setTdeeForm({ ...tdeeForm, goal: g.id })}
                className={`py-2 px-2 rounded-xl font-bold text-xs border ${
                  tdeeForm.goal === g.id ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-700'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
          <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-orange-800">Recommended Daily Target</div>
              <div className="text-lg font-extrabold text-slate-900">
                {calculatedTdee.cal} kcal ({calculatedTdee.p}g P · {calculatedTdee.c}g C · {calculatedTdee.f}g F)
              </div>
            </div>
            <button
              onClick={() => {
                setTargets({ cal: calculatedTdee.cal, p: calculatedTdee.p, c: calculatedTdee.c, f: calculatedTdee.f });
                showToast('Applied new daily macro targets!');
              }}
              className="px-4 py-2.5 rounded-xl bg-orange-600 text-white font-extrabold text-xs"
            >
              Apply Targets
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}