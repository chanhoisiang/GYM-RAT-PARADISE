import React, { useState } from 'react';
import { Camera, Trash2, Sprout, Zap } from 'lucide-react';
import { GYM_FOOD_STAPLES } from './gymConstants';
import HydrationStreakBar from './HydrationStreakBar';
import BeginnerPortionLogger from './BeginnerPortionLogger';
import BeginnerFoodGuide from './BeginnerFoodGuide';

export default function NutritionTab({
  selectedDate,
  targets,
  macroTotals,
  foodLogs,
  setFoodLogs,
  showToast,
}) {
  const [nutritionMode, setNutritionMode] = useState('beginner');
  const [aiFoodPrompt, setAiFoodPrompt] = useState('');
  const [selectedMealSlot, setSelectedMealSlot] = useState('Lunch');
  const [aiFoodLoading, setAiFoodLoading] = useState(false);

  const handleAnalyzeFoodWithAI = async () => {
    if (!aiFoodPrompt.trim()) return;
    setAiFoodLoading(true);
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    try {
      if (apiKey && !apiKey.includes('your-gemini')) {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `Estimate calories and macros for: "${aiFoodPrompt}". Return ONLY JSON: {"name": string, "cal": number, "p": number, "c": number, "f": number}.`,
                    },
                  ],
                },
              ],
              generationConfig: { responseMimeType: 'application/json' },
            }),
          }
        );
        const data = await res.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const parsed = JSON.parse(rawText);
          setFoodLogs((prev) => [
            {
              id: `f-${Date.now()}`,
              name: parsed.name || aiFoodPrompt,
              slot: selectedMealSlot,
              cal: Math.round(Number(parsed.cal) || 350),
              p: Math.round(Number(parsed.p) || 25),
              c: Math.round(Number(parsed.c) || 35),
              f: Math.round(Number(parsed.f) || 10),
            },
            ...prev,
          ]);
          setAiFoodPrompt('');
          showToast('✅ Added Food!');
          setAiFoodLoading(false);
          return;
        }
      }
      await new Promise((r) => setTimeout(r, 500));
      setFoodLogs((prev) => [
        {
          id: `f-${Date.now()}`,
          name: aiFoodPrompt,
          slot: selectedMealSlot,
          cal: 480,
          p: 35,
          c: 50,
          f: 14,
        },
        ...prev,
      ]);
      setAiFoodPrompt('');
      showToast('✅ Added Food!');
    } catch (err) {
      console.error(err);
    } finally {
      setAiFoodLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* BIG 2-BUTTON MODE SWITCHER */}
      <div className="grid grid-cols-2 gap-3 bg-white p-2 rounded-3xl border border-slate-200 shadow-2xs">
        <button
          onClick={() => setNutritionMode('beginner')}
          className={`py-3.5 rounded-2xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 transition ${
            nutritionMode === 'beginner'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sprout className="w-5 h-5" /> 🌱 Easy Picture Mode
        </button>
        <button
          onClick={() => setNutritionMode('pro')}
          className={`py-3.5 rounded-2xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 transition ${
            nutritionMode === 'pro'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Zap className="w-5 h-5" /> ⚡ Pro Gram Mode
        </button>
      </div>

      {/* 4 GIANT ICON GAUGES (ZERO JARGON) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {[
          {
            emoji: '🔥',
            label: 'Energy (Calories)',
            val: macroTotals.cal,
            max: targets.cal,
            unit: '',
            bar: 'bg-orange-500',
            bg: 'bg-white border-slate-200',
          },
          {
            emoji: '🍗',
            label: 'Meat & Egg (Protein)',
            val: macroTotals.p,
            max: targets.p,
            unit: 'g',
            bar: 'bg-emerald-500',
            bg: 'bg-white border-slate-200',
          },
          {
            emoji: '🍚',
            label: 'Rice & Bread (Carbs)',
            val: macroTotals.c,
            max: targets.c,
            unit: 'g',
            bar: 'bg-blue-500',
            bg: 'bg-white border-slate-200',
          },
          {
            emoji: '🥑',
            label: 'Oil & Nuts (Fat)',
            val: macroTotals.f,
            max: targets.f,
            unit: 'g',
            bar: 'bg-amber-500',
            bg: 'bg-white border-slate-200',
          },
        ].map((g) => {
          const pct = Math.min(100, Math.round((g.val / Math.max(1, g.max)) * 100));
          return (
            <div
              key={g.label}
              className={`p-4 rounded-3xl border-2 shadow-2xs space-y-2 ${g.bg}`}
            >
              <div className="flex items-center gap-2">
                <span className="text-3xl">{g.emoji}</span>
                <span className="font-extrabold text-sm text-slate-600">
                  {g.label}
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {g.val}
                {g.unit}{' '}
                <span className="text-sm font-bold text-slate-400">
                  / {g.max}
                  {g.unit}
                </span>
              </div>
              <div className="h-3.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${g.bar} rounded-full transition-all`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* WATER & STREAK BAR */}
      <HydrationStreakBar
        foodLogsCount={foodLogs.length}
        showToast={showToast}
      />

      {/* EASY PICTURE MODE VS PRO MODE */}
      {nutritionMode === 'beginner' ? (
        <div className="space-y-6">
          <BeginnerPortionLogger
            selectedMealSlot={selectedMealSlot}
            setSelectedMealSlot={setSelectedMealSlot}
            onAddFood={(newFood) => setFoodLogs((prev) => [newFood, ...prev])}
            showToast={showToast}
          />
          <BeginnerFoodGuide />
        </div>
      ) : (
        <div className="space-y-5">
          {/* AI Quick Input */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={aiFoodPrompt}
              onChange={(e) => setAiFoodPrompt(e.target.value)}
              placeholder="Type food (e.g. 200g chicken breast + rice)..."
              className="flex-1 px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-300 font-bold text-lg"
            />
            <button
              onClick={handleAnalyzeFoodWithAI}
              disabled={aiFoodLoading}
              className="px-6 py-3.5 rounded-2xl bg-orange-600 text-white font-extrabold text-base"
            >
              {aiFoodLoading ? '...' : '✨ AI Add'}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {GYM_FOOD_STAPLES.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setFoodLogs((prev) => [{ id: `f-${Date.now()}`, ...item }, ...prev]);
                  showToast(`✅ Added ${item.name}`);
                }}
                className="bg-white p-4 rounded-3xl border-2 border-slate-200 hover:border-orange-400 text-center flex flex-col items-center"
              >
                <span className="text-4xl mb-1">{item.icon}</span>
                <div className="font-extrabold text-sm text-slate-900">{item.name}</div>
                <div className="text-xs font-extrabold text-orange-600 mt-1">
                  🔥 {item.cal} · 💪 {item.p}g
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TODAY'S EATEN FOOD LIST (LARGE FONTS) */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200 space-y-3">
        <h3 className="text-xl font-extrabold text-slate-900">
          🍽️ Eaten Today ({foodLogs.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {foodLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200"
            >
              <div>
                <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-lg bg-orange-100 text-orange-800">
                  {log.slot}
                </span>
                <div className="font-extrabold text-lg text-slate-900 mt-1">
                  {log.name}
                </div>
                <div className="text-sm font-bold text-slate-600 mt-0.5">
                  🔥 {log.cal} kcal · 🍗 {log.p}g · 🍚 {log.c}g · 🥑 {log.f}g
                </div>
              </div>
              <button
                onClick={() =>
                  setFoodLogs((prev) => prev.filter((f) => f.id !== log.id))
                }
                className="p-3 text-slate-400 hover:text-red-600 rounded-xl"
              >
                <Trash2 className="w-6 h-6" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}