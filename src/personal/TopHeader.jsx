import React, { useState } from 'react';
import {
  Dumbbell, ChevronLeft, ChevronRight, RefreshCw, User, Menu
} from 'lucide-react';

export default function TopHeader({
  selectedDate,
  setSelectedDate,
  shiftDate,
  isSupabaseConfigured,
  handleForceRefresh,
  isRefreshing,
  user,
  setShowAuthModal,
  setShowBurgerDrawer,
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
                src="/cbumlogo.png"
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
                  铁之意志
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

          {/* Right Controls: Refresh Button + User Profile + Burger Menu */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleForceRefresh}
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-700 border border-slate-200/80 transition active:scale-90"
              title="Refresh App to Latest Version"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin text-orange-600' : ''}`} />
            </button>

            <button
              onClick={() => setShowAuthModal(true)}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs border border-slate-200"
            >
              <User className="w-4 h-4 text-orange-600" />
              <span>{user?.name?.split(' ')[0] || 'Sign In'}</span>
            </button>

            <button
              onClick={() => setShowBurgerDrawer(true)}
              className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white shadow-sm active:scale-95 transition"
              title="Open SuperApp Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}