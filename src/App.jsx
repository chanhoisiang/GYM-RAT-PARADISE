import React, { useState, useEffect, useMemo } from 'react';
import {
  Dumbbell, Flame, Brain, TrendingUp, Database, Download, X, CheckCircle2, QrCode
} from 'lucide-react';

// Personal Gym Modules
import { TRANSLATIONS, WORKOUT_TEMPLATES, calc1RM } from './personal/gymConstants';
import TopHeader from './personal/TopHeader';
import WorkoutTab from './personal/WorkoutTab';
import NutritionTab from './personal/NutritionTab';
import CoachTab from './personal/CoachTab';
import ProgressTab from './personal/ProgressTab';

// PT & SuperApp Modules
import PTPortal from './pt/PTPortal';
import AuthModal from './pt/AuthModal';
import SuperBurgerDrawer from './pt/SuperBurgerDrawer';

export default function App() {
  const [appMode, setAppMode] = useState('personal'); // 'personal' | 'pt_portal'
  const [activeTab, setActiveTab] = useState('workout');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [toastMsg, setToastMsg] = useState(null);

  // User, Auth, Burger Menu & Settings
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ironlog_user_v1');
    return saved ? JSON.parse(saved) : { name: 'Chan Hoi Siang', email: 'athlete@ironlog.gym', role: 'boss' };
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showBurgerDrawer, setShowBurgerDrawer] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [lang, setLang] = useState('EN');
  const [unit, setUnit] = useState('KG');
  const [ptExternalCommand, setPtExternalCommand] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.EN;

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2800);
  };

  // Force PWA Refresh Handler
  const handleForceRefresh = async () => {
    setIsRefreshing(true);
    showToast('Fetching latest app version...');
    try {
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        for (const r of regs) await r.unregister();
      }
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
    } catch (e) {
      console.error(e);
    }
    setTimeout(() => window.location.reload(), 350);
  };

  const handleBurgerQuickAction = (actionType) => {
    if (actionType === 'qr_pass') {
      setShowQrModal(true);
      return;
    }
    setAppMode('pt_portal');
    setPtExternalCommand({ type: actionType, ts: Date.now() });
  };

  // Supabase Config Check
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey && !supabaseUrl.includes('your-project'));
  const [syncingCloud, setSyncingCloud] = useState(false);

  // Workout Store
  const [workoutHistory, setWorkoutHistory] = useState(() => {
    const saved = localStorage.getItem('ironlog_history_v3');
    if (saved) return JSON.parse(saved);
    const today = new Date().toISOString().split('T')[0];
    return {
      [today]: {
        title: WORKOUT_TEMPLATES['Push Day'].title,
        exercises: WORKOUT_TEMPLATES['Push Day'].exercises,
      },
    };
  });

  const currentWorkout = useMemo(
    () =>
      workoutHistory[selectedDate] || {
        title: WORKOUT_TEMPLATES['Push Day'].title,
        exercises: WORKOUT_TEMPLATES['Push Day'].exercises,
      },
    [workoutHistory, selectedDate]
  );

  const setCurrentWorkout = (updater) => {
    setWorkoutHistory((prev) => {
      const existing = prev[selectedDate] || {
        title: WORKOUT_TEMPLATES['Push Day'].title,
        exercises: WORKOUT_TEMPLATES['Push Day'].exercises,
      };
      const updated = typeof updater === 'function' ? updater(existing) : updater;
      return { ...prev, [selectedDate]: updated };
    });
  };

  // Timers
  const [sessionSeconds, setSessionSeconds] = useState(1741);
  const [sessionRunning, setSessionRunning] = useState(true);
  const [restSeconds, setRestSeconds] = useState(0);
  const [restPreset, setRestPreset] = useState(90);
  const [autoStartRest, setAutoStartRest] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Nutrition Store
  const [targets, setTargets] = useState(() => {
    const saved = localStorage.getItem('ironlog_targets_v3');
    return saved ? JSON.parse(saved) : { cal: 2550, p: 185, c: 280, f: 75 };
  });

  const [foodLogsByDate, setFoodLogsByDate] = useState(() => {
    const saved = localStorage.getItem('ironlog_food_v3');
    if (saved) return JSON.parse(saved);
    const today = new Date().toISOString().split('T')[0];
    return {
      [today]: [
        { id: 'f-1', name: 'Rolled Oats (80g) + 3 Whole Eggs', slot: 'Breakfast', cal: 519, p: 30, c: 55, f: 20 },
        { id: 'f-2', name: 'Pork Noodle / Chu Yuk Fun (Extra Lean Pork)', slot: 'Lunch', cal: 540, p: 36, c: 58, f: 16 },
        { id: 'f-3', name: 'Whey Isolate Shake + Banana', slot: 'Post-Workout', cal: 275, p: 39, c: 27, f: 1 },
      ],
    };
  });

  const foodLogs = useMemo(() => foodLogsByDate[selectedDate] || [], [foodLogsByDate, selectedDate]);
  const setFoodLogs = (updater) => {
    setFoodLogsByDate((prev) => {
      const currentList = prev[selectedDate] || [];
      const nextList = typeof updater === 'function' ? updater(currentList) : updater;
      return { ...prev, [selectedDate]: nextList };
    });
  };

  // Bodyweight Store
  const [bodyweightLogs, setBodyweightLogs] = useState(() => {
    const saved = localStorage.getItem('ironlog_bw_v3');
    return saved
      ? JSON.parse(saved)
      : [
          { date: '13 Oct', weight: 74.8 },
          { date: '14 Oct', weight: 74.6 },
          { date: '15 Oct', weight: 74.9 },
          { date: '16 Oct', weight: 74.5 },
          { date: '17 Oct', weight: 74.4 },
          { date: '18 Oct', weight: 74.3 },
          { date: '19 Oct', weight: 74.2 },
        ];
  });

  // Persist to LocalStorage
  useEffect(() => localStorage.setItem('ironlog_user_v1', JSON.stringify(user)), [user]);
  useEffect(() => localStorage.setItem('ironlog_history_v3', JSON.stringify(workoutHistory)), [workoutHistory]);
  useEffect(() => localStorage.setItem('ironlog_food_v3', JSON.stringify(foodLogsByDate)), [foodLogsByDate]);
  useEffect(() => localStorage.setItem('ironlog_targets_v3', JSON.stringify(targets)), [targets]);
  useEffect(() => localStorage.setItem('ironlog_bw_v3', JSON.stringify(bodyweightLogs)), [bodyweightLogs]);

  // Stopwatch & Rest Timer Effects
  useEffect(() => {
    if (!sessionRunning) return;
    const interval = setInterval(() => setSessionSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [sessionRunning]);

  useEffect(() => {
    if (restSeconds <= 0) return;
    const interval = setInterval(() => setRestSeconds((prev) => Math.max(0, prev - 1)), 1000);
    return () => clearInterval(interval);
  }, [restSeconds]);

  const shiftDate = (days) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const syncSessionToSupabase = async () => {
    if (!isSupabaseConfigured) {
      setShowSqlModal(true);
      showToast('Saved locally! Add Supabase keys in .env for cloud sync.');
      return;
    }
    setSyncingCloud(true);
    try {
      await fetch(`${supabaseUrl}/rest/v1/workouts`, {
        method: 'POST',
        headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: selectedDate, name: currentWorkout.title, duration_seconds: sessionSeconds, completed: true }),
      });
      showToast('Synced workout to Supabase Cloud!');
    } catch (e) {
      showToast('Saved on device!');
    } finally {
      setSyncingCloud(false);
    }
  };

  // Computed Stats
  const workoutStats = useMemo(() => {
    let totalVol = 0, doneSets = 0, totalSets = 0, rpeSum = 0, rpeCount = 0;
    currentWorkout.exercises.forEach((ex) => {
      ex.sets.forEach((s) => {
        totalSets++;
        if (s.done) {
          doneSets++;
          totalVol += (Number(s.weight) || 0) * (Number(s.reps) || 0);
          if (s.rpe) { rpeSum += Number(s.rpe); rpeCount++; }
        }
      });
    });
    return { totalVol: Math.round(totalVol), doneSets, totalSets, avgRpe: rpeCount > 0 ? (rpeSum / rpeCount).toFixed(1) : '—' };
  }, [currentWorkout]);

  const macroTotals = useMemo(
    () =>
      foodLogs.reduce(
        (acc, item) => ({
          cal: acc.cal + (Number(item.cal) || 0),
          p: acc.p + (Number(item.p) || 0),
          c: acc.c + (Number(item.c) || 0),
          f: acc.f + (Number(item.f) || 0),
        }),
        { cal: 0, p: 0, c: 0, f: 0 }
      ),
    [foodLogs]
  );

  const prLeaderboard = useMemo(() => {
    const map = {};
    Object.values(workoutHistory).forEach((day) => {
      (day.exercises || []).forEach((ex) => {
        ex.sets.forEach((s) => {
          const e1rm = calc1RM(s.weight, s.reps);
          if (!map[ex.name] || e1rm > map[ex.name].e1rm) {
            map[ex.name] = { name: ex.name, muscle: ex.muscle, weight: s.weight, reps: s.reps, e1rm };
          }
        });
      });
    });
    return Object.values(map).sort((a, b) => b.e1rm - a.e1rm);
  }, [workoutHistory]);

  return (
    <div className="min-h-screen bg-[#F2F2F7] text-[#1C1C1E] pb-32">
      {toastMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white px-4 py-2.5 rounded-2xl shadow-xl text-sm font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Modular Sticky Top Header */}
      <TopHeader
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        shiftDate={shiftDate}
        isSupabaseConfigured={isSupabaseConfigured}
        sessionSeconds={sessionSeconds}
        sessionRunning={sessionRunning}
        setSessionRunning={setSessionRunning}
        handleForceRefresh={handleForceRefresh}
        isRefreshing={isRefreshing}
        user={user}
        setShowAuthModal={setShowAuthModal}
        setShowBurgerDrawer={setShowBurgerDrawer}
        appMode={appMode}
        restSeconds={restSeconds}
        setRestSeconds={setRestSeconds}
        restPreset={restPreset}
        setRestPreset={setRestPreset}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      {/* Main Widescreen Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 space-y-6">
        <div className="grid grid-cols-2 gap-2.5 bg-slate-200/80 p-1.5 rounded-2xl max-w-2xl mx-auto lg:max-w-none">
          <button
            onClick={() => setAppMode('personal')}
            className={`py-3 rounded-xl font-extrabold text-xs sm:text-base transition ${
              appMode === 'personal' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            {t.personalApp}
          </button>
          <button
            onClick={() => setAppMode('pt_portal')}
            className={`py-3 rounded-xl font-extrabold text-xs sm:text-base transition ${
              appMode === 'pt_portal' ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-xs' : 'text-slate-600'
            }`}
          >
            {t.ptPortal}
          </button>
        </div>

        {appMode === 'pt_portal' ? (
          <PTPortal showToast={showToast} externalCommand={ptExternalCommand} />
        ) : (
          <>
            {activeTab === 'workout' && (
              <WorkoutTab
                currentWorkout={currentWorkout}
                setCurrentWorkout={setCurrentWorkout}
                workoutStats={workoutStats}
                unit={unit}
                autoStartRest={autoStartRest}
                setAutoStartRest={setAutoStartRest}
                restPreset={restPreset}
                setRestSeconds={setRestSeconds}
                syncSessionToSupabase={syncSessionToSupabase}
                syncingCloud={syncingCloud}
                setShowSqlModal={setShowSqlModal}
                showToast={showToast}
              />
            )}

            {activeTab === 'nutrition' && (
              <NutritionTab
                selectedDate={selectedDate}
                targets={targets}
                macroTotals={macroTotals}
                foodLogs={foodLogs}
                setFoodLogs={setFoodLogs}
                showToast={showToast}
              />
            )}

            {activeTab === 'coach' && (
              <CoachTab
                currentWorkout={currentWorkout}
                workoutStats={workoutStats}
                macroTotals={macroTotals}
                targets={targets}
                unit={unit}
                showToast={showToast}
              />
            )}

            {activeTab === 'progress' && (
              <ProgressTab
                prLeaderboard={prLeaderboard}
                bodyweightLogs={bodyweightLogs}
                setBodyweightLogs={setBodyweightLogs}
                setTargets={setTargets}
                showToast={showToast}
              />
            )}
          </>
        )}
      </main>

      {/* Global Drawers & Modals */}
      <SuperBurgerDrawer
        isOpen={showBurgerDrawer}
        onClose={() => setShowBurgerDrawer(false)}
        user={user}
        onOpenAuth={() => setShowAuthModal(true)}
        onSignOut={() => {
          setUser({ name: 'Guest Athlete', email: 'Not signed in', role: 'guest' });
          showToast('Signed out of session');
        }}
        lang={lang}
        setLang={setLang}
        unit={unit}
        setUnit={setUnit}
        onQuickAction={handleBurgerQuickAction}
        onForceRefresh={handleForceRefresh}
        onOpenBackup={() => setShowSqlModal(true)}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={(loggedInUser) => {
          setUser(loggedInUser);
          if (loggedInUser.role === 'boss' || loggedInUser.role === 'pt') setAppMode('pt_portal');
          showToast(`Welcome, ${loggedInUser.name}!`);
        }}
      />

      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <span className="text-xs font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                ACTIVE GYM ACCESS PASS
              </span>
              <button onClick={() => setShowQrModal(false)} className="p-2 rounded-full bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 bg-slate-900 rounded-3xl text-white flex flex-col items-center space-y-3">
              <QrCode className="w-40 h-40 text-white" />
              <div className="font-extrabold text-lg">{user?.name}</div>
              <div className="text-xs font-mono text-orange-400">ID: IRON-8829-KL</div>
            </div>
          </div>
        </div>
      )}

      {showSqlModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-slate-900">Backup & Cloud Status</h3>
              <button onClick={() => setShowSqlModal(false)} className="p-2 rounded-full bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={() => {
                const blob = new Blob([JSON.stringify({ workoutHistory, foodLogsByDate, targets, bodyweightLogs }, null, 2)], { type: 'application/json' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = `ironlog-backup-${selectedDate}.json`;
                a.click();
                showToast('Exported JSON backup!');
              }}
              className="w-full py-3 rounded-2xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> Export Backup JSON
            </button>
          </div>
        </div>
      )}

      {/* Fixed Bottom Navigation */}
      {appMode === 'personal' && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 pb-safe shadow-lg">
          <div className="max-w-4xl mx-auto grid grid-cols-4 px-2 py-2">
            {[
              { id: 'workout', label: t.workout, icon: Dumbbell, badge: `${workoutStats.doneSets}/${workoutStats.totalSets}` },
              { id: 'nutrition', label: t.nutrition, icon: Flame, badge: `${macroTotals.cal}` },
              { id: 'coach', label: t.coach, icon: Brain, badge: 'AI' },
              { id: 'progress', label: t.progress, icon: TrendingUp, badge: `${bodyweightLogs[bodyweightLogs.length - 1]?.weight || 74.2}kg` },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center justify-center py-1.5 rounded-2xl transition ${
                    active ? 'text-orange-600' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <Icon className="w-6 h-6" />
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${active ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500'}`}>
                      {tab.badge}
                    </span>
                  </div>
                  <span className="text-xs mt-1 font-extrabold">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}