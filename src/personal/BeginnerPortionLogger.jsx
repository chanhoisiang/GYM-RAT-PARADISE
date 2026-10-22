import React, { useState } from 'react';
import { Utensils, Plus, Sparkles, Check, HelpCircle } from 'lucide-react';

const HAND_PORTIONS = [
  {
    key: 'palmsProtein',
    title: 'Palm of Protein',
    emoji: '✋🍗',
    subtitle: 'Chicken, Fish, Lean Pork, Tofu, 2 Eggs',
    perUnit: { cal: 145, p: 26, c: 1, f: 4 },
    color: 'border-emerald-200 bg-emerald-50/60 text-emerald-900',
    badge: 'bg-emerald-600 text-white',
    benefit: 'Builds & repairs muscle after gym',
  },
  {
    key: 'fistsCarbs',
    title: 'Cupped Hand of Carbs',
    emoji: '🤲🍚',
    subtitle: 'White Rice, Noodles, Oats, Potato, Bread',
    perUnit: { cal: 160, p: 3, c: 35, f: 1 },
    color: 'border-blue-200 bg-blue-50/60 text-blue-900',
    badge: 'bg-blue-600 text-white',
    benefit: 'Fuels your workout energy',
  },
  {
    key: 'fistsVeggies',
    title: 'Fist of Veggies & Fruit',
    emoji: '✊🥦',
    subtitle: 'Broccoli, Salad, Spinach, Apple, Banana',
    perUnit: { cal: 55, p: 2, c: 12, f: 0 },
    color: 'border-teal-200 bg-teal-50/60 text-teal-900',
    badge: 'bg-teal-600 text-white',
    benefit: 'Keeps you full & aids digestion',
  },
  {
    key: 'thumbsFat',
    title: 'Thumb of Healthy Fats',
    emoji: '👍🥑',
    subtitle: 'Cooking Oil, Peanut Butter, Nuts, Egg Yolk',
    perUnit: { cal: 95, p: 2, c: 1, f: 9 },
    color: 'border-amber-200 bg-amber-50/60 text-amber-900',
    badge: 'bg-amber-500 text-white',
    benefit: 'Supports hormones & joints',
  },
];

const BEGINNER_VISUAL_MEALS = [
  { name: 'Mixed Rice (Chap Fan): Chicken + Egg + Veggie', icon: '🍛', cal: 520, p: 36, c: 55, f: 16, tag: 'Best Budget Lunch' },
  { name: '3 Eggs on Toast + Kopi O Kosong', icon: '🍳', cal: 360, p: 22, c: 28, f: 17, tag: 'Easy Breakfast' },
  { name: 'Clear Soup Pork Noodle (Chu Yuk Fun)', icon: '🍜', cal: 510, p: 34, c: 56, f: 15, tag: 'High Protein Hawker' },
  { name: 'Subway 6" Roasted Chicken Breast', icon: '🥪', cal: 340, p: 27, c: 44, f: 5, tag: 'On-The-Go Meal' },
  { name: 'Protein Shake + 1 Banana', icon: '🥤', cal: 245, p: 28, c: 28, f: 2, tag: 'Post-Gym Recovery' },
  { name: 'Grilled Chicken Chop (Black Pepper) + Mash', icon: '🥩', cal: 560, p: 42, c: 38, f: 24, tag: 'Dinner Favorite' },
];

export default function BeginnerPortionLogger({
  selectedMealSlot,
  setSelectedMealSlot,
  onAddFood,
  showToast,
}) {
  const [portions, setPortions] = useState({
    palmsProtein: 1,
    fistsCarbs: 1,
    fistsVeggies: 1,
    thumbsFat: 1,
  });
  const [customLabel, setCustomLabel] = useState('');

  // Calculate live meal estimate from hand portions
  const estimate = HAND_PORTIONS.reduce(
    (acc, item) => {
      const count = portions[item.key] || 0;
      return {
        cal: acc.cal + count * item.perUnit.cal,
        p: acc.p + count * item.perUnit.p,
        c: acc.c + count * item.perUnit.c,
        f: acc.f + count * item.perUnit.f,
      };
    },
    { cal: 0, p: 0, c: 0, f: 0 }
  );

  const updatePortion = (key, delta) => {
    setPortions((prev) => ({
      ...prev,
      [key]: Math.max(0, Math.min(5, (prev[key] || 0) + delta)),
    }));
  };

  const handleLogHandMeal = () => {
    if (estimate.cal === 0) return;
    const descParts = [];
    if (portions.palmsProtein > 0) descParts.push(`${portions.palmsProtein} Palm Protein`);
    if (portions.fistsCarbs > 0) descParts.push(`${portions.fistsCarbs} Hand Carbs`);
    if (portions.fistsVeggies > 0) descParts.push(`${portions.fistsVeggies} Fist Veggies`);

    const mealName = customLabel.trim() || `Balanced Plate (${descParts.join(' + ')})`;
    onAddFood({
      id: `f-${Date.now()}`,
      name: mealName,
      slot: selectedMealSlot,
      ...estimate,
    });
    setCustomLabel('');
    showToast(`🎉 Logged ${mealName} (+15 XP)!`);
  };

  return (
    <div className="space-y-6">
      {/* Visual Hand-Portion Builder Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-200/80 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
              NO WEIGHING SCALE NEEDED
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 mt-1">
              ✋ Visual Hand-Portion Plate Builder
            </h3>
            <p className="text-xs sm:text-sm font-medium text-slate-500">
              Use your own hand to measure portions! Tap + or - to match what is on your plate.
            </p>
          </div>

          <select
            value={selectedMealSlot}
            onChange={(e) => setSelectedMealSlot(e.target.value)}
            className="px-4 py-2.5 rounded-2xl bg-slate-100 font-extrabold text-sm text-slate-800 border border-slate-200"
          >
            {['Breakfast', 'Lunch', 'Post-Workout', 'Dinner', 'Snack'].map((s) => (
              <option key={s} value={s}>
                🍴 {s}
              </option>
            ))}
          </select>
        </div>

        {/* 4 Hand Portion Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {HAND_PORTIONS.map((item) => {
            const count = portions[item.key] || 0;
            return (
              <div
                key={item.key}
                className={`p-4 rounded-2xl border transition flex flex-col justify-between ${item.color}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl">{item.emoji}</span>
                    <div>
                      <div className="font-extrabold text-base">{item.title}</div>
                      <div className="text-xs opacity-80 font-medium">{item.subtitle}</div>
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${item.badge}`}>
                    {count}x
                  </span>
                </div>

                <div className="flex items-center justify-between mt-4 pt-2.5 border-t border-black/5">
                  <span className="text-[11px] font-bold opacity-75">
                    ✨ {item.benefit}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => updatePortion(item.key, -1)}
                      className="w-9 h-9 rounded-xl bg-white/90 hover:bg-white text-slate-800 font-extrabold text-lg shadow-2xs active:scale-90"
                    >
                      -
                    </button>
                    <button
                      type="button"
                      onClick={() => updatePortion(item.key, 1)}
                      className="w-9 h-9 rounded-xl bg-slate-900 text-white font-extrabold text-lg shadow-2xs active:scale-90"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Plate Summary & 1-Tap Log */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="space-y-1 flex-1">
            <input
              type="text"
              value={customLabel}
              onChange={(e) => setCustomLabel(e.target.value)}
              placeholder="Optional: Name your meal (e.g. Mom's Chicken Dinner)..."
              className="w-full bg-white/10 text-white placeholder-slate-400 text-sm font-bold px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <div className="flex items-center gap-3 text-xs sm:text-sm font-bold pt-1 pl-1">
              <span className="text-orange-400 font-extrabold text-base">
                ≈ {estimate.cal} kcal
              </span>
              <span className="text-emerald-400">Protein: {estimate.p}g</span>
              <span className="text-sky-400">Carbs: {estimate.c}g</span>
              <span className="text-amber-400">Fats: {estimate.f}g</span>
            </div>
          </div>

          <button
            onClick={handleLogHandMeal}
            className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition shrink-0"
          >
            <Check className="w-5 h-5 stroke-[2.5]" /> Log This Plate (+15 XP)
          </button>
        </div>
      </div>

      {/* 1-Tap Beginner Visual Meals (Malaysian & Student Favorites) */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-3.5">
        <div>
          <h4 className="text-lg font-extrabold text-slate-900">
            🍱 1-Tap Student & Everyday Meals
          </h4>
          <p className="text-xs font-medium text-slate-500">
            Don't want to build a plate? Tap any common everyday meal below to log instantly!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {BEGINNER_VISUAL_MEALS.map((meal) => (
            <button
              key={meal.name}
              onClick={() => {
                onAddFood({
                  id: `f-${Date.now()}`,
                  name: meal.name,
                  slot: selectedMealSlot,
                  cal: meal.cal,
                  p: meal.p,
                  c: meal.c,
                  f: meal.f,
                });
                showToast(`Added ${meal.name}!`);
              }}
              className="p-3.5 rounded-2xl bg-slate-50 hover:bg-orange-50/70 border border-slate-200/90 hover:border-orange-300 text-left transition flex items-start gap-3 active:scale-98"
            >
              <span className="text-3xl bg-white p-2 rounded-2xl shadow-2xs border border-slate-100">
                {meal.icon}
              </span>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-orange-100 text-orange-800">
                  {meal.tag}
                </span>
                <div className="font-extrabold text-sm text-slate-900 mt-1 leading-snug">
                  {meal.name}
                </div>
                <div className="text-xs font-bold text-slate-500 mt-1">
                  <strong className="text-orange-600">{meal.cal} kcal</strong> · {meal.p}g Protein
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}