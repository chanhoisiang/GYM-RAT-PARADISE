import React, { useState, useEffect } from 'react';
import { Flame, Droplets, Award, Sparkles, CheckCircle2 } from 'lucide-react';

export default function HydrationStreakBar({ foodLogsCount, macroTotals, targets, showToast }) {
  const [waterGlasses, setWaterGlasses] = useState(() => {
    const saved = localStorage.getItem('ironlog_water_v1');
    return saved ? Number(saved) : 4;
  });

  useEffect(() => {
    localStorage.setItem('ironlog_water_v1', String(waterGlasses));
  }, [waterGlasses]);

  // Calculate Beginner Daily Score (0 - 100 XP)
  const mealPoints = Math.min(40, foodLogsCount * 15);
  const waterPoints = Math.min(30, waterGlasses * 3.75);
  const proteinRatio = Math.min(1, macroTotals.p / Math.max(1, targets.p));
  const proteinPoints = Math.round(proteinRatio * 30);
  const totalXp = Math.min(100, Math.round(mealPoints + waterPoints + proteinPoints));

  const getRankTitle = (xp) => {
    if (xp >= 85) return { title: '🏆 Nutrition Champion!', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
    if (xp >= 50) return { title: '🔥 Consistency Builder', color: 'text-orange-600 bg-orange-50 border-orange-200' };
    return { title: '🌱 Beginner Explorer', color: 'text-blue-600 bg-blue-50 border-blue-200' };
  };

  const rank = getRankTitle(totalXp);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Gamified Daily XP & Streak Card */}
      <div className="lg:col-span-7 bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 text-white rounded-3xl p-5 shadow-md flex flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" /> Student Daily Nutrition Quest
            </span>
            <h3 className="text-2xl font-extrabold mt-2">
              Daily Consistency Score: {totalXp} XP
            </h3>
            <p className="text-xs sm:text-sm text-orange-100 mt-0.5 font-medium">
              Log 3 meals, drink 8 cups of water, and hit your protein goal to reach 100 XP!
            </p>
          </div>

          <div className="bg-white/15 backdrop-blur-xs px-3.5 py-2 rounded-2xl text-center shrink-0 border border-white/20">
            <div className="flex items-center justify-center gap-1 text-amber-300 font-extrabold text-lg">
              <Flame className="w-5 h-5 fill-amber-300" /> 5
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-white/90">
              Day Streak
            </div>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="mt-4 space-y-1.5">
          <div className="flex justify-between text-xs font-extrabold">
            <span>Level Progress</span>
            <span>{totalXp} / 100 XP</span>
          </div>
          <div className="h-3.5 bg-black/25 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-amber-300 to-emerald-300 rounded-full transition-all duration-500"
              style={{ width: `${totalXp}%` }}
            />
          </div>
        </div>
      </div>

      {/* Interactive 8-Cup Water Hydration Tracker */}
      <div className="lg:col-span-5 bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-base text-slate-900">Hydration Goal</h4>
              <p className="text-xs font-semibold text-slate-500">
                {waterGlasses} of 8 glasses ({waterGlasses * 250} ml)
              </p>
            </div>
          </div>
          <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full border ${rank.color}`}>
            {rank.title}
          </span>
        </div>

        {/* 8 Tappable Water Cups */}
        <div className="grid grid-cols-8 gap-1.5 my-3">
          {Array.from({ length: 8 }).map((_, idx) => {
            const filled = idx < waterGlasses;
            return (
              <button
                key={idx}
                onClick={() => {
                  const next = idx + 1 === waterGlasses ? idx : idx + 1;
                  setWaterGlasses(next);
                  if (next === 8) showToast('💧 Awesome! Hit 2.0L daily water goal!');
                }}
                className={`h-12 rounded-2xl border flex flex-col items-center justify-center transition active:scale-90 ${
                  filled
                    ? 'bg-gradient-to-t from-sky-500 to-cyan-400 text-white border-sky-400 shadow-xs'
                    : 'bg-slate-50 text-slate-300 border-slate-200 hover:border-sky-300'
                }`}
                title={`Glass ${idx + 1} (250ml)`}
              >
                <Droplets className={`w-4 h-4 ${filled ? 'fill-white' : ''}`} />
                <span className="text-[9px] font-extrabold mt-0.5">{idx + 1}</span>
              </button>
            );
          })}
        </div>

        <p className="text-[11px] font-semibold text-slate-400 text-center">
          Tap any cup to log 250ml water · Helps muscle fullness & fat loss!
        </p>
      </div>
    </div>
  );
}