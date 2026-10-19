import React, { useState } from 'react';
import {
  UserPlus, Search, Phone, AlertTriangle, Plus, CheckCircle2,
  Dumbbell, Calendar, FileText, RefreshCw, ChevronRight, X, Trash2, ShieldAlert
} from 'lucide-react';

export default function ClientManager({
  clients,
  setClients,
  trainers,
  currentRole, // 'boss' or ptId ('pt-1', etc.)
  showToast,
}) {
  const [search, setSearch] = useState('');
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || null);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [showLogWorkoutModal, setShowLogWorkoutModal] = useState(false);

  // New Client Form State
  const [newClient, setNewClient] = useState({
    name: '',
    phone: '',
    assignedPtId: currentRole === 'boss' ? trainers[0]?.id : currentRole,
    goal: '',
    packageTotal: 12,
    packagePriceRM: 1800,
    weightKg: 70,
    bodyFatPct: 18,
    injuries: '',
  });

  // New Client Workout Record State
  const [workoutDraft, setWorkoutDraft] = useState({
    date: new Date().toISOString().split('T')[0],
    focus: 'Full Body / Custom PT Session',
    ptNotes: '',
    deductSession: true,
    exercises: [
      {
        name: 'Barbell Bench Press',
        sets: [
          { weight: 60, reps: 10, rpe: 8 },
          { weight: 65, reps: 8, rpe: 8.5 },
        ],
      },
    ],
  });

  // Filter clients: Boss sees all, individual PT can filter or see their own
  const visibleClients = clients.filter((c) => {
    const matchesRole = currentRole === 'boss' || c.assignedPtId === currentRole;
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.goal.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const activeClient =
    clients.find((c) => c.id === selectedClientId) || visibleClients[0] || null;

  // Create New Client
  const handleCreateClient = (e) => {
    e.preventDefault();
    if (!newClient.name.trim()) return;
    const created = {
      id: `c-${Date.now()}`,
      ...newClient,
      packageTotal: Number(newClient.packageTotal) || 10,
      sessionsUsed: 0,
      packagePriceRM: Number(newClient.packagePriceRM) || 1500,
      weightKg: Number(newClient.weightKg) || 70,
      bodyFatPct: Number(newClient.bodyFatPct) || 18,
      status: 'Active',
      workoutHistory: [],
    };
    setClients((prev) => [created, ...prev]);
    setSelectedClientId(created.id);
    setShowAddClientModal(false);
    setNewClient({
      name: '',
      phone: '',
      assignedPtId: currentRole === 'boss' ? trainers[0]?.id : currentRole,
      goal: '',
      packageTotal: 12,
      packagePriceRM: 1800,
      weightKg: 70,
      bodyFatPct: 18,
      injuries: '',
    });
    showToast(`Added new client: ${created.name}`);
  };

  // Top-up / Renew Client PT Package
  const handleRenewPackage = (clientId, addSessions = 10, addPrice = 1500) => {
    setClients((prev) =>
      prev.map((c) =>
        c.id !== clientId
          ? c
          : {
              ...c,
              packageTotal: c.packageTotal + addSessions,
              packagePriceRM: Number(c.packagePriceRM) + addPrice,
            }
      )
    );
    showToast(`Renewed +${addSessions} PT sessions!`);
  };

  // Save Client Workout Session & Auto-Deduct 1 Credit
  const handleSaveClientWorkout = (e) => {
    e.preventDefault();
    if (!activeClient) return;

    const newSessionRecord = {
      id: `cw-${Date.now()}`,
      date: workoutDraft.date,
      focus: workoutDraft.focus,
      ptNotes: workoutDraft.ptNotes,
      exercises: workoutDraft.exercises,
    };

    setClients((prev) =>
      prev.map((c) => {
        if (c.id !== activeClient.id) return c;
        return {
          ...c,
          sessionsUsed: workoutDraft.deductSession
            ? Math.min(c.packageTotal, c.sessionsUsed + 1)
            : c.sessionsUsed,
          workoutHistory: [newSessionRecord, ...(c.workoutHistory || [])],
        };
      })
    );

    setShowLogWorkoutModal(false);
    showToast(`Saved workout for ${activeClient.name}!`);
  };

  // Helpers to edit exercises inside the PT Workout Modal
  const addExerciseToDraft = () => {
    setWorkoutDraft((prev) => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        { name: 'Lat Pulldown', sets: [{ weight: 50, reps: 10, rpe: 8 }] },
      ],
    }));
  };

  const updateDraftExerciseName = (exIdx, name) => {
    setWorkoutDraft((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex, i) => (i === exIdx ? { ...ex, name } : ex)),
    }));
  };

  const addSetToDraftExercise = (exIdx) => {
    setWorkoutDraft((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex, i) => {
        if (i !== exIdx) return ex;
        const last = ex.sets[ex.sets.length - 1] || { weight: 40, reps: 10, rpe: 8 };
        return { ...ex, sets: [...ex.sets, { ...last }] };
      }),
    }));
  };

  const updateDraftSet = (exIdx, setIdx, field, val) => {
    setWorkoutDraft((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex, i) =>
        i !== exIdx
          ? ex
          : {
              ...ex,
              sets: ex.sets.map((s, si) =>
                si === setIdx ? { ...s, [field]: val } : s
              ),
            }
      ),
    }));
  };

  return (
    <div className="space-y-5">
      {/* Search & Add Client Action Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search client name, phone, or fitness goal..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-200/90 font-medium shadow-2xs focus:border-orange-500 focus:outline-none"
          />
        </div>
        <button
          onClick={() => setShowAddClientModal(true)}
          className="py-3.5 px-5 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 active:scale-95 transition"
        >
          <UserPlus className="w-5 h-5" /> Add New Client
        </button>
      </div>

      {/* Horizontal Client Selector Pills (Mobile-First Ergonomics) */}
      <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1">
        {visibleClients.map((client) => {
          const remaining = client.packageTotal - client.sessionsUsed;
          const isLow = remaining <= 2;
          const isSelected = activeClient?.id === client.id;
          return (
            <button
              key={client.id}
              onClick={() => setSelectedClientId(client.id)}
              className={`p-3.5 rounded-2xl border text-left transition shrink-0 min-w-[200px] active:scale-98 ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white text-slate-800 border-slate-200/90'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-extrabold text-base truncate">{client.name}</span>
                <span
                  className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                    isLow
                      ? 'bg-red-500 text-white'
                      : isSelected
                      ? 'bg-white/15 text-white'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {remaining} left
                </span>
              </div>
              <div
                className={`text-xs font-medium mt-1 truncate ${
                  isSelected ? 'text-slate-300' : 'text-slate-500'
                }`}
              >
                {client.goal}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Client Detail Card & Session Workout History */}
      {activeClient ? (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-2xl font-extrabold text-slate-900">
                    {activeClient.name}
                  </h2>
                  <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-orange-100 text-orange-800">
                    {
                      trainers.find((t) => t.id === activeClient.assignedPtId)?.name ||
                      'Assigned PT'
                    }
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-500 mt-1">
                  {activeClient.phone} · Goal:{' '}
                  <strong className="text-slate-800">{activeClient.goal}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRenewPackage(activeClient.id, 10, 1500)}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 active:scale-95 transition"
                >
                  <RefreshCw className="w-4 h-4 text-emerald-600" /> +10 Sessions
                </button>
                <button
                  onClick={() => setShowLogWorkoutModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition"
                >
                  <Dumbbell className="w-4 h-4" /> Log PT Workout
                </button>
              </div>
            </div>

            {/* Client Metrics & Package Progress */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70">
                <div className="text-xs font-bold text-slate-400 uppercase">
                  PACKAGE BALANCE
                </div>
                <div className="text-xl font-extrabold text-slate-900 mt-0.5">
                  {activeClient.packageTotal - activeClient.sessionsUsed}{' '}
                  <span className="text-xs font-semibold text-slate-500">
                    / {activeClient.packageTotal} left
                  </span>
                </div>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70">
                <div className="text-xs font-bold text-slate-400 uppercase">
                  BODYWEIGHT
                </div>
                <div className="text-xl font-extrabold text-slate-900 mt-0.5">
                  {activeClient.weightKg} <span className="text-xs font-normal">kg</span>
                </div>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70">
                <div className="text-xs font-bold text-slate-400 uppercase">BODY FAT</div>
                <div className="text-xl font-extrabold text-orange-600 mt-0.5">
                  {activeClient.bodyFatPct}%
                </div>
              </div>
            </div>

            {/* Injury / Medical Caution Banner */}
            {activeClient.injuries && activeClient.injuries !== 'None' && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/90 flex items-start gap-2.5 text-amber-900 text-sm font-semibold">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold">Injury / Form Note: </span>
                  {activeClient.injuries}
                </div>
              </div>
            )}
          </div>

          {/* Client Recorded Training History */}
          <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-slate-900">
                Client Training Logbook ({activeClient.workoutHistory?.length || 0} Sessions)
              </h3>
              <button
                onClick={() => setShowLogWorkoutModal(true)}
                className="text-xs font-extrabold text-orange-600 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> New Session Record
              </button>
            </div>

            {!activeClient.workoutHistory || activeClient.workoutHistory.length === 0 ? (
              <div className="text-center py-8 text-slate-400 font-medium text-sm">
                No training sessions recorded for {activeClient.name} yet. Tap "Log PT Workout" to record sets, weights & trainer notes!
              </div>
            ) : (
              <div className="space-y-3">
                {activeClient.workoutHistory.map((session) => (
                  <div
                    key={session.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-base text-slate-900">
                        {session.focus}
                      </span>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700">
                        {session.date}
                      </span>
                    </div>

                    {session.ptNotes && (
                      <p className="text-xs font-semibold text-slate-600 bg-orange-50/80 p-2.5 rounded-xl border border-orange-200/60">
                        <strong className="text-orange-800">Coach Note:</strong> {session.ptNotes}
                      </p>
                    )}

                    <div className="space-y-1.5 pt-1">
                      {session.exercises.map((ex, i) => (
                        <div
                          key={i}
                          className="flex flex-wrap items-center justify-between gap-2 text-sm bg-white p-2.5 rounded-xl border border-slate-200/60"
                        >
                          <span className="font-bold text-slate-800">{ex.name}</span>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {ex.sets.map((s, si) => (
                              <span
                                key={si}
                                className="text-xs font-extrabold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800"
                              >
                                {s.weight}kg × {s.reps}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 text-center text-slate-500">
          No clients match this filter.
        </div>
      )}

      {/* =====================================================================
          MODAL 1: ADD NEW CLIENT
      ===================================================================== */}
      {showAddClientModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <form
            onSubmit={handleCreateClient}
            className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 space-y-3.5 max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-slate-900">Add New PT Client</h3>
              <button
                type="button"
                onClick={() => setShowAddClientModal(false)}
                className="p-2 rounded-full bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-500">Client Full Name *</label>
                <input
                  type="text"
                  required
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  placeholder="e.g. Kelvin Chong"
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">Phone / WhatsApp</label>
                <input
                  type="text"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                  placeholder="012-xxx xxxx"
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-500">Assigned Personal Trainer</label>
                <select
                  value={newClient.assignedPtId}
                  onChange={(e) =>
                    setNewClient({ ...newClient, assignedPtId: e.target.value })
                  }
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-bold"
                >
                  {trainers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.specialty})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">Primary Goal</label>
                <input
                  type="text"
                  value={newClient.goal}
                  onChange={(e) => setNewClient({ ...newClient, goal: e.target.value })}
                  placeholder="e.g. Lose 6kg / Build Chest"
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div>
                <label className="text-xs font-bold text-slate-500">Package Sessions</label>
                <input
                  type="number"
                  value={newClient.packageTotal}
                  onChange={(e) =>
                    setNewClient({ ...newClient, packageTotal: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-extrabold text-center"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">Package RM</label>
                <input
                  type="number"
                  value={newClient.packagePriceRM}
                  onChange={(e) =>
                    setNewClient({ ...newClient, packagePriceRM: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-extrabold text-center"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newClient.weightKg}
                  onChange={(e) =>
                    setNewClient({ ...newClient, weightKg: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-extrabold text-center"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">Body Fat (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newClient.bodyFatPct}
                  onChange={(e) =>
                    setNewClient({ ...newClient, bodyFatPct: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-extrabold text-center"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500">
                Injuries / Medical Notes
              </label>
              <input
                type="text"
                value={newClient.injuries}
                onChange={(e) => setNewClient({ ...newClient, injuries: e.target.value })}
                placeholder="e.g. Right knee meniscus history, avoid deep lunges"
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-extrabold text-base shadow-md"
            >
              Create Client Profile
            </button>
          </form>
        </div>
      )}

      {/* =====================================================================
          MODAL 2: LOG CLIENT WORKOUT SESSION
      ===================================================================== */}
      {showLogWorkoutModal && activeClient && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <form
            onSubmit={handleSaveClientWorkout}
            className="bg-white w-full max-w-xl rounded-t-3xl sm:rounded-3xl p-5 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Log Session: {activeClient.name}
                </h3>
                <p className="text-xs font-semibold text-slate-500">
                  Record exercises, weights & coaching notes for this client
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowLogWorkoutModal(false)}
                className="p-2 rounded-full bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-500">Session Focus</label>
                <input
                  type="text"
                  value={workoutDraft.focus}
                  onChange={(e) =>
                    setWorkoutDraft({ ...workoutDraft, focus: e.target.value })
                  }
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">Date</label>
                <input
                  type="date"
                  value={workoutDraft.date}
                  onChange={(e) =>
                    setWorkoutDraft({ ...workoutDraft, date: e.target.value })
                  }
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-bold"
                />
              </div>
            </div>

            {/* Exercises Builder */}
            <div className="space-y-3">
              {workoutDraft.exercises.map((ex, exIdx) => (
                <div
                  key={exIdx}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5"
                >
                  <input
                    type="text"
                    value={ex.name}
                    onChange={(e) => updateDraftExerciseName(exIdx, e.target.value)}
                    placeholder="Exercise Name"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-extrabold text-sm"
                  />

                  <div className="space-y-2">
                    {ex.sets.map((s, sIdx) => (
                      <div key={sIdx} className="grid grid-cols-12 items-center gap-2">
                        <span className="col-span-2 text-xs font-extrabold text-slate-500">
                          Set #{sIdx + 1}
                        </span>
                        <div className="col-span-5 flex items-center gap-1">
                          <input
                            type="number"
                            step="0.5"
                            value={s.weight}
                            onChange={(e) =>
                              updateDraftSet(exIdx, sIdx, 'weight', e.target.value)
                            }
                            className="w-full py-1.5 text-center font-extrabold bg-white rounded-lg border border-slate-300"
                          />
                          <span className="text-xs font-bold text-slate-500">kg</span>
                        </div>
                        <div className="col-span-5 flex items-center gap-1">
                          <input
                            type="number"
                            value={s.reps}
                            onChange={(e) =>
                              updateDraftSet(exIdx, sIdx, 'reps', e.target.value)
                            }
                            className="w-full py-1.5 text-center font-extrabold bg-white rounded-lg border border-slate-300"
                          />
                          <span className="text-xs font-bold text-slate-500">reps</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => addSetToDraftExercise(exIdx)}
                    className="text-xs font-extrabold text-orange-600 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Set
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addExerciseToDraft}
                className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add Another Exercise
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500">
                PT Coaching Notes / Next Session Target
              </label>
              <textarea
                rows={2}
                value={workoutDraft.ptNotes}
                onChange={(e) =>
                  setWorkoutDraft({ ...workoutDraft, ptNotes: e.target.value })
                }
                placeholder="e.g. Form on squats was much deeper today. Bump weight to 85kg next week."
                className="w-full mt-1 p-3 rounded-xl bg-slate-50 border border-slate-300 font-medium"
              />
            </div>

            <label className="flex items-center gap-2 text-sm font-bold text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={workoutDraft.deductSession}
                onChange={(e) =>
                  setWorkoutDraft({ ...workoutDraft, deductSession: e.target.checked })
                }
                className="w-4 h-4 accent-orange-600"
              />
              Automatically deduct 1 PT session from {activeClient.name}'s package
            </label>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-extrabold text-base shadow-md"
            >
              Save Workout & Update Client Balance
            </button>
          </form>
        </div>
      )}
    </div>
  );
}