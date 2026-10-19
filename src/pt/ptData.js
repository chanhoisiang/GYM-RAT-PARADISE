export const INITIAL_TRAINERS = [
    { id: 'pt-1', name: 'Coach Marcus', specialty: 'Hypertrophy & Strength', commissionRate: 0.40, color: 'bg-orange-500', badge: 'bg-orange-100 text-orange-800' },
    { id: 'pt-2', name: 'Coach Sarah', specialty: 'Fat Loss & Conditioning', commissionRate: 0.40, color: 'bg-blue-600', badge: 'bg-blue-100 text-blue-800' },
    { id: 'pt-3', name: 'Coach Daniel', specialty: 'Powerlifting & Rehab', commissionRate: 0.45, color: 'bg-emerald-600', badge: 'bg-emerald-100 text-emerald-800' },
  ];
  
  export const INITIAL_CLIENTS = [
    {
      id: 'c-101',
      name: 'jason Lim',
      phone: '012-345 6789',
      assignedPtId: 'pt-1',
      goal: 'Lean Bulk (+4kg Muscle)',
      packageTotal: 20,
      sessionsUsed: 18, // Low session alert! (Only 2 left)
      packagePriceRM: 2800,
      status: 'Active',
      weightKg: 72.5,
      bodyFatPct: 15.2,
      injuries: 'Mild left shoulder impingement (avoid upright rows)',
      workoutHistory: [
        {
          id: 'w-1',
          date: '2026-10-17',
          focus: 'Upper Body Push & Chest',
          ptNotes: 'Great control on Smith Incline. Increase weight by 2.5kg next session.',
          exercises: [
            { name: 'Smith Machine Incline Press', sets: [{ weight: 70, reps: 10, rpe: 8.5 }, { weight: 75, reps: 8, rpe: 9 }] },
            { name: 'Cable Chest Fly', sets: [{ weight: 20, reps: 12, rpe: 8.5 }, { weight: 20, reps: 12, rpe: 9 }] },
            { name: 'Dumbbell Lateral Raise', sets: [{ weight: 12, reps: 15, rpe: 9 }, { weight: 12, reps: 15, rpe: 9.5 }] },
          ],
        },
      ],
    },
    {
      id: 'c-102',
      name: 'Amanda Tan',
      phone: '016-889 1122',
      assignedPtId: 'pt-2',
      goal: 'Fat Loss & Glute Toning',
      packageTotal: 12,
      sessionsUsed: 5,
      packagePriceRM: 1800,
      status: 'Active',
      weightKg: 58.0,
      bodyFatPct: 23.5,
      injuries: 'None',
      workoutHistory: [
        {
          id: 'w-2',
          date: '2026-10-18',
          focus: 'Lower Body Glutes & Hamstrings',
          ptNotes: 'Form on RDL was solid. Kept rest strictly to 75s.',
          exercises: [
            { name: 'Romanian Deadlift (RDL)', sets: [{ weight: 65, reps: 10, rpe: 8 }, { weight: 70, reps: 8, rpe: 8.5 }] },
            { name: 'Hip Thrust (Barbell)', sets: [{ weight: 90, reps: 10, rpe: 8.5 }, { weight: 100, reps: 8, rpe: 9 }] },
          ],
        },
      ],
    },
    {
      id: 'c-103',
      name: 'hafiz Rahman',
      phone: '019-223 4455',
      assignedPtId: 'pt-1',
      goal: '100kg Bench Press & Strength',
      packageTotal: 10,
      sessionsUsed: 9, // Low session alert! (Only 1 left)
      packagePriceRM: 1500,
      status: 'Active',
      weightKg: 81.4,
      bodyFatPct: 18.0,
      injuries: 'Lower back tightness on conventional deadlifts',
      workoutHistory: [],
    },
  ];
  
  export const INITIAL_SCHEDULES = [
    {
      id: 'sch-1',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      ptId: 'pt-1',
      clientId: 'c-101',
      focus: 'Push Day (Chest & Triceps)',
      status: 'Completed', // Scheduled, Completed, Cancelled, No-Show
    },
    {
      id: 'sch-2',
      date: new Date().toISOString().split('T')[0],
      time: '11:00',
      ptId: 'pt-2',
      clientId: 'c-102',
      focus: 'Lower Body Hypertrophy',
      status: 'Scheduled',
    },
    {
      id: 'sch-3',
      date: new Date().toISOString().split('T')[0],
      time: '15:00',
      ptId: 'pt-1',
      clientId: 'c-103',
      focus: 'Heavy Bench & Back Support',
      status: 'Scheduled',
    },
  ];
  
  export const PT_SUPABASE_SQL = `-- Run this in your Supabase SQL Editor to add PT & Gym Boss tables:
  
  CREATE TABLE pt_trainers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    specialty TEXT,
    commission_rate NUMERIC(4,2) DEFAULT 0.40,
    created_at TIMESTAMPTZ DEFAULT now()
  );
  
  CREATE TABLE pt_clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT,
    assigned_pt_id UUID REFERENCES pt_trainers(id),
    goal TEXT,
    package_total INT DEFAULT 10,
    sessions_used INT DEFAULT 0,
    package_price_rm NUMERIC(10,2) DEFAULT 1500,
    weight_kg NUMERIC(5,2),
    body_fat_pct NUMERIC(4,1),
    injuries TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
  );
  
  CREATE TABLE pt_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_date DATE NOT NULL,
    session_time TEXT NOT NULL,
    pt_id UUID REFERENCES pt_trainers(id),
    client_id UUID REFERENCES pt_clients(id) ON DELETE CASCADE,
    focus TEXT,
    status TEXT DEFAULT 'Scheduled',
    created_at TIMESTAMPTZ DEFAULT now()
  );
  
  CREATE TABLE pt_client_workouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES pt_clients(id) ON DELETE CASCADE,
    pt_id UUID REFERENCES pt_trainers(id),
    session_date DATE NOT NULL DEFAULT CURRENT_DATE,
    focus TEXT,
    pt_notes TEXT,
    exercises_json JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
  );`;