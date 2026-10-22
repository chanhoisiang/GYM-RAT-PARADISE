import React, { useState } from 'react';
import { Check, Plus } from 'lucide-react';

const MEAL_TIME_BUTTONS = [
  { id: 'Breakfast', label: 'Morning', emoji: '☀️' },
  { id: 'Lunch', label: 'Lunch', emoji: '🌤️' },
  { id: 'Post-Workout', label: 'Snack / Gym', emoji: '💪' },
  { id: 'Dinner', label: 'Dinner', emoji: '🌙' },
];

const HAND_PORTIONS = [
  {
    key: 'palmsProtein',
    title: 'Meat / Egg',
    handEmoji: '✋',
    foodEmoji: '🍗',
    perUnit: { cal: 145, p: 26, c: 1, f: 4 },
    bg: 'bg-emerald-50 border-emerald-300 text-emerald-950',
  },
  {
    key: 'fistsCarbs',
    title: 'Rice / Noodle',
    handEmoji: '🤲',
    foodEmoji: '🍚',
    perUnit: { cal: 160, p: 3, c: 35, f: 1 },
    bg: 'bg-blue-50 border-blue-300 text-blue-950',
  },
  {
    key: 'fistsVeggies',
    title: 'Vege / Fruit',
    handEmoji: '✊',
    foodEmoji: '🥦',
    perUnit: { cal: 55, p: 2, c: 12, f: 0 },
    bg: 'bg-teal-50 border-teal-300 text-teal-950',
  },
  {
    key: 'thumbsFat',
    title: 'Oil / Nuts',
    handEmoji: '👍',
    foodEmoji: '🥑',
    perUnit: { cal: 95, p: 2, c: 1, f: 9 },
    bg: 'bg-amber-50 border-amber-300 text-amber-950',
  },
];

const PICTURE_MEALS = [
  { name: 'Chicken Rice', emoji: '🍗🍚', cal: 520, p: 38, c: 58, f: 14 },
  { name: 'Pork Noodle', emoji: '🍜🥩', cal: 510, p: 34, c: 56, f: 15 },
  { name: '3 Eggs + Bread', emoji: '🍳🍞', cal: 350, p: 22, c: 28, f: 16 },
  { name: 'Chap Fan (Meat+Veg)', emoji: '🍛🥦', cal: 490, p: 32, c: 52, f: 15 },
  { name: 'Fish / Salmon Set', emoji: '🐟🍚', cal: 480, p: 36, c: 45, f: 16 },
  { name: 'Oats + Milk', emoji: '🥣🥛', cal: 310, p: 16, c: 48, f: 6 },
  { name: 'Protein Shake', emoji: '🥤💪', cal: 180, p: 35, c: 4, f: 2 },
  { name: 'Chicken Chop', emoji: '🥩🥔', cal: 550, p: 42, c: 35, f: 24 },
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
    thumbsFat: 0,
  });

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
    onAddFood({
      id: `f-${Date.now()}`,
      name: `Custom Plate (✋${portions.palmsProtein} 🤲${portions.fistsCarbs} ✊${portions.fistsVeggies})`,
      slot: selectedMealSlot,
      ...estimate,
    });
    showToast('✅ Added Plate!');
  };

  return (
    <div className="space-y-6">
      {/* STEP 1: GIANT MEAL TIME BUTTONS */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200">
        <div className="text-base font-extrabold text-slate-500 uppercase mb-3">
          1. Tap Meal Time
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {MEAL_TIME_BUTTONS.map((m) => {
            const active = selectedMealSlot === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedMealSlot(m.id)}
                className={`py-4 px-3 rounded-2xl border-2 flex items-center justify-center gap-2.5 font-extrabold text-lg transition active:scale-95 ${
                  active
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <span className="text-2xl">{m.emoji}</span>
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 2: 1-TAP PICTURE FOOD MENU (EASIEST FOR SENIORS & BEGINNERS) */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200 space-y-4">
        <div className="text-base font-extrabold text-slate-500 uppercase">
          2. Tap Picture to Add Food
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {PICTURE_MEALS.map((meal) => (
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
                showToast(`✅ Added ${meal.name}!`);
              }}
              className="p-4 rounded-3xl bg-slate-50 hover:bg-orange-50 border-2 border-slate-200 hover:border-orange-400 flex flex-col items-center text-center transition active:scale-95"
            >
              <div className="text-4xl sm:text-5xl mb-2">{meal.emoji}</div>
              <div className="font-extrabold text-base sm:text-lg text-slate-900 leading-tight">
                {meal.name}
              </div>
              <div className="mt-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 font-extrabold text-xs">
                🔥 {meal.cal} · 💪 {meal.p}g
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* STEP 3: HAND SIZE BUILDER (GIANT EMOJIS + HUGE PLUS/MINUS) */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200 space-y-4">
        <div className="text-base font-extrabold text-slate-500 uppercase">
          Or Build Plate by Hand Size
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {HAND_PORTIONS.map((item) => {
            const count = portions[item.key] || 0;
            return (
              <div
                key={item.key}
                className={`p-4 rounded-3xl border-2 flex flex-col items-center text-center justify-between ${item.bg}`}
              >
                <div className="text-4xl sm:text-5xl mb-1">
                  {item.handEmoji}
                  {item.foodEmoji}
                </div>
                <div className="font-extrabold text-lg">{item.title}</div>

                {/* Giant - / + Buttons */}
                <div className="flex items-center justify-between w-full mt-3 bg-white/90 rounded-2xl p-1.5 border border-black/10">
                  <button
                    type="button"
                    onClick={() => updatePortion(item.key, -1)}
                    className="w-11 h-11 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-900 font-extrabold text-2xl active:scale-90"
                  >
                    −
                  </button>
                  <span className="font-extrabold text-2xl px-2">{count}</span>
                  <button
                    type="button"
                    onClick={() => updatePortion(item.key, 1)}
                    className="w-11 h-11 rounded-xl bg-slate-900 text-white font-extrabold text-2xl active:scale-90"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleLogHandMeal}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-extrabold text-lg shadow-lg flex items-center justify-center gap-2 active:scale-98 transition"
        >
          <Check className="w-6 h-6 stroke-[3]" />
          Add This Plate (🔥 {estimate.cal} kcal)
        </button>
      </div>
    </div>
  );
}