import React, { useState } from 'react';
import {
  Calendar, Clock, Plus, CheckCircle2, XCircle, UserCheck, Filter, Trash2, X
} from 'lucide-react';

export default function ScheduleCalendar({
  schedules,
  setSchedules,
  clients,
  setClients,
  trainers,
  currentRole, // 'boss' or ptId
  showToast,
}) {
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().split('T')[0]
  );
  const [ptFilter, setPtFilter] = useState('ALL');
  const [showBookModal, setShowBookModal] = useState(false);

  const [newBooking, setNewBooking] = useState({
    time: '16:00',
    ptId: currentRole === 'boss' ? trainers[0]?.id : currentRole,
    clientId: clients[0]?.id || '',
    focus: '1-on-1 Personal Training',
  });

  // Boss can filter by any PT or view ALL; Individual PT sees their own schedule (or all if toggled)
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
    showToast('Booked PT session on timetable!');
  };

  // Mark session Completed and auto-deduct 1 session credit from Client
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
      showToast('Session marked Completed & 1 credit deducted!');
    } else {
      showToast(`Updated status to ${nextStatus}`);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Filter & Date Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-slate-200/80 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-600" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="font-extrabold text-base bg-slate-100 px-3 py-2 rounded-xl border border-slate-200"
            />
          </div>

          <button
            onClick={() => setShowBookModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition"
          >
            <Plus className="w-4 h-4" /> Book PT Slot
          </button>
        </div>

        {/* Trainer Filter Pills (Boss sees all PTs clearly) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setPtFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition ${
              effectivePtFilter === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            All Trainers (Master View)
          </button>
          {trainers.map((pt) => (
            <button
              key={pt.id}
              onClick={() => setPtFilter(pt.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition ${
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

      {/* Timetable Slots List */}
      <div className="space-y-3">
        {daySchedules.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center text-slate-400 font-medium">
            No PT sessions scheduled for this date/filter. Tap "Book PT Slot" to add one!
          </div>
        ) : (
          daySchedules.map((sch) => {
            const pt = trainers.find((t) => t.id === sch.ptId);
            const client = clients.find((c) => c.id === sch.clientId);
            const remaining = client ? client.packageTotal - client.sessionsUsed : 0;

            return (
              <div
                key={sch.id}
                className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  {/* Time Badge */}
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
                      <span className="text-xs font-bold text-slate-400">
                        ({remaining} credits left)
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-600 mt-0.5">
                      Focus: {sch.focus}
                    </p>
                  </div>
                </div>

                {/* Status & Check-in Controls */}
                <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <span
                    className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                      sch.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : sch.status === 'No-Show'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {sch.status}
                  </span>

                  {sch.status !== 'Completed' && (
                    <button
                      onClick={() => handleStatusChange(sch, 'Completed')}
                      className="px-3 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 active:scale-95 transition"
                      title="Mark Completed & Deduct 1 Session"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Complete
                    </button>
                  )}

                  {sch.status === 'Scheduled' && (
                    <button
                      onClick={() => handleStatusChange(sch, 'No-Show')}
                      className="px-2.5 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600 font-bold text-xs"
                    >
                      No-Show
                    </button>
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
          })
        )}
      </div>

      {/* Book New PT Slot Modal */}
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
                placeholder="e.g. Lower Body Squat Focus"
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