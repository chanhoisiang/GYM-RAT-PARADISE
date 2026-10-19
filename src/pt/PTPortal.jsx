import React, { useState, useEffect, useMemo } from 'react';
import {
  Users, Calendar, AlertTriangle, Database, Copy, Check, Briefcase, QrCode
} from 'lucide-react';
import {
  INITIAL_TRAINERS,
  INITIAL_CLIENTS,
  INITIAL_SCHEDULES,
  PT_SUPABASE_SQL,
} from './ptData';
import ClientManager from './ClientManager';
import ScheduleCalendar from './ScheduleCalendar';

export default function PTPortal({ showToast, externalCommand }) {
  const [currentRole, setCurrentRole] = useState('boss');
  const [subTab, setSubTab] = useState('clients'); // 'clients' | 'schedule' | 'boss_analytics'
  const [copiedSql, setCopiedSql] = useState(false);

  const [trainers] = useState(INITIAL_TRAINERS);
  const [clients, setClients] = useState(() => {
    const saved = localStorage.getItem('ironlog_pt_clients_v1');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });
  const [schedules, setSchedules] = useState(() => {
    const saved = localStorage.getItem('ironlog_pt_schedules_v1');
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULES;
  });

  // Listen to Burger Menu Quick Commands
  useEffect(() => {
    if (!externalCommand) return;
    if (externalCommand.type === 'view_timetable') setSubTab('schedule');
    if (externalCommand.type === 'view_clients' || externalCommand.type === 'add_client') {
      setSubTab('clients');
    }
  }, [externalCommand]);

  useEffect(() => {
    localStorage.setItem('ironlog_pt_clients_v1', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('ironlog_pt_schedules_v1', JSON.stringify(schedules));
  }, [schedules]);

  const businessStats = useMemo(() => {
    const totalRevenueRM = clients.reduce(
      (sum, c) => sum + (Number(c.packagePriceRM) || 0),
      0
    );
    const lowBalanceClients = clients.filter(
      (c) => c.packageTotal - c.sessionsUsed <= 2
    );
    const completedToday = schedules.filter((s) => s.status === 'Completed').length;
    return {
      totalRevenueRM,
      activeClients: clients.length,
      lowBalanceClients,
      completedToday,
    };
  }, [clients, schedules]);

  return (
    <div className="space-y-6">
      {/* =====================================================================
          ROLE SWITCHER BANNER (WIDESCREEN OPTIMIZED)
      ===================================================================== */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-900 text-white rounded-3xl p-6 shadow-lg space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-orange-500/20 text-orange-400">
              GYM SUPERAPP MANAGEMENT
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-1.5">
              {currentRole === 'boss'
                ? 'Gym Owner / Boss Master Portal'
                : `${trainers.find((t) => t.id === currentRole)?.name}'s PT Console`}
            </h2>
          </div>

          <div className="flex items-center gap-1.5 bg-white/10 p-1.5 rounded-2xl flex-wrap">
            <button
              onClick={() => setCurrentRole('boss')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition ${
                currentRole === 'boss'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              👑 Boss View
            </button>
            {trainers.map((pt) => (
              <button
                key={pt.id}
                onClick={() => setCurrentRole(pt.id)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition ${
                  currentRole === pt.id
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {pt.name.replace('Coach ', '')}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2 border-t border-white/10">
          <div className="bg-white/5 p-4 rounded-2xl">
            <div className="text-xs font-bold text-slate-400 uppercase">ACTIVE CLIENTS</div>
            <div className="text-2xl sm:text-3xl font-extrabold mt-1">
              {businessStats.activeClients}
            </div>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl">
            <div className="text-xs font-bold text-slate-400 uppercase">RENEWAL ALERTS</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-1">
              {businessStats.lowBalanceClients.length}{' '}
              <span className="text-sm font-normal text-slate-300">clients</span>
            </div>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl">
            <div className="text-xs font-bold text-slate-400 uppercase">
              {currentRole === 'boss' ? 'PACKAGE SALES' : 'COMPLETED TODAY'}
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1">
              {currentRole === 'boss'
                ? `RM ${businessStats.totalRevenueRM.toLocaleString()}`
                : `${businessStats.completedToday} sessions`}
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Pills */}
      <div className="grid grid-cols-3 gap-2.5 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-2xs">
        <button
          onClick={() => setSubTab('clients')}
          className={`py-3 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition ${
            subTab === 'clients'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" /> Clients & Workout Logs
        </button>
        <button
          onClick={() => setSubTab('schedule')}
          className={`py-3 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition ${
            subTab === 'schedule'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" /> PT Timetable & Chart
        </button>
        <button
          onClick={() => setSubTab('boss_analytics')}
          className={`py-3 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition ${
            subTab === 'boss_analytics'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Briefcase className="w-4 h-4" /> Boss & Commissions
        </button>
      </div>

      {subTab === 'clients' && (
        <ClientManager
          clients={clients}
          setClients={setClients}
          trainers={trainers}
          currentRole={currentRole}
          showToast={showToast}
        />
      )}

      {subTab === 'schedule' && (
        <ScheduleCalendar
          schedules={schedules}
          setSchedules={setSchedules}
          clients={clients}
          setClients={setClients}
          trainers={trainers}
          currentRole={currentRole}
          showToast={showToast}
        />
      )}

      {subTab === 'boss_analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-3">
            <div className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-lg font-extrabold text-slate-900">
                Urgent Package Renewal Radar (≤ 2 Sessions Left)
              </h3>
            </div>
            <div className="space-y-2.5">
              {businessStats.lowBalanceClients.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between"
                >
                  <div>
                    <div className="font-extrabold text-base text-slate-900">{c.name}</div>
                    <div className="text-xs font-semibold text-slate-600">
                      {c.phone} · Trainer: {trainers.find((t) => t.id === c.assignedPtId)?.name}
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-red-600 text-white font-extrabold text-xs">
                    {c.packageTotal - c.sessionsUsed} left
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-3">
            <h3 className="text-lg font-extrabold text-slate-900">
              PT Staff Commission & Active Load
            </h3>
            <div className="space-y-2.5">
              {trainers.map((pt) => {
                const ptClients = clients.filter((c) => c.assignedPtId === pt.id);
                const salesRM = ptClients.reduce(
                  (sum, c) => sum + (Number(c.packagePriceRM) || 0),
                  0
                );
                const commissionRM = Math.round(salesRM * pt.commissionRate);
                return (
                  <div
                    key={pt.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-extrabold text-base text-slate-900">{pt.name}</div>
                      <div className="text-xs font-semibold text-slate-500">
                        {pt.specialty} · {ptClients.length} Clients
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-extrabold text-emerald-600">
                        RM {commissionRM.toLocaleString()}
                      </div>
                      <div className="text-[11px] font-bold text-slate-400">
                        ({pt.commissionRate * 100}% commission)
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}