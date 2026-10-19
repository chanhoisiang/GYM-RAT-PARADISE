import React, { useState, useMemo } from 'react';
import { Brain, Dumbbell } from 'lucide-react';
import { COACH_QUICK_PROMPTS } from './gymConstants';

export default function CoachTab({
  currentWorkout,
  workoutStats,
  macroTotals,
  targets,
  unit,
}) {
  const [targetBarbellWeight, setTargetBarbellWeight] = useState(100);
  const [barWeight, setBarWeight] = useState(20);
  const [coachMessages, setCoachMessages] = useState([
    {
      role: 'assistant',
      text: "Welcome back! Your Push Day volume is looking strong (85kg × 8 on Barbell Bench Press at RPE 8.5 gives an estimated 1RM of 108kg). Ask me anything about your sets, RPE, or post-workout nutrition!",
    },
  ]);
  const [coachInput, setCoachInput] = useState('');
  const [coachLoading, setCoachLoading] = useState(false);

  const plateBreakdown = useMemo(() => {
    const perSide = Math.max(0, (Number(targetBarbellWeight) - Number(barWeight)) / 2);
    let rem = perSide;
    const plates = [
      { w: 25, color: 'bg-red-600 text-white', h: 'h-24' },
      { w: 20, color: 'bg-blue-600 text-white', h: 'h-24' },
      { w: 15, color: 'bg-amber-400 text-zinc-900', h: 'h-20' },
      { w: 10, color: 'bg-emerald-600 text-white', h: 'h-18' },
      { w: 5, color: 'bg-slate-900 text-white', h: 'h-14' },
      { w: 2.5, color: 'bg-slate-500 text-white', h: 'h-12' },
      { w: 1.25, color: 'bg-slate-300 text-slate-900', h: 'h-10' },
    ];
    const result = [];
    plates.forEach((p) => {
      const count = Math.floor((rem + 0.001) / p.w);
      if (count > 0) {
        result.push({ ...p, count });
        rem -= count * p.w;
      }
    });
    return { perSide, result };
  }, [targetBarbellWeight, barWeight]);

  const askAiCoach = async (customPrompt) => {
    const question = customPrompt || coachInput;
    if (!question.trim()) return;
    setCoachMessages((prev) => [...prev, { role: 'user', text: question }]);
    if (!customPrompt) setCoachInput('');
    setCoachLoading(true);

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
                      text: `You are an elite strength & hypertrophy coach. Workout: ${currentWorkout.title}, Volume: ${workoutStats.totalVol}kg, Macros: ${JSON.stringify(macroTotals)}. Answer concisely: ${question}`,
                    },
                  ],
                },
              ],
            }),
          }
        );
        const data = await res.json();
        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply) {
          setCoachMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
          setCoachLoading(false);
          return;
        }
      }
      await new Promise((r) => setTimeout(r, 500));
      setCoachMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `Keep top sets at RPE 8.5–9 and hit ${Math.max(0, targets.p - macroTotals.p)}g more protein today for optimal recovery.`,
        },
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setCoachLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 text-white flex items-center justify-center">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">AI Gym Personal Assistant</h3>
            <p className="text-xs font-medium text-slate-500">Synced with your live sets, RPE & macros</p>
          </div>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {COACH_QUICK_PROMPTS.map((q) => (
            <button
              key={q}
              onClick={() => askAiCoach(q)}
              className="px-3 py-1.5 rounded-xl bg-orange-50 text-orange-800 font-bold text-xs whitespace-nowrap border border-orange-200/60"
            >
              {q}
            </button>
          ))}
        </div>
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {coachMessages.map((m, i) => (
            <div
              key={i}
              className={`p-3.5 rounded-2xl text-sm leading-relaxed font-medium ${
                m.role === 'user' ? 'bg-slate-900 text-white ml-8' : 'bg-slate-100 text-slate-800 mr-4'
              }`}
            >
              {m.text}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={coachInput}
            onChange={(e) => setCoachInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && askAiCoach()}
            placeholder="Ask about form, RPE, or meals..."
            className="flex-1 h-12 px-4 rounded-2xl bg-slate-50 border border-slate-300 font-medium"
          />
          <button
            onClick={() => askAiCoach()}
            disabled={coachLoading}
            className="h-12 px-5 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-extrabold text-sm"
          >
            Ask
          </button>
        </div>
      </div>

      {/* Plate Calculator */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-orange-600" /> Plate & Warm-Up Calculator
          </h3>
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
            {[20, 15, 10].map((w) => (
              <button
                key={w}
                onClick={() => setBarWeight(w)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                  barWeight === w ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                }`}
              >
                {w}kg Bar
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Target Lift ({unit})</label>
            <input
              type="number"
              step="2.5"
              value={targetBarbellWeight}
              onChange={(e) => setTargetBarbellWeight(e.target.value)}
              className="w-full mt-1 h-12 px-3 rounded-2xl bg-slate-50 border border-slate-300 font-extrabold text-xl text-center"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Load Per Side</label>
            <div className="mt-1 h-12 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center font-extrabold text-xl text-orange-700">
              {plateBreakdown.perSide} {unit.toLowerCase()} / side
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-1.5 py-4 bg-slate-50 rounded-2xl border border-slate-200/80 min-h-28">
          <div className="w-8 h-3 bg-slate-400 rounded-l-full" />
          <div className="w-3 h-10 bg-slate-500 rounded-xs" />
          {plateBreakdown.result.map((p, idx) =>
            Array.from({ length: p.count }).map((_, i) => (
              <div key={`${idx}-${i}`} className={`${p.color} ${p.h} px-2 rounded-md flex items-center justify-center font-extrabold text-xs`}>
                {p.w}
              </div>
            ))
          )}
          <div className="w-6 h-3 bg-slate-400 rounded-r-full" />
        </div>
      </div>
    </div>
  );
}