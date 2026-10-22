import React, { useState, useEffect } from 'react';
import { Flame, CheckCircle2 } from 'lucide-react';

export default function HydrationStreakBar({ foodLogsCount, showToast }) {
  const [waterGlasses, setWaterGlasses] = useState(() => {
    const saved = localStorage.getItem('ironlog_water_v1');
    return saved ? Number(saved) : 4;
  });

  useEffect(() => {
    localStorage.setItem('ironlog_water_v1', String(waterGlasses));
  }, [waterGlasses]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Big Visual Daily Checklist */}
      <div className="lg:col-span-5 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-3xl p-5 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-5xl bg-white/20 p-3.5 rounded-3xl">🏆</div>
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-orange-100">
              DAILY GOAL
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold mt-0.5">
              {foodLogsCount} / 3 Meals
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-sm font-bold text-amber-200">
              <Flame className="w-4 h-4 fill-amber-300" /> 5 Day Streak!
            </div>
          </div>
        </div>

        {/* 3 Visual Meal Check Circles */}
        <div className="flex gap-1.5">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg font-extrabold border-2 ${
                foodLogsCount >= n
                  ? 'bg-emerald-400 border-emerald-200 text-slate-900 shadow-sm'
                  : 'bg-white/10 border-white/30 text-white/50'
              }`}
            >
              {foodLogsCount >= n ? '✓' : n}
            </div>
          ))}
        </div>
      </div>

      {/* Giant 8-Cup Water Tracker */}
      <div className="lg:col-span-7 bg-white rounded-3xl p-5 shadow-xs border border-slate-200/90 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl">💧</span>
            <span className="text-xl font-extrabold text-slate-900">
              Drink Water
            </span>
          </div>
          <span className="text-lg font-extrabold px-3.5 py-1 rounded-2xl bg-sky-100 text-sky-800">
            {waterGlasses} / 8 Cups
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {Array.from({ length: 8 }).map((_, idx) => {
            const filled = idx < waterGlasses;
            return (
              <button
                key={idx}
                onClick={() => {
                  const next = idx + 1 === waterGlasses ? idx : idx + 1;
                  setWaterGlasses(next);
                  if (next === 8) showToast('💧 8 Cups Done!');
                }}
                className={`h-14 rounded-2xl border-2 flex flex-col items-center justify-center transition active:scale-90 ${
                  filled
                    ? 'bg-sky-500 text-white border-sky-500 shadow-sm'
                    : 'bg-slate-50 text-slate-400 border-slate-200'
                }`}
              >
                <span className="text-xl">{filled ? '🥤' : '🥛'}</span>
                <span className="text-xs font-extrabold">{idx + 1}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}