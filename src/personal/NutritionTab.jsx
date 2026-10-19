import React, { useState } from 'react';
import { Sparkles, Camera, Trash2, X } from 'lucide-react';
import { GYM_FOOD_STAPLES } from './gymConstants';

export default function NutritionTab({
  selectedDate,
  targets,
  macroTotals,
  foodLogs,
  setFoodLogs,
  showToast,
}) {
  const [aiFoodPrompt, setAiFoodPrompt] = useState('');
  const [selectedMealSlot, setSelectedMealSlot] = useState('Dinner');
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-5 space-y-5">
        {/* Calorie Ring Card */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-extrabold text-slate-900">
              Daily Macros ({selectedDate})
            </h3>
            <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-orange-50 text-orange-700">
              {Math.max(0, targets.cal - macroTotals.cal)} kcal left
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
              <svg className="w-28 h-28 -rotate-90" viewBox="0 0 108 108">
                <circle cx="54" cy="54" r={ringRadius} stroke="#F1F5F9" strokeWidth="10" fill="transparent" />
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
                <span className="text-xl font-extrabold text-slate-900">{macroTotals.cal}</span>
                <span className="text-[11px] font-bold text-slate-400">/ {targets.cal}</span>
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <div className="flex justify-between text-sm font-bold mb-1">
                  <span>Protein</span>
                  <span className="text-emerald-600">{macroTotals.p}g / {targets.p}g</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, (macroTotals.p / targets.p) * 100)}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm font-bold mb-1">
                  <span>Carbs</span>
                  <span className="text-blue-600">{macroTotals.c}g / {targets.c}g</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(100, (macroTotals.c / targets.c) * 100)}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm font-bold mb-1">
                  <span>Fats</span>
                  <span className="text-amber-600">{macroTotals.f}g / {targets.f}g</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(100, (macroTotals.f / targets.f) * 100)}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Scanner */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-600" /> AI Macro Scanner
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
            rows={2}
            value={aiFoodPrompt}
            onChange={(e) => setAiFoodPrompt(e.target.value)}
            placeholder="e.g. '200g chicken breast, 1 bowl white rice, 2 eggs'..."
            className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 font-medium"
          />
          {foodImagePreview && (
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-slate-200">
              <img src={foodImagePreview} alt="Preview" className="w-full h-full object-cover" />
              <button
                onClick={() => {
                  setFoodImagePreview(null);
                  setFoodImageBase64(null);
                }}
                className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
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
      </div>

      {/* Right Column: 1-Tap Staples + Meal Log */}
      <div className="lg:col-span-7 space-y-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
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

        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-3">
          <h3 className="text-lg font-extrabold text-slate-900">Logged Meals ({foodLogs.length})</h3>
          <div className="space-y-2.5">
            {foodLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                <div>
                  <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-orange-100 text-orange-800">{log.slot}</span>
                  <div className="font-bold text-base text-slate-900 mt-1">{log.name}</div>
                  <div className="text-xs font-semibold text-slate-500">
                    <strong>{log.cal} kcal</strong> · P: {log.p}g · C: {log.c}g · F: {log.f}g
                  </div>
                </div>
                <button onClick={() => setFoodLogs((prev) => prev.filter((f) => f.id !== log.id))} className="p-2 text-slate-400 hover:text-red-600">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}