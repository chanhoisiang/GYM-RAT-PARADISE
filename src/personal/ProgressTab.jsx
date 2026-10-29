import React, { useState, useMemo } from 'react';
import { Trophy, TrendingUp, Scale, Utensils, Flame } from 'lucide-react';

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
    height: 172,
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
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* 1. Bodyweight & TDEE Section (Moved to Top as requested) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Morning Bodyweight Trend Card */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-5 lg:col-span-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Scale className="w-5 h-5 text-orange-600" /> Bodyweight Trend
              </h3>
              <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                7-Day Log
              </span>
            </div>
            
            <div className="flex items-center gap-2.5 bg-slate-50 p-3 rounded-2xl border border-slate-200/60 mb-4">
              <input
                type="number"
                step="0.1"
                value={newWeightInput}
                onChange={(e) => setNewWeightInput(e.target.value)}
                className="w-full h-10 px-3 text-center font-extrabold text-slate-800 text-base rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="74.2"
              />
              <button
                onClick={() => {
                  setBodyweightLogs((prev) => [
                    ...prev.slice(1),
                    { date: 'Today', weight: Number(newWeightInput) || 74.2 },
                  ]);
                  showToast(`Logged weight: ${newWeightInput} kg`);
                }}
                className="h-10 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs tracking-wide transition-colors shrink-0 shadow-sm"
              >
                Log kg
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 pt-2 items-end h-32 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/60">
            {bodyweightLogs.map((item, idx) => {
              const pct = Math.min(100, Math.max(25, ((item.weight - 72.5) / 3.5) * 100));
              return (
                <div key={idx} className="flex flex-col items-center gap-1 h-full justify-end">
                  <span className="text-[10px] font-extrabold text-slate-700">{item.weight}</span>
                  <div className="w-full max-w-[20px] rounded-t-lg bg-gradient-to-t from-orange-500 to-amber-400 shadow-xs" style={{ height: `${pct}%` }} />
                  <span className="text-[9px] font-bold text-slate-400 truncate w-full text-center">{item.date}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* TDEE & Lifter Macro Calculator Card */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-5 lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Utensils className="w-5 h-5 text-orange-600" /> TDEE & Nutrition Targets
              </h3>
              <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
                {[
                  { id: 'cut', label: 'Cut (-400)' },
                  { id: 'recomp', label: 'Maint.' },
                  { id: 'lean_bulk', label: 'Lean Bulk (+250)' },
                ].map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setTdeeForm({ ...tdeeForm, goal: g.id })}
                    className={`py-1.5 px-3 rounded-lg font-bold text-xs transition-all ${
                      tdeeForm.goal === g.id ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Weight (kg)</div>
                <input
                  type="number"
                  value={tdeeForm.weight}
                  onChange={(e) => setTdeeForm({ ...tdeeForm, weight: Number(e.target.value) })}
                  className="w-full mt-1 font-extrabold text-slate-900 text-lg bg-transparent border-b border-slate-300 focus:outline-none focus:border-orange-500"
                />
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Height (cm)</div>
                <input
                  type="number"
                  value={tdeeForm.height}
                  onChange={(e) => setTdeeForm({ ...tdeeForm, height: Number(e.target.value) })}
                  className="w-full mt-1 font-extrabold text-slate-900 text-lg bg-transparent border-b border-slate-300 focus:outline-none focus:border-orange-500"
                />
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Age</div>
                <input
                  type="number"
                  value={tdeeForm.age}
                  onChange={(e) => setTdeeForm({ ...tdeeForm, age: Number(e.target.value) })}
                  className="w-full mt-1 font-extrabold text-slate-900 text-lg bg-transparent border-b border-slate-300 focus:outline-none focus:border-orange-500"
                />
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Maintenance</div>
                <div className="mt-1 font-extrabold text-slate-900 text-lg">
                  {calculatedTdee.maintenance} <span className="text-xs text-slate-500 font-medium">kcal</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-orange-900 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-600" /> Recommended Daily Intake & Macros
              </div>
              <div className="text-xl font-extrabold text-slate-900 mt-0.5">
                {calculatedTdee.cal} <span className="text-sm font-bold text-slate-600">kcal</span>
                <span className="text-xs font-semibold text-slate-500 ml-2">
                  ({calculatedTdee.p}g P · {calculatedTdee.c}g C · {calculatedTdee.f}g F)
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                setTargets({ cal: calculatedTdee.cal, p: calculatedTdee.p, c: calculatedTdee.c, f: calculatedTdee.f });
                showToast('Applied new daily macro targets!');
              }}
              className="px-5 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs tracking-wide shadow-sm transition-colors whitespace-nowrap"
            >
              Apply Targets
            </button>
          </div>
        </div>
      </div>

      {/* 2. Estimated 1RM Records Section */}
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" /> Estimated 1RM Leaderboard
          </h3>
          <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
            Top Strength Metrics
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {prLeaderboard.map((item) => (
            <div key={item.name} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between hover:border-slate-300 transition-all">
              <div className="space-y-0.5">
                <div className="font-extrabold text-sm text-slate-900">{item.name}</div>
                <div className="text-xs font-semibold text-slate-500">Best Set: {item.weight}kg × {item.reps} reps</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-extrabold text-orange-600">{item.e1rm} <span className="text-xs text-slate-600 font-bold">kg</span></div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Est. 1RM</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}