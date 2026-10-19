import React, { useState } from 'react';
import { Dumbbell, Mail, Lock, User, ShieldCheck, ArrowRight, Sparkles, X } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [role, setRole] = useState('member'); // 'member' | 'pt' | 'boss'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onLoginSuccess({
      name: fullName || (role === 'boss' ? 'Gym Boss' : role === 'pt' ? 'Coach Marcus' : 'Chan Hoi Siang'),
      email: email || 'user@ironlog.gym',
      role,
    });
    onClose();
  };

  const handleBypass = (selectedRole = 'boss') => {
    onLoginSuccess({
      name: selectedRole === 'boss' ? 'Boss Admin (Bypass)' : selectedRole === 'pt' ? 'Coach Marcus' : 'Lifter Pro',
      email: 'bypass@ironlog.gym',
      role: selectedRole,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white shadow-md shadow-orange-500/25">
            <Dumbbell className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700">
              IRONLOG SUPERAPP ID
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-0.5">
              {mode === 'login' ? 'Welcome Back' : 'Create Gym Account'}
            </h2>
          </div>
        </div>

        {/* Account Role Selector */}
        <div>
          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            Select Portal Access Type
          </label>
          <div className="grid grid-cols-3 gap-2 mt-1.5">
            {[
              { id: 'member', label: '💪 Lifter' },
              { id: 'pt', label: '🏋️‍♂️ Trainer' },
              { id: 'boss', label: '👑 Gym Boss' },
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={`py-2.5 px-2 rounded-2xl font-extrabold text-xs border transition ${
                  role === r.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="text-xs font-bold text-slate-500">Full Name</label>
              <div className="relative mt-1">
                <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Chan Hoi Siang"
                  className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 font-bold focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-500">Email Address</label>
            <div className="relative mt-1">
              <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="athlete@ironlog.gym"
                className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 font-bold focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500">Password</label>
            <div className="relative mt-1">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 font-bold focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-extrabold text-base shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 active:scale-98 transition"
          >
            <span>{mode === 'login' ? 'Sign In to SuperApp' : 'Create Account'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        {/* Toggle Login / Register */}
        <div className="text-center text-xs font-bold text-slate-500">
          {mode === 'login' ? "Don't have an account yet? " : 'Already registered? '}
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-orange-600 font-extrabold underline"
          >
            {mode === 'login' ? 'Register New Account' : 'Sign In'}
          </button>
        </div>

        {/* DEV BYPASS SECTION (1-CLICK SKIP) */}
        <div className="pt-4 border-t border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
            <span>Developer UI Preview Mode</span>
            <span className="text-emerald-600">No Auth Required</span>
          </div>
          <button
            type="button"
            onClick={() => handleBypass(role)}
            className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm active:scale-98 transition"
          >
            <Sparkles className="w-4 h-4 text-orange-400" />
            ⚡ Bypass Login / Skip Auth (Enter Immediately)
          </button>
        </div>
      </div>
    </div>
  );
}