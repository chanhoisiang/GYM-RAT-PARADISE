import React, { useState } from 'react';
import {
  Dumbbell, ChevronLeft, ChevronRight, Pause, Play,
  RefreshCw, User, Menu, Clock, Volume2, VolumeX
} from 'lucide-react';
import { formatDuration } from './gymConstants';

export default function TopHeader({
  selectedDate,
  setSelectedDate,
  shiftDate,
  isSupabaseConfigured,
  sessionSeconds,
  sessionRunning,
  setSessionRunning,
  handleForceRefresh,
  isRefreshing,
  user,
  setShowAuthModal,
  setShowBurgerDrawer,
  appMode,
  restSeconds,
  setRestSeconds,
  restPreset,
  setRestPreset,
  soundEnabled,
  setSoundEnabled,
}) {
  const [logoError, setLogoError] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-2">
          {/* Brand + Logo + Date */}
          <div className="flex items-center gap-3">
            {!logoError ? (
              <img
                src="/logo.png"
                alt="IRONLOG Logo"
                onError={() => setLogoError(true)}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl object-cover shadow-md border border-slate-200 bg-white shrink-0"
              />
            ) : (
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white shadow-md shrink-0">
                <Dumbbell className="w-6 h-6" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
                  IRONLOG
                </h1>
                <span
                  className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full hidden sm:inline-flex items-center gap-1 ${
                    isSupabaseConfigured
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-orange-100 text-orange-700'
                  }`}
                >
                  {isSupabaseConfigured ? 'CLOUD READY' : 'SUPERAPP'}
                </span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <button
                  onClick={() => shiftDate(-1)}
                  className="p-0.5 rounded-md hover:bg-slate-100 text-slate-500"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="text-xs font-bold text-slate-600 bg-transparent focus:outline-none cursor-pointer"
                />
                <button
                  onClick={() => shiftDate(1)}
                  className="p-0.5 rounded-md hover:bg-slate-100 text-slate-500"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Controls: Timer + Top Refresh Button + User Auth Button + Burger Menu */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-900 text-white px-3 py-2 rounded-2xl shadow-sm">
              <div
                className={`w-2 h-2 rounded-full ${
                  sessionRunning ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span className="font-mono font-bold text-sm sm:text-base tracking-tight">
                {formatDuration(sessionSeconds)}
              </span>
              <button
                onClick={() => setSessionRunning(!sessionRunning)}
                className="p-1 hover:bg-white/10 rounded-lg"
              >
                {sessionRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
            </div>

            {/* TOP PWA REFRESH BUTTON */}
            <button
              onClick={handleForceRefresh}
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-700 border border-slate-200/80 transition active:scale-90"
              title="Refresh App to Latest Version"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin text-orange-600' : ''}`} />
            </button>

            {/* Desktop Quick Login Badge */}
            <button
              onClick={() => setShowAuthModal(true)}
              className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs border border-slate-200"
            >
              <User className="w-4 h-4 text-orange-600" />
              <span>{user?.name?.split(' ')[0] || 'Sign In'}</span>
            </button>

            {/* TOP-RIGHT BURGER MENU BUTTON */}
            <button
              onClick={() => setShowBurgerDrawer(true)}
              className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white shadow-sm active:scale-95 transition"
              title="Open SuperApp Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Interactive Rest Timer Bar */}
        {appMode === 'personal' && (
          <div className="mt-2.5 flex items-center justify-between gap-2 bg-slate-100/90 p-2 rounded-2xl border border-slate-200/70">
            <div className="flex items-center gap-1.5">
              <div
                className={`px-3 py-1.5 rounded-xl font-mono font-extrabold text-sm flex items-center gap-1.5 transition ${
                  restSeconds > 0
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>REST {formatDuration(restSeconds)}</span>
              </div>

              {restSeconds > 0 && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setRestSeconds((s) => Math.max(0, s - 15))}
                    className="px-2 py-1 text-xs font-bold bg-white rounded-lg border border-slate-200"
                  >
                    -15s
                  </button>
                  <button
                    onClick={() => setRestSeconds((s) => s + 30)}
                    className="px-2 py-1 text-xs font-bold bg-white rounded-lg border border-slate-200"
                  >
                    +30s
                  </button>
                  <button
                    onClick={() => setRestSeconds(0)}
                    className="px-2 py-1 text-xs font-bold bg-red-100 text-red-700 rounded-lg"
                  >
                    Skip
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {[60, 90, 120, 180].map((sec) => (
                <button
                  key={sec}
                  onClick={() => {
                    setRestPreset(sec);
                    setRestSeconds(sec);
                  }}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition ${
                    restPreset === sec
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  {sec}s
                </button>
              ))}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-600"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}