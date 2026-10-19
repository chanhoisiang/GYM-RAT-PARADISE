import React, { useState } from 'react';
import {
  Calendar, Clock, Plus, CheckCircle2, Trash2, X, BarChart3, Users
} from 'lucide-react';

const GYM_HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

export default function ScheduleCalendar({
  schedules,
  setSchedules,
  clients,
  setClients,
  trainers,
  currentRole,
  showToast,
}) {
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().split('T')[0]
  );
  const [ptFilter, setPtFilter] = useState('ALL');
  const [showBookModal, setShowBookModal] = useState(false);

  const [newBooking, setNewBooking] = useState({
    time: '15:00',
    ptId: currentRole === 'boss' ? trainers[0]?.id : currentRole,
    clientId: clients[0]?.id || '',
    focus: '1-on-1 Personal Training',
  });

  const effectivePtFilter =
    currentRole === 'boss' ? ptFilter : ptFilter === 'ALL' ? currentRole : ptFilter;

  const daySchedules = schedules
    .filter((s) => s.date === selectedDate)
    .filter((s) => effectivePtFilter === 'ALL' || s.ptId === effectivePtFilter)
    .sort((a, b) => a.time.localeCompare(b.time));

  const handleCreateBooking = (e) => {
    e.preventDefault();
    if (!newBooking.clientId) return;
    const item = {
      id: `sch-${Date.now()}`,
      date: selectedDate,
      time: newBooking.time,
      ptId: newBooking.ptId,
      clientId: newBooking.clientId,
      focus: newBooking.focus,
      status: 'Scheduled',
    };
    setSchedules((prev) => [...prev, item]);
    setShowBookModal(false);
    showToast('Booked PT session on master chart!');
  };

  const handleStatusChange = (sch, nextStatus) => {
    setSchedules((prev) =>
      prev.map((item) => (item.id === sch.id ? { ...item, status: nextStatus } : item))
    );

    if (nextStatus === 'Completed' && sch.status !== 'Completed') {
      setClients((prev) =>
        prev.map((c) =>
          c.id !== sch.clientId
            ? c
            : { ...c, sessionsUsed: Math.min(c.packageTotal, c.sessionsUsed + 1) }
        )
      );
      showToast('Session Completed & 1 credit deducted!');
    } else {
      showToast(`Updated status to ${nextStatus}`);
    }
  };

  // Click any empty cell in the chart to pre-fill booking for that trainer & hour
  const handleQuickSlotClick = (ptId, hourStr) => {
    setNewBooking((prev) => ({ ...prev, ptId, time: hourStr }));
    setShowBookModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Filter & Date Controls */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-600" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="font-extrabold text-sm sm:text-base bg-slate-100 px-3 py-2 rounded-xl border border-slate-200"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setPtFilter('ALL')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition ${
                effectivePtFilter === 'ALL'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              All Staff
            </button>
            {trainers.map((pt) => (
              <button
                key={pt.id}
                onClick={() => setPtFilter(pt.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition ${
                  effectivePtFilter === pt.id
                    ? 'bg-orange-600 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {pt.name}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setShowBookModal(true)}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm active:scale-95 transition"
        >
          <Plus className="w-4 h-4" /> Book PT Slot
        </button>
      </div>

      {/* =====================================================================
          VISUAL STAFF TIME-ARRANGEMENT GANTT CHART (08:00 - 20:00)
      ===================================================================== */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-orange-600" /> Staff Daily Time-Arrangement Chart
            </h3>
            <p className="text-xs font-medium text-slate-500">
              Visual timeline across all trainers. Tap any empty slot to book a client at that hour!
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-orange-500 inline-block" /> Scheduled
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" /> Completed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-slate-100 border border-slate-300 inline-block" /> Free Slot
            </span>
          </div>
        </div>

        {/* Scrollable Timeline Matrix */}
        <div className="overflow-x-auto pb-2">
          <div className="min-w-[820px]">
            {/* Hours Header Row */}
            <div className="grid grid-cols-14 gap-1.5 pb-2 border-b border-slate-200 text-[11px] font-extrabold text-slate-400">
              <div className="col-span-2 pl-2">TRAINER / STAFF</div>
              {GYM_HOURS.slice(0, 12).map((hr) => (
                <div key={hr} className="text-center font-mono">
                  {hr}
                </div>
              ))}
            </div>

            {/* Each Trainer's Timeline Row */}
            <div className="divide-y divide-slate-100">
              {trainers.map((pt) => {
                const ptDayBookings = schedules.filter(
                  (s) => s.date === selectedDate && s.ptId === pt.id
                );

                return (
                  <div
                    key={pt.id}
                    className="grid grid-cols-14 gap-1.5 py-3 items-center"
                  >
                    {/* Trainer Name & Utilization */}
                    <div className="col-span-2 pr-2">
                      <div className="font-extrabold text-sm text-slate-900 truncate">
                        {pt.name}
                      </div>
                      <div className="text-[11px] font-bold text-slate-400">
                        {ptDayBookings.length} sessions today
                      </div>
                    </div>

                    {/* 12 Hourly Blocks */}
                    {GYM_HOURS.slice(0, 12).map((hr) => {
                      const hourPrefix = hr.slice(0, 2);
                      const booking = ptDayBookings.find((b) =>
                        b.time.startsWith(hourPrefix)
                      );
                      const client = booking
                        ? clients.find((c) => c.id === booking.clientId)
                        : null;

                      if (booking) {
                        const isDone = booking.status === 'Completed';
                        return (
                          <div
                            key={hr}
                            onClick={() =>
                              handleStatusChange(
                                booking,
                                isDone ? 'Scheduled' : 'Completed'
                              )
                            }
                            title={`${hr} - ${client?.name} (${booking.focus}) - Click to toggle Completed`}
                            className={`h-14 rounded-xl p-1.5 text-white cursor-pointer transition hover:scale-105 flex flex-col justify-between shadow-2xs ${
                              isDone
                                ? 'bg-emerald-600'
                                : 'bg-gradient-to-br from-orange-500 to-red-600'
                            }`}
                          >
                            <div className="text-[10px] font-extrabold truncate leading-tight">
                              {client?.name || 'Booked'}
                            </div>
                            <div className="text-[9px] font-mono opacity-90 flex items-center justify-between">
                              <span>{booking.time}</span>
                              {isDone && <span>✓</span>}
                            </div>
                          </div>
                        );
                      }

                      return (
                        <button
                          key={hr}
                          type="button"
                          onClick={() => handleQuickSlotClick(pt.id, hr)}
                          className="h-14 rounded-xl bg-slate-50 hover:bg-orange-50 border border-dashed border-slate-200 hover:border-orange-300 flex items-center justify-center text-slate-300 hover:text-orange-500 transition group"
                          title={`Book ${pt.name} at ${hr}`}
                        >
                          <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Agenda Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {daySchedules.map((sch) => {
          const pt = trainers.find((t) => t.id === sch.ptId);
          const client = clients.find((c) => c.id === sch.clientId);
          const remaining = client ? client.packageTotal - client.sessionsUsed : 0;

          return (
            <div
              key={sch.id}
              className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-slate-200/80 flex items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="px-3.5 py-2.5 rounded-2xl bg-slate-900 text-white font-mono font-extrabold text-base text-center shrink-0">
                  {sch.time}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-lg text-slate-900">
                      {client?.name || 'Client'}
                    </span>
                    <span
                      className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                        pt?.badge || 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {pt?.name}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">
                    {sch.focus} · <strong>{remaining} left</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {sch.status !== 'Completed' ? (
                  <button
                    onClick={() => handleStatusChange(sch, 'Completed')}
                    className="px-3 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 active:scale-95 transition"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Complete
                  </button>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs">
                    ✓ Done
                  </span>
                )}
                <button
                  onClick={() =>
                    setSchedules((prev) => prev.filter((s) => s.id !== sch.id))
                  }
                  className="p-2 text-slate-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Book Slot Modal */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <form
            onSubmit={handleCreateBooking}
            className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-slate-900">
                Book PT Session ({selectedDate})
              </h3>
              <button
                type="button"
                onClick={() => setShowBookModal(false)}
                className="p-2 rounded-full bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500">Time Slot</label>
              <input
                type="time"
                value={newBooking.time}
                onChange={(e) => setNewBooking({ ...newBooking, time: e.target.value })}
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-extrabold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500">Personal Trainer</label>
              <select
                value={newBooking.ptId}
                onChange={(e) => setNewBooking({ ...newBooking, ptId: e.target.value })}
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-bold"
              >
                {trainers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500">Select Client</label>
              <select
                value={newBooking.clientId}
                onChange={(e) =>
                  setNewBooking({ ...newBooking, clientId: e.target.value })
                }
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-bold"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.packageTotal - c.sessionsUsed} sessions left)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500">Workout Focus</label>
              <input
                type="text"
                value={newBooking.focus}
                onChange={(e) =>
                  setNewBooking({ ...newBooking, focus: e.target.value })
                }
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-extrabold text-base shadow-md"
            >
              Confirm Booking
            </button>
          </form>
        </div>
      )}
    </div>
  );
}