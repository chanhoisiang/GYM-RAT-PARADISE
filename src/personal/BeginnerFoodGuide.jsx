import React from 'react';
import { Lightbulb, ArrowRight, ShieldCheck, Flame, Heart } from 'lucide-react';

const NUTRIENT_101 = [
  {
    name: 'Protein (The Muscle Builder)',
    emoji: '💪🍗',
    targetRule: 'Aim for 1–2 Palms per meal',
    why: 'Repairs muscle fibers after lifting weights and keeps you full so you do not snack at night.',
    bestFoods: 'Chicken breast, eggs, egg whites, fish, tofu, Greek yogurt, lean pork, whey shake.',
    color: 'bg-emerald-50 border-emerald-200 text-emerald-950',
  },
  {
    name: 'Carbohydrates (The Gym Fuel)',
    emoji: '⚡🍚',
    targetRule: 'Aim for 1 Cupped Hand before & after gym',
    why: 'Gives your muscles glycogen energy to lift heavier weights and recover faster.',
    bestFoods: 'White rice, oats, wholemeal bread, potatoes, bananas, clear soup noodles.',
    color: 'bg-blue-50 border-blue-200 text-blue-950',
  },
  {
    name: 'Healthy Fats (Hormone & Joint Support)',
    emoji: '🥑🥚',
    targetRule: 'Aim for 1 Thumb per meal',
    why: 'Supports testosterone, joint health, and vitamin absorption—just watch hidden deep-fried oils!',
    bestFoods: 'Whole eggs, salmon, avocado, almonds, olive oil, peanut butter.',
    color: 'bg-amber-50 border-amber-200 text-amber-950',
  },
];

const SMART_SWAPS = [
  {
    insteadOf: 'Nasi Lemak Ayam Goreng (950 kcal, 38g Fat)',
    choose: 'Nasi Campur: White Rice + Ayam Bakar + Telur Rebus (520 kcal, 42g Protein)',
    saved: 'Saves 430 kcal & doubles protein!',
  },
  {
    insteadOf: 'Curry Laksa / Fried Kuey Teow (880 kcal)',
    choose: 'Clear Soup Pork Noodle / Chicken Hor Fun (490 kcal, 34g Protein)',
    saved: 'Saves 390 kcal & zero grease crash!',
  },
  {
    insteadOf: 'Teh Tarik / Boba Milk Tea (350 kcal Sugar)',
    choose: 'Kopi O Kosong / Teh O Ais Limau Kurang Manis / Zero Cola (15 kcal)',
    saved: 'Saves 335 liquid calories!',
  },
];

export default function BeginnerFoodGuide() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left: Macronutrients 101 for Beginners */}
      <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-200/80 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">
              Beginner Nutrient 101 Guide
            </h3>
            <p className="text-xs font-medium text-slate-500">
              Understand what each nutrient does for your physique in 30 seconds
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {NUTRIENT_101.map((n) => (
            <div key={n.name} className={`p-4 rounded-2xl border space-y-1.5 ${n.color}`}>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="font-extrabold text-base flex items-center gap-2">
                  <span className="text-xl">{n.emoji}</span> {n.name}
                </div>
                <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-white/80">
                  {n.targetRule}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium opacity-90">{n.why}</p>
              <div className="text-xs font-bold pt-1">
                ✅ Top Choices: <span className="font-semibold">{n.bestFoods}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Easy Local Food Swaps */}
      <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-200/80 space-y-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
            FAT LOSS & MUSCLE HACKS
          </span>
          <h3 className="text-lg font-extrabold text-slate-900 mt-1">
            🔄 Easy Hawker & Student Food Swaps
          </h3>
          <p className="text-xs font-medium text-slate-500">
            You don't need boring boiled food—just make these simple swaps when eating out!
          </p>
        </div>

        <div className="space-y-3">
          {SMART_SWAPS.map((s, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2"
            >
              <div className="text-xs font-bold text-red-600 line-through opacity-80">
                ❌ {s.insteadOf}
              </div>
              <div className="text-sm font-extrabold text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/70">
                ✅ {s.choose}
              </div>
              <div className="text-[11px] font-extrabold text-orange-600 text-right">
                🔥 {s.saved}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}