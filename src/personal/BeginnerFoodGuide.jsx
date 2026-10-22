import React from 'react';

const TRAFFIC_LIGHT_FOODS = [
  {
    badge: '🟢 EAT MORE (Muscle & Health)',
    bg: 'bg-emerald-50 border-emerald-300 text-emerald-950',
    items: [
      { emoji: '🍗', name: 'Chicken' },
      { emoji: '🥚', name: 'Eggs' },
      { emoji: '🐟', name: 'Fish' },
      { emoji: '🥦', name: 'Veggies' },
      { emoji: '🍎', name: 'Fruits' },
      { emoji: '🫘', name: 'Tofu' },
    ],
  },
  {
    badge: '🟡 EAT MODERATE (Energy)',
    bg: 'bg-amber-50 border-amber-300 text-amber-950',
    items: [
      { emoji: '🍚', name: 'White Rice' },
      { emoji: '🍜', name: 'Soup Noodle' },
      { emoji: '🍞', name: 'Bread' },
      { emoji: '🥣', name: 'Oats' },
      { emoji: '🥔', name: 'Potato' },
      { emoji: '🥑', name: 'Nuts' },
    ],
  },
  {
    badge: '🔴 EAT LESS (High Fat / Sugar)',
    bg: 'bg-red-50 border-red-200 text-red-950',
    items: [
      { emoji: '🍗🔥', name: 'Deep Fried' },
      { emoji: '🧋', name: 'Sweet Tea' },
      { emoji: '🍰', name: 'Cakes' },
      { emoji: '🍟', name: 'Fast Food' },
      { emoji: '🍺', name: 'Alcohol' },
      { emoji: '🍜🌶️', name: 'Oily Curry' },
    ],
  },
];

export default function BeginnerFoodGuide() {
  return (
    <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200 space-y-4">
      <div className="text-base font-extrabold text-slate-500 uppercase">
        🚦 Simple Food Traffic Light
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {TRAFFIC_LIGHT_FOODS.map((group) => (
          <div
            key={group.badge}
            className={`p-4 rounded-3xl border-2 space-y-3 ${group.bg}`}
          >
            <div className="font-extrabold text-base">{group.badge}</div>
            <div className="grid grid-cols-3 gap-2">
              {group.items.map((item) => (
                <div
                  key={item.name}
                  className="bg-white/90 p-2.5 rounded-2xl flex flex-col items-center text-center shadow-2xs"
                >
                  <span className="text-3xl">{item.emoji}</span>
                  <span className="text-xs font-extrabold mt-1 text-slate-800">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}