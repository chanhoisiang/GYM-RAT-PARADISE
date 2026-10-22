import React, { useState } from 'react';
import { Sparkles, Camera, Trash2, X, Sprout, Zap } from 'lucide-react';
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
  // 'beginner' (Visual Hand Portions, XP Streak, Food Swaps) | 'pro' (Gram Staples & AI Scanner)
  const [nutritionMode, setNutritionMode] = useState('beginner');
  const [aiFoodPrompt, setAiFoodPrompt] = useState('');
  const [selectedMealSlot, setSelectedMealSlot] = useState('Lunch');
  const [aiFoodLoading, setAiFoodLoading] = useState(false);
  const [foodImagePreview, setFoodImagePreview] = useState(null);
  const [foodImageBase64, setFoodImageBase64] = useState(null);

  const calPercent = Math.min(100, Math.round((macroTotals.cal / Math.max(1, targets.cal)) * 100));
  const ringRadius = 46;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference - (calPercent / 100) * ringCircumference;

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFoodImagePreview(reader.result);
      setFoodImageBase64(reader.result.split(',')[1]);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyzeFoodWithAI = async () => {
    if (!aiFoodPrompt.trim() && !foodImageBase64) return;
    setAiFoodLoading(true);
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    try {
      if (apiKey && !apiKey.includes('your-gemini')) {
        const parts = [
          {
            text: `You are an expert sports nutritionist. Estimate the calories and macronutrients for this meal: "${
              aiFoodPrompt || 'Uploaded meal photo'
            }". Return ONLY valid JSON with keys: {"name": string, "cal": number, "p": number, "c": number, "f": number}.`,
          },
        ];
        if (foodImageBase64) {
          parts.push({ inlineData: { mimeType: 'image/jpeg', data: foodImageBase64 } });
        }
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts }],
              generationConfig: { responseMimeType: 'application/json' },
            }),
          }
        );
        const data = await res.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const parsed = JSON.parse(rawText);
          const newEntry = {
            id: `f-${Date.now()}`,
            name: parsed.name || aiFoodPrompt,
            slot: selectedMealSlot,
            cal: Math.round(Number(parsed.cal) || 350),
            p: Math.round(Number(parsed.p) || 25),
            c: Math.round(Number(parsed.c) || 35),
            f: Math.round(Number(parsed.f) || 10),
          };
          setFoodLogs((prev) => [newEntry, ...prev]);
          setAiFoodPrompt('');
          setFoodImagePreview(null);
          setFoodImageBase64(null);
          showToast(`Logged ${newEntry.name} (${newEntry.cal} kcal)`);
          setAiFoodLoading(false);
          return;
        }
      }
      await new Promise((r) => setTimeout(r, 600));
      const est = { name: aiFoodPrompt || 'Custom Gym Meal', cal: 480, p: 38, c: 48, f: 14 };
      setFoodLogs((prev) => [{ id: `f-${Date.now()}`, slot: selectedMealSlot, ...est }, ...prev]);
      setAiFoodPrompt('');
      showToast(`Logged ${est.name}`);
    } catch (err) {
      console.error(err);
    } finally {
      setAiFoodLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode Switcher: Beginner Student Friendly vs Pro Macro Tracker */}
      <div className="bg-white p-2 rounded-3xl border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="pl-3">
          <div className="font-extrabold text-sm sm:text-base text-slate-900">
            Nutrition Experience Mode
          </div>
          <div className="text-xs font-medium text-slate-500">
            Switch between visual hand-portion coaching for beginners or exact gram macros
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl w-full sm:w-auto">
          <button
            onClick={() => setNutritionMode('beginner')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition ${
              nutritionMode === 'beginner'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sprout className="w-4 h-4" /> 🌱 Beginner / Student Mode
          </button>
          <button
            onClick={() => setNutritionMode('pro')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition ${
              nutritionMode === 'pro'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-4 h-4" /> ⚡ Pro Macro Mode
          </button>
        </div>
      </div>

      {/* Top Gamified Hydration & Consistency Bar (Always visible to keep students motivated) */}
      <HydrationStreakBar
        foodLogsCount={foodLogs.length}
        macroTotals={macroTotals}
        targets={targets}
        showToast={showToast}
      />

      {/* Friendly Visual Nutrient Progress Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-200/80">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">
              Today's Body Fuel Meter ({selectedDate})
            </h3>
            <p className="text-xs font-medium text-slate-500">
              {macroTotals.cal <= targets.cal
                ? `You have ${targets.cal - macroTotals.cal} kcal left to enjoy today!`
                : `You are ${macroTotals.cal - targets.cal} kcal over target today.`}
            </p>
          </div>
          <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-orange-100 text-orange-800">
            {calPercent}% of Daily Energy
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          {/* Calorie Ring */}
          <div className="flex items-center gap-4 justify-center md:justify-start bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60">
            <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 108 108">
                <circle cx="54" cy="54" r={ringRadius} stroke="#E2E8F0" strokeWidth="10" fill="transparent" />
                <circle
                  cx="54"
                  cy="54"
                  r={ringRadius}
                  stroke="#F97316"
                  strokeWidth="10"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={ringOffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-lg font-extrabold text-slate-900">{macroTotals.cal}</span>
                <span className="text-[10px] font-bold text-slate-400">/ {targets.cal}</span>
              </div>
            </div>
            <div>
              <div className="text-xs font-extrabold uppercase text-orange-600">Total Calories</div>
              <div className="text-sm font-bold text-slate-800 mt-0.5">Daily Energy Budget</div>
            </div>
          </div>

          {/* Protein Friendly Card */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-extrabold text-sm text-emerald-950">💪 Muscle Builder (Protein)</span>
              <span className="text-xs font-extrabold text-emerald-700">
                {macroTotals.p}g / {targets.p}g
              </span>
            </div>
            <div className="h-3 bg-white rounded-full overflow-hidden border border-emerald-200">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all"
                style={{ width: `${Math.min(100, (macroTotals.p / targets.p) * 100)}%` }}
              />
            </div>
            <div className="text-[11px] font-semibold text-emerald-800">
              ≈ {Math.round(macroTotals.p / 25)} of {Math.round(targets.p / 25)} Palms eaten today
            </div>
          </div>

          {/* Carbs Friendly Card */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-extrabold text-sm text-blue-950">⚡ Gym Energy (Carbs)</span>
              <span className="text-xs font-extrabold text-blue-700">
                {macroTotals.c}g / {targets.c}g
              </span>
            </div>
            <div className="h-3 bg-white rounded-full overflow-hidden border border-blue-200">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${Math.min(100, (macroTotals.c / targets.c) * 100)}%` }}
              />
            </div>
            <div className="text-[11px] font-semibold text-blue-800">
              ≈ {Math.round(macroTotals.c / 35)} of {Math.round(targets.c / 35)} Cupped Hands eaten
            </div>
          </div>

          {/* Fats Friendly Card */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-extrabold text-sm text-amber-950">🥑 Essentials (Healthy Fats)</span>
              <span className="text-xs font-extrabold text-amber-700">
                {macroTotals.f}g / {targets.f}g
              </span>
            </div>
            <div className="h-3 bg-white rounded-full overflow-hidden border border-amber-200">
              <div
                className="h-full bg-amber-500 rounded-full transition-all"
                style={{ width: `${Math.min(100, (macroTotals.f / targets.f) * 100)}%` }}
              />
            </div>
            <div className="text-[11px] font-semibold text-amber-800">
              ≈ {Math.round(macroTotals.f / 9)} of {Math.round(targets.f / 9)} Thumbs eaten
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          MODE A: BEGINNER / STUDENT VISUAL LOGGER & GUIDE
      ===================================================================== */}
      {nutritionMode === 'beginner' ? (
        <div className="space-y-6">
          <BeginnerPortionLogger
            selectedMealSlot={selectedMealSlot}
            setSelectedMealSlot={setSelectedMealSlot}
            onAddFood={(newFood) => setFoodLogs((prev) => [newFood, ...prev])}
            showToast={showToast}
          />

          {/* AI Camera Helper for Students who just want to snap a photo */}
          <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-600" /> Not Sure What's in Your Meal? Ask AI!
              </h3>
            </div>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                value={aiFoodPrompt}
                onChange={(e) => setAiFoodPrompt(e.target.value)}
                placeholder="Type what you ate (e.g. '1 plate chicken rice with 1 egg')..."
                className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 font-medium"
              />
              <div className="flex items-center gap-2">
                <label className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 font-bold text-sm flex items-center gap-2 cursor-pointer">
                  <Camera className="w-5 h-5" /> Snap Photo
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
                <button
                  onClick={handleAnalyzeFoodWithAI}
                  disabled={aiFoodLoading}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-extrabold text-sm"
                >
                  {aiFoodLoading ? 'Scanning...' : 'AI Estimate'}
                </button>
              </div>
            </div>
          </div>

          <BeginnerFoodGuide />
        </div>
      ) : (
        /* ===================================================================
            MODE B: PRO LIFTER MACRO MODE
        =================================================================== */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-600" /> AI Macro Scanner (Pro)
              </h3>
              <select
                value={selectedMealSlot}
                onChange={(e) => setSelectedMealSlot(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 font-bold text-sm"
              >
                {['Breakfast', 'Pre-Workout', 'Post-Workout', 'Lunch', 'Dinner', 'Snack'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <textarea
              rows={3}
              value={aiFoodPrompt}
              onChange={(e) => setAiFoodPrompt(e.target.value)}
              placeholder="e.g. '200g chicken breast, 200g cooked white rice, 3 whole eggs'..."
              className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 font-medium"
            />
            <div className="flex items-center gap-2">
              <label className="px-4 py-3 rounded-2xl bg-slate-100 font-bold text-sm flex items-center gap-2 cursor-pointer">
                <Camera className="w-5 h-5" /> Photo
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
              <button
                onClick={handleAnalyzeFoodWithAI}
                disabled={aiFoodLoading}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-extrabold"
              >
                {aiFoodLoading ? 'Analyzing...' : 'AI Calculate & Log'}
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {GYM_FOOD_STAPLES.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setFoodLogs((prev) => [{ id: `f-${Date.now()}`, ...item }, ...prev]);
                  showToast(`Added ${item.name}`);
                }}
                className="bg-white p-3.5 rounded-2xl border border-slate-200/80 text-left hover:border-orange-400 transition"
              >
                <span className="text-2xl">{item.icon}</span>
                <div className="font-bold text-xs text-slate-900 truncate mt-1">{item.name}</div>
                <div className="text-xs font-extrabold text-orange-600">{item.cal} kcal · {item.p}g P</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Today's Food Diary (Shared across both modes) */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-3">
        <h3 className="text-lg font-extrabold text-slate-900">
          📒 Today's Food Diary ({foodLogs.length} meals logged)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {foodLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70"
            >
              <div>
                <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-orange-100 text-orange-800">
                  {log.slot}
                </span>
                <div className="font-bold text-base text-slate-900 mt-1">{log.name}</div>
                <div className="text-xs font-semibold text-slate-500">
                  <strong className="text-slate-900">{log.cal} kcal</strong> · 💪 {log.p}g Protein · ⚡ {log.c}g Carbs · 🥑 {log.f}g Fat
                </div>
              </div>
              <button
                onClick={() => setFoodLogs((prev) => prev.filter((f) => f.id !== log.id))}
                className="p-2 text-slate-400 hover:text-red-600"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}