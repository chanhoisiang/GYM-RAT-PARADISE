import React, { useState } from 'react';
import { Camera, Trash2, Sprout, Zap, Plus, Edit3, Sparkles } from 'lucide-react';
import { GYM_FOOD_STAPLES } from './gymConstants';
import HydrationStreakBar from './HydrationStreakBar';
import BeginnerPortionLogger from './BeginnerPortionLogger';
import BeginnerFoodGuide from './BeginnerFoodGuide';
import AddFoodModal from './AddFoodModal';

export default function NutritionTab({
  selectedDate,
  targets,
  macroTotals,
  foodLogs,
  setFoodLogs,
  showToast,
}) {
  const [nutritionMode, setNutritionMode] = useState('beginner');
  const [selectedMealSlot, setSelectedMealSlot] = useState('Lunch');
  const [showAddFoodModal, setShowAddFoodModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* =====================================================================
          HERO ACTION BAR: + ADD FOOD (AI PHOTO SCAN OR MANUAL KEY-IN)
      ===================================================================== */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-900 text-white p-5 rounded-3xl shadow-lg flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-orange-500/20 border border-orange-400/30 flex items-center justify-center text-3xl shrink-0">
            📸
          </div>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-orange-500 text-white">
              AI VISION + MANUAL LOG
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold mt-1">
              Log Your Meal in Seconds
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Take a photo of your food for AI analysis or key in calories manually
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddFoodModal(true)}
          className="py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-extrabold text-base shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2.5 active:scale-95 transition shrink-0"
        >
          <Camera className="w-5 h-5" />
          <span>+ Add Food (AI Photo / Manual)</span>
        </button>
      </div>

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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {GYM_FOOD_STAPLES.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setFoodLogs((prev) => [{ id: `f-${Date.now()}`, ...item }, ...prev]);
                  showToast(`✅ Added ${item.name}`);
                }}
                className="bg-white p-4 rounded-3xl border-2 border-slate-200 hover:border-orange-400 text-center flex flex-col items-center transition active:scale-95"
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
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-extrabold text-slate-900">
            🍽️ Eaten Today ({foodLogs.length})
          </h3>
          <button
            onClick={() => setShowAddFoodModal(true)}
            className="px-3.5 py-2 rounded-xl bg-orange-100 text-orange-800 font-extrabold text-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Food
          </button>
        </div>

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

      {/* ADD FOOD MODAL (AI PHOTO SCAN + MANUAL KEY-IN) */}
      <AddFoodModal
        isOpen={showAddFoodModal}
        onClose={() => setShowAddFoodModal(false)}
        defaultSlot={selectedMealSlot}
        onAddFood={(newFood) => setFoodLogs((prev) => [newFood, ...prev])}
        showToast={showToast}
      />
    </div>
  );
}