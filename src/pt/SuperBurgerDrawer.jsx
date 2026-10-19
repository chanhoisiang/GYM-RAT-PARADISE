import React from 'react';
import {
  X, User, LogIn, UserPlus, LogOut, Globe, Settings, Users,
  Calendar, QrCode, RefreshCw, Database, ShieldCheck, Dumbbell, Sparkles
} from 'lucide-react';

export default function SuperBurgerDrawer({
  isOpen,
  onClose,
  user,
  onOpenAuth,
  onSignOut,
  lang,
  setLang,
  unit,
  setUnit,
  onQuickAction,
  onForceRefresh,
  onOpenBackup,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-sm h-full p-5 flex flex-col justify-between overflow-y-auto shadow-2xl border-l border-slate-200">
        <div className="space-y-5">
          {/* Top Drawer Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-white flex items-center justify-center font-extrabold">
                <Dumbbell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  IRONLOG SUPERAPP
                </h3>
                <p className="text-[11px] font-bold text-slate-400">
                  Command Center & Settings
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile & Auth Card */}
          <div className="p-4 rounded-3xl bg-gradient-to-br from-slate-900 to-zinc-800 text-white space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-orange-500/20 border border-orange-400/40 flex items-center justify-center font-extrabold text-lg text-orange-300">
                  {user?.name?.[0]?.toUpperCase() || 'G'}
                </div>
                <div>
                  <div className="font-extrabold text-base">{user?.name || 'Guest Athlete'}</div>
                  <div className="text-xs text-slate-300">{user?.email || 'Not signed in'}</div>
                </div>
              </div>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-orange-500 text-white">
                {user?.role || 'GUEST'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" /> Sign In / Switch
              </button>
              <button
                onClick={() => {
                  onSignOut();
                  onClose();
                }}
                className="py-2 px-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          </div>

          {/* Quick Gym & PT SuperApp Shortcuts */}
          <div className="space-y-2">
            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400 px-1">
              PT & Client Quick Actions
            </div>

            <button
              onClick={() => {
                onQuickAction('add_client');
                onClose();
              }}
              className="w-full p-3.5 rounded-2xl bg-orange-50 hover:bg-orange-100/80 border border-orange-200/80 text-orange-950 font-extrabold text-sm flex items-center justify-between transition"
            >
              <span className="flex items-center gap-2.5">
                <UserPlus className="w-5 h-5 text-orange-600" /> Add New PT Client Info
              </span>
              <span className="text-xs bg-orange-200/80 px-2 py-0.5 rounded-lg">+ New</span>
            </button>

            <button
              onClick={() => {
                onQuickAction('view_clients');
                onClose();
              }}
              className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-800 font-bold text-sm flex items-center justify-between transition"
            >
              <span className="flex items-center gap-2.5">
                <Users className="w-5 h-5 text-slate-700" /> View Client Directory & Logs
              </span>
            </button>

            <button
              onClick={() => {
                onQuickAction('view_timetable');
                onClose();
              }}
              className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-800 font-bold text-sm flex items-center justify-between transition"
            >
              <span className="flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-blue-600" /> Master Staff Timetable Chart
              </span>
            </button>

            <button
              onClick={() => {
                onQuickAction('qr_pass');
                onClose();
              }}
              className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-800 font-bold text-sm flex items-center justify-between transition"
            >
              <span className="flex items-center gap-2.5">
                <QrCode className="w-5 h-5 text-emerald-600" /> Digital Gym Check-In QR Pass
              </span>
              <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                ACTIVE
              </span>
            </button>
          </div>

          {/* Language Switcher (EN / 中文 / BM) */}
          <div className="space-y-2">
            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400 px-1 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" /> App Language / 语言 / Bahasa
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'EN', label: 'English' },
                { id: 'ZH', label: '中文' },
                { id: 'BM', label: 'Melayu' },
              ].map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLang(l.id)}
                  className={`py-2.5 rounded-xl font-extrabold text-xs border transition ${
                    lang === l.id
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* App Settings: Weight Units & Cloud Backup */}
          <div className="space-y-2">
            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400 px-1 flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5" /> Preferences & Updates
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-sm font-bold text-slate-700">Barbell & Body Units</span>
              <div className="flex bg-white p-1 rounded-xl border border-slate-200">
                {['KG', 'LBS'].map((u) => (
                  <button
                    key={u}
                    onClick={() => setUnit(u)}
                    className={`px-3 py-1 rounded-lg text-xs font-extrabold ${
                      unit === u ? 'bg-orange-500 text-white' : 'text-slate-500'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenBackup();
              }}
              className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-sm flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Database className="w-4 h-4 text-slate-600" /> Cloud Sync & JSON Backup
              </span>
            </button>
          </div>
        </div>

        {/* Bottom PWA Update Button */}
        <div className="pt-4 border-t border-slate-200">
          <button
            onClick={onForceRefresh}
            className="w-full py-3.5 rounded-2xl bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md active:scale-98 transition"
          >
            <RefreshCw className="w-4 h-4 text-emerald-400" />
            Force Refresh App (Fetch Latest Vercel Build)
          </button>
        </div>
      </div>
    </div>
  );
}