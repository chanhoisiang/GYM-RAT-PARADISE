import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Dumbbell,
  Flame,
  Brain,
  TrendingUp,
  Play,
  Pause,
  RotateCcw,
  Check,
  Plus,
  Trash2,
  Database,
  Calendar,
  Clock,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Upload,
  Sparkles,
  Copy,
  Download,
  FileJson,
  AlertTriangle,
  Award,
  Volume2,
  VolumeX,
  Send,
  Calculator,
  Repeat,
  Scale,
  Activity,
  X,
  Edit3,
  CheckCircle2,
  Info,
  Search
} from 'lucide-react';

// ============================================================================
// CONSTANTS & INITIAL REALISTIC GYM DATA
// ============================================================================

const TODAY_STR = new Date().toISOString().split('T')[0];
const YESTERDAY_STR = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const TWO_DAYS_AGO_STR = new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0];
const THREE_DAYS_AGO_STR = new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0];
const FOUR_DAYS_AGO_STR = new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0];
const FIVE_DAYS_AGO_STR = new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0];
const SIX_DAYS_AGO_STR = new Date(Date.now() - 6 * 86400000).toISOString().split('T')[0];

const EXERCISE_CATALOG = [
  // Chest
  { id: 'ex_bb_bench', name: 'Barbell Bench Press', muscle: 'Chest', equipment: 'Barbell', defaultRest: 150 },
  { id: 'ex_incline_db', name: 'Incline Dumbbell Press', muscle: 'Chest', equipment: 'Dumbbell', defaultRest: 120 },
  { id: 'ex_smith_incline', name: 'Smith Machine Incline Press', muscle: 'Chest', equipment: 'Smith Machine', defaultRest: 120 },
  { id: 'ex_cable_fly', name: 'Seated Cable Fly', muscle: 'Chest', equipment: 'Cable', defaultRest: 90 },
  { id: 'ex_pec_deck', name: 'Pec Deck Machine', muscle: 'Chest', equipment: 'Machine', defaultRest: 90 },
  // Back
  { id: 'ex_bb_row', name: 'Barbell Bent-Over Row', muscle: 'Back', equipment: 'Barbell', defaultRest: 120 },
  { id: 'ex_lat_pulldown', name: 'Wide-Grip Lat Pulldown', muscle: 'Back', equipment: 'Cable', defaultRest: 120 },
  { id: 'ex_chest_supp_row', name: 'Chest-Supported T-Bar Row', muscle: 'Back', equipment: 'Machine', defaultRest: 120 },
  { id: 'ex_seated_cable_row', name: 'Neutral Grip Cable Row', muscle: 'Back', equipment: 'Cable', defaultRest: 90 },
  { id: 'ex_weighted_pullup', name: 'Weighted Pull-Up', muscle: 'Back', equipment: 'Bodyweight', defaultRest: 150 },
  // Quads
  { id: 'ex_bb_squat', name: 'Barbell High-Bar Squat', muscle: 'Quads', equipment: 'Barbell', defaultRest: 180 },
  { id: 'ex_hack_squat', name: 'Linear Hack Squat', muscle: 'Quads', equipment: 'Machine', defaultRest: 150 },
  { id: 'ex_leg_press', name: '45° Leg Press', muscle: 'Quads', equipment: 'Machine', defaultRest: 150 },
  { id: 'ex_leg_ext', name: 'Seated Leg Extension', muscle: 'Quads', equipment: 'Machine', defaultRest: 90 },
  { id: 'ex_smith_squat', name: 'Smith Machine Squat', muscle: 'Quads', equipment: 'Smith Machine', defaultRest: 150 },
  // Hamstrings
  { id: 'ex_bb_rdl', name: 'Barbell Romanian Deadlift (RDL)', muscle: 'Hamstrings', equipment: 'Barbell', defaultRest: 150 },
  { id: 'ex_seated_leg_curl', name: 'Seated Leg Curl', muscle: 'Hamstrings', equipment: 'Machine', defaultRest: 90 },
  { id: 'ex_lying_leg_curl', name: 'Lying Leg Curl', muscle: 'Hamstrings', equipment: 'Machine', defaultRest: 90 },
  // Shoulders
  { id: 'ex_ohp', name: 'Overhead Barbell Press', muscle: 'Shoulders', equipment: 'Barbell', defaultRest: 150 },
  { id: 'ex_db_shoulder', name: 'Seated Dumbbell Shoulder Press', muscle: 'Shoulders', equipment: 'Dumbbell', defaultRest: 120 },
  { id: 'ex_cable_lat_raise', name: 'Cable Lateral Raise', muscle: 'Shoulders', equipment: 'Cable', defaultRest: 60 },
  { id: 'ex_db_lat_raise', name: 'Dumbbell Lateral Raise', muscle: 'Shoulders', equipment: 'Dumbbell', defaultRest: 60 },
  { id: 'ex_rev_pec_deck', name: 'Rear Delt Pec Deck', muscle: 'Shoulders', equipment: 'Machine', defaultRest: 60 },
  // Arms
  { id: 'ex_tricep_pushdown', name: 'Rope Tricep Pushdown', muscle: 'Arms', equipment: 'Cable', defaultRest: 60 },
  { id: 'ex_overhead_tricep', name: 'Overhead Cable Tricep Extension', muscle: 'Arms', equipment: 'Cable', defaultRest: 90 },
  { id: 'ex_incline_db_curl', name: 'Incline Dumbbell Curl', muscle: 'Arms', equipment: 'Dumbbell', defaultRest: 90 },
  { id: 'ex_ez_bar_curl', name: 'EZ-Bar Preacher Curl', muscle: 'Arms', equipment: 'Barbell', defaultRest: 90 },
  { id: 'ex_hammer_curl', name: 'Rope Hammer Curl', muscle: 'Arms', equipment: 'Cable', defaultRest: 60 }
];

const WORKOUT_TEMPLATES = {
  push: {
    name: 'Push Day (Chest / Shoulders / Triceps)',
    exercises: [
      {
        id: 'w_ex_1',
        exerciseId: 'ex_bb_bench',
        name: 'Barbell Bench Press',
        muscle: 'Chest',
        equipment: 'Barbell',
        note: 'Pause 1s on chest, retract scapula',
        previousBest: '85kg × 8 @ RPE 8.5',
        sets: [
          { id: 's1', type: 'W', prev: '60×8', kg: 60, reps: 8, rpe: '7', done: true, timestamp: '18:04' },
          { id: 's2', type: '1', prev: '85×8', kg: 87.5, reps: 8, rpe: '8.5', done: true, timestamp: '18:07' },
          { id: 's3', type: '2', prev: '85×8', kg: 87.5, reps: 7, rpe: '9', done: true, timestamp: '18:10' },
          { id: 's4', type: '3', prev: '82.5×8', kg: 85, reps: 8, rpe: '9.5', done: false, timestamp: null }
        ]
      },
      {
        id: 'w_ex_2',
        exerciseId: 'ex_smith_incline',
        name: 'Smith Machine Incline Press',
        muscle: 'Chest',
        equipment: 'Smith Machine',
        note: '30 degree bench angle, controlled eccentric',
        previousBest: '75kg × 10 @ RPE 9',
        sets: [
          { id: 's5', type: '1', prev: '75×10', kg: 77.5, reps: 10, rpe: '8.5', done: true, timestamp: '18:16' },
          { id: 's6', type: '2', prev: '75×9', kg: 77.5, reps: 9, rpe: '9', done: false, timestamp: null },
          { id: 's7', type: '3', prev: '70×10', kg: 72.5, reps: 10, rpe: '9.5', done: false, timestamp: null }
        ]
      },
      {
        id: 'w_ex_3',
        exerciseId: 'ex_cable_lat_raise',
        name: 'Cable Lateral Raise',
        muscle: 'Shoulders',
        equipment: 'Cable',
        note: 'Cuff at wrist, cable set at knee height',
        previousBest: '12.5kg × 15 @ RPE 9',
        sets: [
          { id: 's8', type: '1', prev: '12.5×15', kg: 12.5, reps: 16, rpe: '8.5', done: false, timestamp: null },
          { id: 's9', type: '2', prev: '12.5×14', kg: 12.5, reps: 15, rpe: '9', done: false, timestamp: null },
          { id: 's10', type: 'D', prev: '12.5×12', kg: 10, reps: 15, rpe: '10', done: false, timestamp: null }
        ]
      },
      {
        id: 'w_ex_4',
        exerciseId: 'ex_overhead_tricep',
        name: 'Overhead Cable Tricep Extension',
        muscle: 'Arms',
        equipment: 'Cable',
        note: 'Full stretch at bottom',
        previousBest: '27.5kg × 12 @ RPE 9',
        sets: [
          { id: 's11', type: '1', prev: '27.5×12', kg: 30, reps: 12, rpe: '8.5', done: false, timestamp: null },
          { id: 's12', type: '2', prev: '27.5×11', kg: 30, reps: 11, rpe: '9.5', done: false, timestamp: null },
          { id: 's13', type: 'F', prev: '25×12', kg: 27.5, reps: 12, rpe: '10', done: false, timestamp: null }
        ]
      }
    ]
  },
  pull: {
    name: 'Pull Day (Back / Rear Delts / Biceps)',
    exercises: [
      {
        id: 'p_ex_1',
        exerciseId: 'ex_lat_pulldown',
        name: 'Wide-Grip Lat Pulldown',
        muscle: 'Back',
        equipment: 'Cable',
        note: 'Drive elbows down to hips',
        previousBest: '75kg × 10 @ RPE 8.5',
        sets: [
          { id: 'ps1', type: 'W', prev: '50×10', kg: 55, reps: 10, rpe: '7', done: false, timestamp: null },
          { id: 'ps2', type: '1', prev: '75×10', kg: 77.5, reps: 10, rpe: '8.5', done: false, timestamp: null },
          { id: 'ps3', type: '2', prev: '75×9', kg: 77.5, reps: 9, rpe: '9', done: false, timestamp: null },
          { id: 'ps4', type: '3', prev: '72.5×10', kg: 75, reps: 10, rpe: '9.5', done: false, timestamp: null }
        ]
      },
      {
        id: 'p_ex_2',
        exerciseId: 'ex_chest_supp_row',
        name: 'Chest-Supported T-Bar Row',
        muscle: 'Back',
        equipment: 'Machine',
        note: 'Upper back flare, squeeze 1s',
        previousBest: '65kg × 9 @ RPE 9',
        sets: [
          { id: 'ps5', type: '1', prev: '65×9', kg: 67.5, reps: 9, rpe: '8.5', done: false, timestamp: null },
          { id: 'ps6', type: '2', prev: '65×8', kg: 67.5, reps: 8, rpe: '9', done: false, timestamp: null },
          { id: 'ps7', type: '3', prev: '60×10', kg: 62.5, reps: 10, rpe: '9.5', done: false, timestamp: null }
        ]
      },
      {
        id: 'p_ex_3',
        exerciseId: 'ex_rev_pec_deck',
        name: 'Rear Delt Pec Deck',
        muscle: 'Shoulders',
        equipment: 'Machine',
        note: 'Reach out wide, do not shrug traps',
        previousBest: '45kg × 15 @ RPE 9',
        sets: [
          { id: 'ps8', type: '1', prev: '45×15', kg: 47.5, reps: 15, rpe: '8.5', done: false, timestamp: null },
          { id: 'ps9', type: '2', prev: '45×14', kg: 47.5, reps: 14, rpe: '9.5', done: false, timestamp: null }
        ]
      },
      {
        id: 'p_ex_4',
        exerciseId: 'ex_incline_db_curl',
        name: 'Incline Dumbbell Curl',
        muscle: 'Arms',
        equipment: 'Dumbbell',
        note: 'Keep elbows pinned behind torso',
        previousBest: '16kg × 10 @ RPE 9',
        sets: [
          { id: 'ps10', type: '1', prev: '16×10', kg: 16, reps: 11, rpe: '8.5', done: false, timestamp: null },
          { id: 'ps11', type: '2', prev: '16×9', kg: 16, reps: 10, rpe: '9.5', done: false, timestamp: null },
          { id: 'ps12', type: 'F', prev: '14×12', kg: 14, reps: 12, rpe: '10', done: false, timestamp: null }
        ]
      }
    ]
  },
  legs: {
    name: 'Leg Day (Quads / Hamstrings / Calves)',
    exercises: [
      {
        id: 'l_ex_1',
        exerciseId: 'ex_bb_squat',
        name: 'Barbell High-Bar Squat',
        muscle: 'Quads',
        equipment: 'Barbell',
        note: 'Knee sleeves + belt on working sets',
        previousBest: '120kg × 6 @ RPE 8.5',
        sets: [
          { id: 'ls1', type: 'W', prev: '80×6', kg: 85, reps: 6, rpe: '7', done: false, timestamp: null },
          { id: 'ls2', type: '1', prev: '120×6', kg: 122.5, reps: 6, rpe: '8.5', done: false, timestamp: null },
          { id: 'ls3', type: '2', prev: '120×6', kg: 122.5, reps: 6, rpe: '9', done: false, timestamp: null },
          { id: 'ls4', type: '3', prev: '115×7', kg: 117.5, reps: 7, rpe: '9', done: false, timestamp: null }
        ]
      },
      {
        id: 'l_ex_2',
        exerciseId: 'ex_bb_rdl',
        name: 'Barbell Romanian Deadlift (RDL)',
        muscle: 'Hamstrings',
        equipment: 'Barbell',
        note: 'Push hips back until hamstring lock, straps on',
        previousBest: '130kg × 8 @ RPE 8.5',
        sets: [
          { id: 'ls5', type: '1', prev: '130×8', kg: 132.5, reps: 8, rpe: '8.5', done: false, timestamp: null },
          { id: 'ls6', type: '2', prev: '130×8', kg: 132.5, reps: 8, rpe: '9', done: false, timestamp: null },
          { id: 'ls7', type: '3', prev: '125×9', kg: 127.5, reps: 9, rpe: '9', done: false, timestamp: null }
        ]
      },
      {
        id: 'l_ex_3',
        exerciseId: 'ex_leg_ext',
        name: 'Seated Leg Extension',
        muscle: 'Quads',
        equipment: 'Machine',
        note: '1s pause at top contraction',
        previousBest: '70kg × 12 @ RPE 9',
        sets: [
          { id: 'ls8', type: '1', prev: '70×12', kg: 72.5, reps: 12, rpe: '9', done: false, timestamp: null },
          { id: 'ls9', type: '2', prev: '70×11', kg: 72.5, reps: 11, rpe: '9.5', done: false, timestamp: null },
          { id: 'ls10', type: 'F', prev: '65×12', kg: 67.5, reps: 12, rpe: '10', done: false, timestamp: null }
        ]
      },
      {
        id: 'l_ex_4',
        exerciseId: 'ex_seated_leg_curl',
        name: 'Seated Leg Curl',
        muscle: 'Hamstrings',
        equipment: 'Machine',
        note: 'Lean slightly forward over pad for max stretch',
        previousBest: '60kg × 12 @ RPE 9',
        sets: [
          { id: 'ls11', type: '1', prev: '60×12', kg: 62.5, reps: 12, rpe: '8.5', done: false, timestamp: null },
          { id: 'ls12', type: '2', prev: '60×11', kg: 62.5, reps: 11, rpe: '9.5', done: false, timestamp: null }
        ]
      }
    ]
  },
  upper: {
    name: 'Upper Hypertrophy (Chest / Back / Delts / Arms)',
    exercises: [
      {
        id: 'u_ex_1',
        exerciseId: 'ex_incline_db',
        name: 'Incline Dumbbell Press',
        muscle: 'Chest',
        equipment: 'Dumbbell',
        note: '30° bench, deep stretch at bottom',
        previousBest: '36kg × 9 @ RPE 8.5',
        sets: [
          { id: 'us1', type: '1', prev: '36×9', kg: 38, reps: 8, rpe: '8.5', done: false, timestamp: null },
          { id: 'us2', type: '2', prev: '36×8', kg: 38, reps: 8, rpe: '9', done: false, timestamp: null },
          { id: 'us3', type: '3', prev: '34×10', kg: 36, reps: 9, rpe: '9.5', done: false, timestamp: null }
        ]
      },
      {
        id: 'u_ex_2',
        exerciseId: 'ex_weighted_pullup',
        name: 'Weighted Pull-Up',
        muscle: 'Back',
        equipment: 'Bodyweight',
        note: '+kg on dip belt (total load 95kg)',
        previousBest: '95kg × 7 @ RPE 8.5',
        sets: [
          { id: 'us4', type: '1', prev: '95×7', kg: 97.5, reps: 7, rpe: '8.5', done: false, timestamp: null },
          { id: 'us5', type: '2', prev: '95×6', kg: 97.5, reps: 6, rpe: '9', done: false, timestamp: null },
          { id: 'us6', type: '3', prev: '90×8', kg: 92.5, reps: 8, rpe: '9.5', done: false, timestamp: null }
        ]
      },
      {
        id: 'u_ex_3',
        exerciseId: 'ex_pec_deck',
        name: 'Pec Deck Machine',
        muscle: 'Chest',
        equipment: 'Machine',
        note: 'Control the stretch',
        previousBest: '65kg × 12 @ RPE 9',
        sets: [
          { id: 'us7', type: '1', prev: '65×12', kg: 67.5, reps: 12, rpe: '9', done: false, timestamp: null },
          { id: 'us8', type: '2', prev: '65×11', kg: 67.5, reps: 11, rpe: '9.5', done: false, timestamp: null }
        ]
      },
      {
        id: 'u_ex_4',
        exerciseId: 'ex_ez_bar_curl',
        name: 'EZ-Bar Preacher Curl',
        muscle: 'Arms',
        equipment: 'Barbell',
        note: 'Strict eccentric',
        previousBest: '37.5kg × 10 @ RPE 9',
        sets: [
          { id: 'us9', type: '1', prev: '37.5×10', kg: 40, reps: 10, rpe: '9', done: false, timestamp: null },
          { id: 'us10', type: '2', prev: '37.5×9', kg: 40, reps: 9, rpe: '9.5', done: false, timestamp: null }
        ]
      }
    ]
  },
  blank: {
    name: 'Custom Blank Session',
    exercises: []
  }
};

const INITIAL_WORKOUT_HISTORY = [
  {
    id: 'hist_1',
    date: YESTERDAY_STR,
    name: 'Pull Day (Back / Rear Delts / Biceps)',
    durationSec: 3420,
    totalVolume: 11460,
    workingSets: 14,
    exercises: [
      {
        name: 'Wide-Grip Lat Pulldown',
        muscle: 'Back',
        equipment: 'Cable',
        sets: [
          { type: 'W', kg: 50, reps: 10, rpe: '7' },
          { type: '1', kg: 75, reps: 10, rpe: '8.5' },
          { type: '2', kg: 75, reps: 9, rpe: '9' },
          { type: '3', kg: 72.5, reps: 10, rpe: '9.5' }
        ]
      },
      {
        name: 'Chest-Supported T-Bar Row',
        muscle: 'Back',
        equipment: 'Machine',
        sets: [
          { type: '1', kg: 65, reps: 9, rpe: '8.5' },
          { type: '2', kg: 65, reps: 8, rpe: '9' },
          { type: '3', kg: 60, reps: 10, rpe: '9.5' }
        ]
      },
      {
        name: 'Neutral Grip Cable Row',
        muscle: 'Back',
        equipment: 'Cable',
        sets: [
          { type: '1', kg: 70, reps: 11, rpe: '8.5' },
          { type: '2', kg: 70, reps: 10, rpe: '9' },
          { type: '3', kg: 65, reps: 12, rpe: '9.5' }
        ]
      },
      {
        name: 'Rear Delt Pec Deck',
        muscle: 'Shoulders',
        equipment: 'Machine',
        sets: [
          { type: '1', kg: 45, reps: 15, rpe: '8.5' },
          { type: '2', kg: 45, reps: 14, rpe: '9' },
          { type: '3', kg: 42.5, reps: 15, rpe: '9.5' }
        ]
      },
      {
        name: 'Incline Dumbbell Curl',
        muscle: 'Arms',
        equipment: 'Dumbbell',
        sets: [
          { type: '1', kg: 16, reps: 10, rpe: '8.5' },
          { type: '2', kg: 16, reps: 9, rpe: '9' },
          { type: 'F', kg: 14, reps: 12, rpe: '10' }
        ]
      }
    ]
  },
  {
    id: 'hist_2',
    date: THREE_DAYS_AGO_STR,
    name: 'Leg Day (Quads / Hamstrings)',
    durationSec: 3910,
    totalVolume: 15280,
    workingSets: 14,
    exercises: [
      {
        name: 'Barbell High-Bar Squat',
        muscle: 'Quads',
        equipment: 'Barbell',
        sets: [
          { type: 'W', kg: 80, reps: 6, rpe: '7' },
          { type: '1', kg: 120, reps: 6, rpe: '8.5' },
          { type: '2', kg: 120, reps: 6, rpe: '9' },
          { type: '3', kg: 115, reps: 7, rpe: '9' },
          { type: '4', kg: 112.5, reps: 7, rpe: '9.5' }
        ]
      },
      {
        name: 'Barbell Romanian Deadlift (RDL)',
        muscle: 'Hamstrings',
        equipment: 'Barbell',
        sets: [
          { type: '1', kg: 130, reps: 8, rpe: '8.5' },
          { type: '2', kg: 130, reps: 8, rpe: '9' },
          { type: '3', kg: 125, reps: 9, rpe: '9' },
          { type: '4', kg: 125, reps: 8, rpe: '9.5' }
        ]
      },
      {
        name: '45° Leg Press',
        muscle: 'Quads',
        equipment: 'Machine',
        sets: [
          { type: '1', kg: 220, reps: 10, rpe: '8.5' },
          { type: '2', kg: 220, reps: 10, rpe: '9' },
          { type: '3', kg: 220, reps: 9, rpe: '9.5' }
        ]
      },
      {
        name: 'Seated Leg Curl',
        muscle: 'Hamstrings',
        equipment: 'Machine',
        sets: [
          { type: '1', kg: 60, reps: 12, rpe: '8.5' },
          { type: '2', kg: 60, reps: 11, rpe: '9' },
          { type: '3', kg: 57.5, reps: 12, rpe: '9.5' }
        ]
      }
    ]
  },
  {
    id: 'hist_3',
    date: FIVE_DAYS_AGO_STR,
    name: 'Push Day (Chest / Shoulders / Triceps)',
    durationSec: 3300,
    totalVolume: 10840,
    workingSets: 14,
    exercises: [
      {
        name: 'Barbell Bench Press',
        muscle: 'Chest',
        equipment: 'Barbell',
        sets: [
          { type: 'W', kg: 60, reps: 8, rpe: '7' },
          { type: '1', kg: 85, reps: 8, rpe: '8.5' },
          { type: '2', kg: 85, reps: 8, rpe: '9' },
          { type: '3', kg: 82.5, reps: 8, rpe: '9.5' }
        ]
      },
      {
        name: 'Smith Machine Incline Press',
        muscle: 'Chest',
        equipment: 'Smith Machine',
        sets: [
          { type: '1', kg: 75, reps: 10, rpe: '8.5' },
          { type: '2', kg: 75, reps: 9, rpe: '9' },
          { type: '3', kg: 70, reps: 10, rpe: '9.5' }
        ]
      },
      {
        name: 'Seated Dumbbell Shoulder Press',
        muscle: 'Shoulders',
        equipment: 'Dumbbell',
        sets: [
          { type: '1', kg: 28, reps: 9, rpe: '8.5' },
          { type: '2', kg: 28, reps: 8, rpe: '9' },
          { type: '3', kg: 26, reps: 10, rpe: '9.5' }
        ]
      },
      {
        name: 'Cable Lateral Raise',
        muscle: 'Shoulders',
        equipment: 'Cable',
        sets: [
          { type: '1', kg: 12.5, reps: 15, rpe: '8.5' },
          { type: '2', kg: 12.5, reps: 14, rpe: '9' }
        ]
      },
      {
        name: 'Overhead Cable Tricep Extension',
        muscle: 'Arms',
        equipment: 'Cable',
        sets: [
          { type: '1', kg: 27.5, reps: 12, rpe: '8.5' },
          { type: '2', kg: 27.5, reps: 11, rpe: '9' },
          { type: 'F', kg: 25, reps: 12, rpe: '10' }
        ]
      }
    ]
  }
];

const GYM_STAPLES = [
  { name: 'Chicken Breast (Cooked)', portion: '150g', calories: 248, protein_g: 46.5, carbs_g: 0, fat_g: 5.4 },
  { name: 'Whole Eggs (Large)', portion: '2 large (100g)', calories: 144, protein_g: 12.6, carbs_g: 0.8, fat_g: 9.6 },
  { name: 'Liquid Egg Whites', portion: '150g', calories: 78, protein_g: 16.5, carbs_g: 1.1, fat_g: 0.3 },
  { name: 'Cooked White Rice', portion: '200g', calories: 260, protein_g: 5.4, carbs_g: 56, fat_g: 0.6 },
  { name: 'Rolled Oats (Dry)', portion: '80g', calories: 303, protein_g: 10.4, carbs_g: 54.4, fat_g: 5.3 },
  { name: 'Whey Isolate Protein', portion: '1 scoop (30g)', calories: 120, protein_g: 25, carbs_g: 1.5, fat_g: 0.5 },
  { name: 'Salmon Fillet (Cooked)', portion: '150g', calories: 312, protein_g: 30, carbs_g: 0, fat_g: 19.5 },
  { name: 'Pork Noodle / Chu Yuk Fun', portion: '1 bowl (450g)', calories: 540, protein_g: 34, carbs_g: 62, fat_g: 16.5 },
  { name: 'Greek Yogurt 0% Plain', portion: '170g', calories: 100, protein_g: 17, carbs_g: 6, fat_g: 0 },
  { name: 'Banana (Medium)', portion: '1x (118g)', calories: 105, protein_g: 1.3, carbs_g: 27, fat_g: 0.4 }
];

const MEAL_SLOTS = ['Breakfast', 'Pre-Workout', 'Post-Workout', 'Lunch', 'Dinner', 'Snack'];

const INITIAL_FOOD_LOGS = [
  {
    id: 'f1',
    date: TODAY_STR,
    time: '08:15',
    mealSlot: 'Breakfast',
    name: 'Rolled Oats + Whey Isolate + 1 Banana',
    portion: '80g oats, 1 scoop whey, 1 banana',
    calories: 528,
    protein_g: 36.7,
    carbs_g: 82.9,
    fat_g: 6.2
  },
  {
    id: 'f2',
    date: TODAY_STR,
    time: '13:10',
    mealSlot: 'Lunch',
    name: 'Grilled Chicken Breast & White Rice Bowl',
    portion: '220g chicken breast, 200g cooked rice, 1 tsp olive oil',
    calories: 663,
    protein_g: 73.6,
    carbs_g: 56.0,
    fat_g: 13.0
  },
  {
    id: 'f3',
    date: TODAY_STR,
    time: '16:45',
    mealSlot: 'Pre-Workout',
    name: 'Pre-Workout Greek Yogurt & Honey',
    portion: '170g 0% Greek yogurt + 15g honey',
    calories: 145,
    protein_g: 17.0,
    carbs_g: 18.5,
    fat_g: 0
  },
  {
    id: 'f4',
    date: YESTERDAY_STR,
    time: '12:30',
    mealSlot: 'Lunch',
    name: 'Pork Noodle / Chu Yuk Fun + Extra Egg',
    portion: '1 bowl (480g)',
    calories: 612,
    protein_g: 40.3,
    carbs_g: 62.4,
    fat_g: 21.3
  }
];

const INITIAL_BODY_METRICS = [
  { id: 'bm1', date: SIX_DAYS_AGO_STR, weight: 78.9, bodyFat: 13.8, waist: 79.5, note: 'Baseline morning weigh-in' },
  { id: 'bm2', date: FIVE_DAYS_AGO_STR, weight: 78.7, bodyFat: 13.8, waist: 79.5, note: 'Post-Push day' },
  { id: 'bm3', date: FOUR_DAYS_AGO_STR, weight: 78.8, bodyFat: 13.7, waist: 79.2, note: 'Rest day, high steps' },
  { id: 'bm4', date: THREE_DAYS_AGO_STR, weight: 78.5, bodyFat: 13.6, waist: 79.0, note: 'Leg day morning' },
  { id: 'bm5', date: TWO_DAYS_AGO_STR, weight: 78.6, bodyFat: 13.6, waist: 79.0, note: 'Slight water retention' },
  { id: 'bm6', date: YESTERDAY_STR, weight: 78.3, bodyFat: 13.5, waist: 78.8, note: 'Pull day morning' },
  { id: 'bm7', date: TODAY_STR, weight: 78.2, bodyFat: 13.4, waist: 78.7, note: 'Looking leaner, strength holding' }
];

const RPE_OPTIONS = [
  { value: '6', label: 'RPE 6.0 (4 RIR)' },
  { value: '6.5', label: 'RPE 6.5 (3.5 RIR)' },
  { value: '7', label: 'RPE 7.0 (3 RIR)' },
  { value: '7.5', label: 'RPE 7.5 (2.5 RIR)' },
  { value: '8', label: 'RPE 8.0 (2 RIR)' },
  { value: '8.5', label: 'RPE 8.5 (1.5 RIR)' },
  { value: '9', label: 'RPE 9.0 (1 RIR)' },
  { value: '9.5', label: 'RPE 9.5 (0.5 RIR)' },
  { value: '10', label: 'RPE 10 (0 RIR)' }
];

const SUPABASE_SCHEMA_SQL = `-- ============================================================================
-- IRONLOG // PRODUCTION SUPABASE POSTGRESQL SCHEMA + RLS POLICIES
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ============================================================================

create extension if not exists "uuid-ossp";

-- 1. USER SETTINGS & MACRO TARGETS
create table public.user_settings (
  user_id uuid references auth.users not null primary key,
  calorie_target integer not null default 2400,
  protein_target integer not null default 185,
  carbs_target integer not null default 250,
  fat_target integer not null default 70,
  default_rest_sec integer not null default 120,
  updated_at timestamptz not null default now()
);

-- 2. WORKOUT SESSIONS
create table public.workouts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  workout_date date not null default current_date,
  name text not null,
  duration_sec integer not null default 0,
  total_volume_kg numeric(10,2) not null default 0,
  working_sets integer not null default 0,
  notes text,
  created_at timestamptz not null default now()
);

-- 3. WORKOUT SETS (High-Density Set Telemetry)
create table public.workout_sets (
  id uuid default uuid_generate_v4() primary key,
  workout_id uuid references public.workouts(id) on delete cascade not null,
  user_id uuid references auth.users not null,
  exercise_name text not null,
  muscle_group text not null,
  equipment text not null,
  set_order integer not null,
  set_type text not null default '1', -- 'W' Warmup, '1..N' Working, 'D' Dropset, 'F' Failure
  weight_kg numeric(6,2) not null,
  reps integer not null,
  rpe numeric(3,1),
  e1rm_kg numeric(6,2) generated always as (round(weight_kg * (1 + reps::numeric / 30.0), 1)) stored,
  completed_at timestamptz default now()
);

-- 4. DAILY NUTRITION & AI FOOD LOGS
create table public.food_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  log_date date not null default current_date,
  log_time text not null,
  food_name text not null,
  portion_desc text,
  calories integer not null,
  protein_g numeric(6,1) not null default 0,
  carbs_g numeric(6,1) not null default 0,
  fat_g numeric(6,1) not null default 0,
  created_at timestamptz not null default now()
);

-- 5. BODYWEIGHT & COMPOSITION METRICS
create table public.body_metrics (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  metric_date date not null default current_date,
  weight_kg numeric(5,2) not null,
  body_fat_pct numeric(4,1),
  waist_cm numeric(5,1),
  note text,
  created_at timestamptz not null default now(),
  unique(user_id, metric_date)
);

-- ENABLE ROW LEVEL SECURITY (RLS)
alter table public.user_settings enable row level security;
alter table public.workouts enable row level security;
alter table public.workout_sets enable row level security;
alter table public.food_logs enable row level security;
alter table public.body_metrics enable row level security;

-- CREATE STRICT OWNER POLICIES
create policy "Users manage own settings" on public.user_settings for all using (auth.uid() = user_id);
create policy "Users manage own workouts" on public.workouts for all using (auth.uid() = user_id);
create policy "Users manage own sets" on public.workout_sets for all using (auth.uid() = user_id);
create policy "Users manage own food logs" on public.food_logs for all using (auth.uid() = user_id);
create policy "Users manage own body metrics" on public.body_metrics for all using (auth.uid() = user_id);
`;

// ============================================================================
// UTILITY FUNCTIONS (e1RM, Formatting, Audio Beep, Gemini API with Backoff)
// ============================================================================

function calcE1RM(weight, reps) {
  const w = parseFloat(weight) || 0;
  const r = parseInt(reps, 10) || 0;
  if (w <= 0 || r <= 0) return 0;
  if (r === 1) return Math.round(w);
  return Math.round(w * (1 + r / 30));
}

function formatDuration(totalSec) {
  const hrs = Math.floor(totalSec / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;
  if (hrs > 0) {
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function playGymTimerBeep() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const beepTimes = [0, 0.22, 0.44];
    beepTimes.forEach((offset, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(idx === 2 ? 1046.5 : 880, ctx.currentTime + offset);
      gain.gain.setValueAtTime(0.18, ctx.currentTime + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + offset + 0.16);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + offset);
      osc.stop(ctx.currentTime + offset + 0.17);
    });
  } catch (e) {
    // Ignore audio context block if no user interaction yet
  }
}

async function callGeminiWithRetry(payload) {
  const apiKey = "";
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
  const delays = [1000, 2000, 4000];
  let lastError = null;

  for (let attempt = 0; attempt <= delays.length; attempt++) {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (err) {
      lastError = err;
      if (attempt < delays.length) {
        await new Promise((res) => setTimeout(res, delays[attempt]));
      }
    }
  }
  throw lastError;
}

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================

export default function App() {
  // Navigation & Global Date
  const [activeTab, setActiveTab] = useState('workout'); // 'workout' | 'nutrition' | 'coach' | 'progress'
  const [selectedDate, setSelectedDate] = useState(TODAY_STR);
  const [statusToast, setStatusToast] = useState(null);
  const [showSupabaseModal, setShowSupabaseModal] = useState(false);

  // Active Workout Stopwatch
  const [workoutSec, setWorkoutSec] = useState(1425); // 23:45 in-progress realistic default
  const [workoutRunning, setWorkoutRunning] = useState(true);

  // Rest Timer Countdown
  const [restRemaining, setRestRemaining] = useState(0);
  const [restActive, setRestActive] = useState(false);
  const [defaultRestDuration, setDefaultRestDuration] = useState(120);
  const [autoStartRest, setAutoStartRest] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Workout State
  const [workoutTitle, setWorkoutTitle] = useState(WORKOUT_TEMPLATES.push.name);
  const [activeExercises, setActiveExercises] = useState(WORKOUT_TEMPLATES.push.exercises);
  const [workoutHistory, setWorkoutHistory] = useState(INITIAL_WORKOUT_HISTORY);
  const [expandedHistoryId, setExpandedHistoryId] = useState('hist_1');

  // Exercise Selector State
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [filterMuscle, setFilterMuscle] = useState('All');
  const [filterEquip, setFilterEquip] = useState('All');
  const [customExName, setCustomExName] = useState('');
  const [customExMuscle, setCustomExMuscle] = useState('Chest');
  const [customExEquip, setCustomExEquip] = useState('Barbell');

  // Nutrition & AI Calories State
  const [macroTargets, setMacroTargets] = useState({
    calories: 2450,
    protein: 185,
    carbs: 265,
    fat: 70
  });
  const [editingTargets, setEditingTargets] = useState(false);
  const [selectedMealSlot, setSelectedMealSlot] = useState('Post-Workout');
  const [foodLogs, setFoodLogs] = useState(INITIAL_FOOD_LOGS);
  const [aiFoodQuery, setAiFoodQuery] = useState('');
  const [aiFoodImage, setAiFoodImage] = useState(null); // { mimeType, base64, previewUrl }
  const [aiFoodLoading, setAiFoodLoading] = useState(false);
  const [aiFoodResult, setAiFoodResult] = useState(null); // { items: [...], summary_note: '' }
  const [aiFoodError, setAiFoodError] = useState(null);
  const [manualFood, setManualFood] = useState({
    name: '',
    portion: '150g',
    calories: '',
    protein_g: '',
    carbs_g: '',
    fat_g: ''
  });

  // AI Coach & Utility State
  const [coachMessages, setCoachMessages] = useState([
    {
      role: 'assistant',
      text: `IRONLOG AI Assistant online. I have live telemetry on your active session (**${WORKOUT_TEMPLATES.push.name}**), your last 7 days of training volume, your morning weight trend (**78.2 kg**, 7-day avg **78.57 kg**), and today's macro intake.\n\nSelect a quick analysis prompt below or ask me anything about progressive overload, RPE autoregulation, Smith Machine vs. Barbell setup cues, or meal timing.`
    }
  ]);
  const [coachInput, setCoachInput] = useState('');
  const [coachLoading, setCoachLoading] = useState(false);
  const [targetPlateWeight, setTargetPlateWeight] = useState(100);
  const [barbellWeight, setBarbellWeight] = useState(20);

  // Progress, Body & TDEE Calculator State
  const [bodyMetrics, setBodyMetrics] = useState(INITIAL_BODY_METRICS);
  const [newWeight, setNewWeight] = useState('78.2');
  const [newBodyFat, setNewBodyFat] = useState('13.4');
  const [newWaist, setNewWaist] = useState('78.7');
  const [newBodyNote, setNewBodyNote] = useState('');
  const [selectedPrExercise, setSelectedPrExercise] = useState('Barbell Bench Press');
  const [tdeeForm, setTdeeForm] = useState({
    sex: 'male',
    age: 27,
    heightCm: 176,
    weightKg: 78.2,
    activityMult: 1.55,
    goalDelta: -300
  });
  const [importJsonText, setImportJsonText] = useState('');

  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);

  // Toast helper
  const notify = (msg) => {
    setStatusToast(msg);
    setTimeout(() => {
      setStatusToast((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // ============================================================================
  // TIMERS (Active Workout Stopwatch + Rest Timer Countdown)
  // ============================================================================

  useEffect(() => {
    if (!workoutRunning) return;
    const interval = setInterval(() => {
      setWorkoutSec((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [workoutRunning]);

  useEffect(() => {
    if (!restActive) return;
    const interval = setInterval(() => {
      setRestRemaining((prev) => {
        if (prev <= 1) {
          setRestActive(false);
          if (soundEnabled) playGymTimerBeep();
          notify('REST COMPLETE — TIME FOR NEXT SET');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [restActive, soundEnabled]);

  const startRestTimer = (seconds = defaultRestDuration) => {
    setRestRemaining(seconds);
    setRestActive(true);
  };

  const adjustRestTimer = (deltaSec) => {
    setRestRemaining((prev) => {
      const next = Math.max(0, prev + deltaSec);
      if (next > 0 && !restActive) setRestActive(true);
      if (next === 0) setRestActive(false);
      return next;
    });
  };

  // ============================================================================
  // COMPUTED METRICS (Workout Volume, Macros, 7-Day Weight, Weekly Sets)
  // ============================================================================

  const activeWorkoutSummary = useMemo(() => {
    let totalVolume = 0;
    let workingSetsDone = 0;
    let totalWorkingSets = 0;
    let rpeSum = 0;
    let rpeCount = 0;

    activeExercises.forEach((ex) => {
      ex.sets.forEach((s) => {
        const isWorking = s.type !== 'W';
        if (isWorking) totalWorkingSets += 1;
        if (s.done && isWorking) {
          workingSetsDone += 1;
          totalVolume += (parseFloat(s.kg) || 0) * (parseInt(s.reps, 10) || 0);
          if (s.rpe) {
            rpeSum += parseFloat(s.rpe);
            rpeCount += 1;
          }
        }
      });
    });

    return {
      totalVolume: Math.round(totalVolume),
      workingSetsDone,
      totalWorkingSets,
      avgRpe: rpeCount > 0 ? (rpeSum / rpeCount).toFixed(1) : '—'
    };
  }, [activeExercises]);

  const selectedDateFoods = useMemo(() => {
    return foodLogs.filter((f) => f.date === selectedDate);
  }, [foodLogs, selectedDate]);

  const dailyMacrosConsumed = useMemo(() => {
    return selectedDateFoods.reduce(
      (acc, item) => ({
        calories: acc.calories + (Number(item.calories) || 0),
        protein: +(acc.protein + (Number(item.protein_g) || 0)).toFixed(1),
        carbs: +(acc.carbs + (Number(item.carbs_g) || 0)).toFixed(1),
        fat: +(acc.fat + (Number(item.fat_g) || 0)).toFixed(1)
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [selectedDateFoods]);

  const weightAnalytics = useMemo(() => {
    const sorted = [...bodyMetrics].sort((a, b) => a.date.localeCompare(b.date));
    const last7 = sorted.slice(-7);
    const avg7 =
      last7.length > 0
        ? (last7.reduce((sum, x) => sum + Number(x.weight), 0) / last7.length).toFixed(2)
        : '—';
    const latest = sorted[sorted.length - 1]?.weight || 0;
    const oldestIn7 = last7[0]?.weight || latest;
    const weeklyDelta = (latest - oldestIn7).toFixed(2);
    return { sorted, last7, avg7, latest, weeklyDelta };
  }, [bodyMetrics]);

  // Calculate Weekly Sets per Muscle Group (Active Done + Last 7 Days History)
  const weeklyMuscleVolume = useMemo(() => {
    const volumes = {
      Chest: 0,
      Back: 0,
      Quads: 0,
      Hamstrings: 0,
      Shoulders: 0,
      Arms: 0
    };

    // Active workout completed working sets
    activeExercises.forEach((ex) => {
      const doneWorking = ex.sets.filter((s) => s.done && s.type !== 'W').length;
      if (volumes[ex.muscle] !== undefined) {
        volumes[ex.muscle] += doneWorking;
      }
    });

    // Historical sessions
    workoutHistory.forEach((session) => {
      session.exercises.forEach((ex) => {
        const workingCount = ex.sets.filter((s) => s.type !== 'W').length;
        if (volumes[ex.muscle] !== undefined) {
          volumes[ex.muscle] += workingCount;
        }
      });
    });

    return volumes;
  }, [activeExercises, workoutHistory]);

  // Calculate Historical PR & Progression per Exercise
  const exerciseHistoryStats = useMemo(() => {
    const map = {};

    const recordSet = (exName, dateStr, kg, reps, rpe, type) => {
      if (type === 'W') return;
      const e1rm = calcE1RM(kg, reps);
      if (!map[exName]) {
        map[exName] = { maxE1RM: 0, bestSet: null, logs: [] };
      }
      map[exName].logs.push({ date: dateStr, kg, reps, rpe, e1rm });
      if (e1rm > map[exName].maxE1RM) {
        map[exName].maxE1RM = e1rm;
        map[exName].bestSet = { date: dateStr, kg, reps, rpe, e1rm };
      }
    };

    workoutHistory.forEach((sess) => {
      sess.exercises.forEach((ex) => {
        ex.sets.forEach((s) => {
          recordSet(ex.name, sess.date, s.kg, s.reps, s.rpe, s.type);
        });
      });
    });

    activeExercises.forEach((ex) => {
      ex.sets.forEach((s) => {
        if (s.done) {
          recordSet(ex.name, selectedDate, s.kg, s.reps, s.rpe, s.type);
        }
      });
    });

    return map;
  }, [workoutHistory, activeExercises, selectedDate]);

  // ============================================================================
  // WORKOUT HANDLERS
  // ============================================================================

  const loadTemplate = (key) => {
    const tpl = WORKOUT_TEMPLATES[key];
    if (!tpl) return;
    setWorkoutTitle(tpl.name);
    setActiveExercises(JSON.parse(JSON.stringify(tpl.exercises)));
    setWorkoutSec(0);
    setWorkoutRunning(true);
    notify(`Loaded template: ${tpl.name}`);
  };

  const cycleSetType = (exId, setId) => {
    const order = ['1', 'W', 'D', 'F'];
    setActiveExercises((prev) =>
      prev.map((ex) => {
        if (ex.id !== exId) return ex;
        return {
          ...ex,
          sets: ex.sets.map((s, idx) => {
            if (s.id !== setId) return s;
            const currentNormalNum = String(idx + 1);
            let nextType = 'W';
            if (s.type === 'W') nextType = currentNormalNum;
            else if (s.type === 'D') nextType = 'F';
            else if (s.type === 'F') nextType = 'W';
            else nextType = 'D';
            return { ...s, type: nextType };
          })
        };
      })
    );
  };

  const updateSetField = (exId, setId, field, value) => {
    setActiveExercises((prev) =>
      prev.map((ex) => {
        if (ex.id !== exId) return ex;
        return {
          ...ex,
          sets: ex.sets.map((s) => (s.id === setId ? { ...s, [field]: value } : s))
        };
      })
    );
  };

  const stepSetNumber = (exId, setId, field, step) => {
    setActiveExercises((prev) =>
      prev.map((ex) => {
        if (ex.id !== exId) return ex;
        return {
          ...ex,
          sets: ex.sets.map((s) => {
            if (s.id !== setId) return s;
            const current = parseFloat(s[field]) || 0;
            const updated = Math.max(0, +(current + step).toFixed(2));
            return { ...s, [field]: updated };
          })
        };
      })
    );
  };

  const toggleSetDone = (exId, setId) => {
    let triggeredDone = false;
    setActiveExercises((prev) =>
      prev.map((ex) => {
        if (ex.id !== exId) return ex;
        return {
          ...ex,
          sets: ex.sets.map((s) => {
            if (s.id !== setId) return s;
            const nextDone = !s.done;
            if (nextDone) triggeredDone = true;
            const nowStr = new Date().toTimeString().slice(0, 5);
            return { ...s, done: nextDone, timestamp: nextDone ? nowStr : null };
          })
        };
      })
    );

    if (triggeredDone && autoStartRest) {
      startRestTimer(defaultRestDuration);
    }
  };

  const addSetToExercise = (exId) => {
    setActiveExercises((prev) =>
      prev.map((ex) => {
        if (ex.id !== exId) return ex;
        const lastSet = ex.sets[ex.sets.length - 1] || { kg: 60, reps: 10, rpe: '8.5', prev: '—' };
        const nextNum = String(ex.sets.filter((s) => s.type !== 'W').length + 1);
        const newSet = {
          id: `s_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          type: nextNum,
          prev: lastSet.prev || `${lastSet.kg}×${lastSet.reps}`,
          kg: lastSet.kg,
          reps: lastSet.reps,
          rpe: lastSet.rpe || '8.5',
          done: false,
          timestamp: null
        };
        return { ...ex, sets: [...ex.sets, newSet] };
      })
    );
  };

  const removeSetFromExercise = (exId, setId) => {
    setActiveExercises((prev) =>
      prev.map((ex) => {
        if (ex.id !== exId) return ex;
        return { ...ex, sets: ex.sets.filter((s) => s.id !== setId) };
      })
    );
  };

  const removeExerciseCard = (exId) => {
    setActiveExercises((prev) => prev.filter((ex) => ex.id !== exId));
  };

  const addExerciseToWorkout = (catalogItem) => {
    const newEx = {
      id: `w_ex_${Date.now()}`,
      exerciseId: catalogItem.id,
      name: catalogItem.name,
      muscle: catalogItem.muscle,
      equipment: catalogItem.equipment,
      note: '',
      previousBest: exerciseHistoryStats[catalogItem.name]?.bestSet
        ? `${exerciseHistoryStats[catalogItem.name].bestSet.kg}kg × ${exerciseHistoryStats[catalogItem.name].bestSet.reps} @ RPE ${exerciseHistoryStats[catalogItem.name].bestSet.rpe}`
        : 'First time logging',
      sets: [
        {
          id: `s_${Date.now()}_1`,
          type: '1',
          prev: '—',
          kg: catalogItem.equipment === 'Dumbbell' ? 20 : 60,
          reps: 10,
          rpe: '8',
          done: false,
          timestamp: null
        },
        {
          id: `s_${Date.now()}_2`,
          type: '2',
          prev: '—',
          kg: catalogItem.equipment === 'Dumbbell' ? 20 : 60,
          reps: 10,
          rpe: '8.5',
          done: false,
          timestamp: null
        }
      ]
    };
    setActiveExercises((prev) => [...prev, newEx]);
    setShowAddExercise(false);
    notify(`Added ${catalogItem.name}`);
  };

  const handleAddCustomExercise = (e) => {
    e.preventDefault();
    if (!customExName.trim()) return;
    addExerciseToWorkout({
      id: `custom_${Date.now()}`,
      name: customExName.trim(),
      muscle: customExMuscle,
      equipment: customExEquip
    });
    setCustomExName('');
  };

  const saveAndFinishWorkout = () => {
    const completedExercises = activeExercises
      .map((ex) => ({
        name: ex.name,
        muscle: ex.muscle,
        equipment: ex.equipment,
        sets: ex.sets.filter((s) => s.done).map((s) => ({
          type: s.type,
          kg: Number(s.kg),
          reps: Number(s.reps),
          rpe: s.rpe
        }))
      }))
      .filter((ex) => ex.sets.length > 0);

    if (completedExercises.length === 0) {
      notify('Mark at least 1 set as ✓ DONE before finishing workout.');
      return;
    }

    const newSession = {
      id: `hist_${Date.now()}`,
      date: selectedDate,
      name: workoutTitle || 'Training Session',
      durationSec: workoutSec,
      totalVolume: activeWorkoutSummary.totalVolume,
      workingSets: activeWorkoutSummary.workingSetsDone,
      exercises: completedExercises
    };

    setWorkoutHistory((prev) => [newSession, ...prev]);
    setExpandedHistoryId(newSession.id);
    setWorkoutRunning(false);
    setRestActive(false);
    notify(`Workout archived: ${activeWorkoutSummary.totalVolume.toLocaleString()} kg total volume!`);
  };

  const repeatHistoricalWorkout = (session) => {
    setWorkoutTitle(session.name);
    const clonedExercises = session.exercises.map((ex, idx) => ({
      id: `rep_ex_${Date.now()}_${idx}`,
      name: ex.name,
      muscle: ex.muscle,
      equipment: ex.equipment,
      note: 'Repeated from ' + session.date,
      previousBest: ex.sets[0] ? `${ex.sets[0].kg}kg × ${ex.sets[0].reps}` : '—',
      sets: ex.sets.map((s, sIdx) => ({
        id: `rep_s_${Date.now()}_${idx}_${sIdx}`,
        type: s.type,
        prev: `${s.kg}×${s.reps}`,
        kg: s.kg,
        reps: s.reps,
        rpe: s.rpe || '8.5',
        done: false,
        timestamp: null
      }))
    }));
    setActiveExercises(clonedExercises);
    setWorkoutSec(0);
    setWorkoutRunning(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    notify(`Loaded "${session.name}" into active logger.`);
  };

  // ============================================================================
  // NUTRITION & AI CALORIES HANDLERS (GEMINI STRUCTURED JSON + IMAGE SUPPORT)
  // ============================================================================

  const handleFoodImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      const base64 = dataUrl.split(',')[1];
      setAiFoodImage({
        mimeType: file.type || 'image/jpeg',
        base64,
        previewUrl: dataUrl,
        name: file.name
      });
    };
    reader.readAsDataURL(file);
  };

  const calculateCaloriesWithAI = async () => {
    if (!aiFoodQuery.trim() && !aiFoodImage) {
      notify('Type what you ate or attach a meal photo first.');
      return;
    }

    setAiFoodLoading(true);
    setAiFoodError(null);

    try {
      const parts = [];
      const promptText = `You are a precision sports nutritionist and calorie database for lifters.
Analyze the user's food description ${aiFoodImage ? 'and the attached food photo ' : ''}and break it down into individual food items with accurate weight in grams (portion), realistic calories, protein (g), carbs (g), fat (g), and a brief confidence note.
Use USDA / standard cooked or raw weights as specified. If local Malaysian/Asian hawker dishes (like Pork Noodle / Chu Yuk Fun, Economy Rice, Chicken Rice) or restaurant meals are mentioned, estimate realistic macro breakdowns including cooking oils.
User input: "${aiFoodQuery.trim() || 'Analyze the meal in this photo and estimate portion sizes in grams and macros.'}"`;

      parts.push({ text: promptText });
      if (aiFoodImage) {
        parts.push({
          inlineData: {
            mimeType: aiFoodImage.mimeType,
            data: aiFoodImage.base64
          }
        });
      }

      const payload = {
        contents: [{ role: 'user', parts }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              items: {
                type: 'ARRAY',
                items: {
                  type: 'OBJECT',
                  properties: {
                    name: { type: 'STRING' },
                    portion: { type: 'STRING' },
                    calories: { type: 'INTEGER' },
                    protein_g: { type: 'NUMBER' },
                    carbs_g: { type: 'NUMBER' },
                    fat_g: { type: 'NUMBER' }
                  },
                  propertyOrdering: ['name', 'portion', 'calories', 'protein_g', 'carbs_g', 'fat_g']
                }
              },
              summary_note: { type: 'STRING' }
            },
            propertyOrdering: ['items', 'summary_note']
          }
        }
      };

      const result = await callGeminiWithRetry(payload);
      const rawJson = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawJson) throw new Error('Empty response from AI calculator.');
      const parsed = JSON.parse(rawJson);
      setAiFoodResult(parsed);
    } catch (err) {
      setAiFoodError('Could not calculate macros right now. Please try again or adjust your input.');
    } finally {
      setAiFoodLoading(false);
    }
  };

  const updateAiPreviewItem = (idx, field, value) => {
    if (!aiFoodResult) return;
    setAiFoodResult((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === idx
          ? {
              ...item,
              [field]:
                field === 'name' || field === 'portion'
                  ? value
                  : Number(value) || 0
            }
          : item
      )
    }));
  };

  const logFoodItems = (itemsArray, slotOverride = null) => {
    const nowTime = new Date().toTimeString().slice(0, 5);
    const activeSlot = slotOverride || selectedMealSlot;
    const newEntries = itemsArray.map((item, idx) => ({
      id: `f_${Date.now()}_${idx}_${Math.random().toString(36).slice(2, 5)}`,
      date: selectedDate,
      time: nowTime,
      mealSlot: item.mealSlot || activeSlot,
      name: item.name,
      portion: item.portion,
      calories: Math.round(Number(item.calories) || 0),
      protein_g: +(Number(item.protein_g) || 0).toFixed(1),
      carbs_g: +(Number(item.carbs_g) || 0).toFixed(1),
      fat_g: +(Number(item.fat_g) || 0).toFixed(1)
    }));
    setFoodLogs((prev) => [...newEntries, ...prev]);
    notify(`Logged ${newEntries.length} item(s) to ${activeSlot} (${selectedDate})`);
  };

  const handleManualFoodSubmit = (e) => {
    e.preventDefault();
    if (!manualFood.name.trim() || !manualFood.calories) return;
    logFoodItems([manualFood]);
    setManualFood({ name: '', portion: '150g', calories: '', protein_g: '', carbs_g: '', fat_g: '' });
  };

  // ============================================================================
  // AI COACH HANDLERS (LIVE CONTEXT INJECTION + WARM-UP INJECTOR)
  // ============================================================================

  const sendCoachPrompt = async (promptText) => {
    const query = (promptText ?? coachInput).trim();
    if (!query || coachLoading) return;

    const userMsg = { role: 'user', text: query };
    setCoachMessages((prev) => [...prev, userMsg]);
    if (!promptText) setCoachInput('');
    setCoachLoading(true);

    try {
      // Build live telemetry snapshot
      const liveContext = {
        selectedDate,
        activeWorkout: {
          title: workoutTitle,
          elapsedMinutes: Math.round(workoutSec / 60),
          totalVolumeKg: activeWorkoutSummary.totalVolume,
          workingSetsCompleted: activeWorkoutSummary.workingSetsDone,
          avgRPE: activeWorkoutSummary.avgRpe,
          exercises: activeExercises.map((ex) => ({
            name: ex.name,
            muscle: ex.muscle,
            equipment: ex.equipment,
            previousBest: ex.previousBest,
            sets: ex.sets.map((s) => ({
              type: s.type,
              kg: s.kg,
              reps: s.reps,
              rpe: s.rpe,
              e1rm: calcE1RM(s.kg, s.reps),
              done: s.done
            }))
          }))
        },
        weeklySetsPerMuscle: weeklyMuscleVolume,
        nutritionToday: {
          consumed: dailyMacrosConsumed,
          targets: macroTargets,
          remaining: {
            calories: macroTargets.calories - dailyMacrosConsumed.calories,
            protein_g: +(macroTargets.protein - dailyMacrosConsumed.protein).toFixed(1),
            carbs_g: +(macroTargets.carbs - dailyMacrosConsumed.carbs).toFixed(1),
            fat_g: +(macroTargets.fat - dailyMacrosConsumed.fat).toFixed(1)
          },
          foodsLoggedToday: selectedDateFoods.map((f) => `${f.name} (${f.portion}): ${f.calories}kcal, ${f.protein_g}g P`)
        },
        bodyMetrics: {
          latestWeightKg: weightAnalytics.latest,
          sevenDayMovingAvgKg: weightAnalytics.avg7,
          weeklyChangeKg: weightAnalytics.weeklyDelta
        }
      };

      const systemPrompt = `You are IRONLOG AI, a utilitarian, evidence-based strength & hypertrophy coach and sports nutritionist for serious lifters.
Keep your responses direct, actionable, and grounded in exercise physiology (progressive overload, RPE/RIR autoregulation, Epley e1RM, 10-20 weekly sets MAV landmarks, high-protein macro partitioning).
No fluff or generic motivational filler. Use clear bullet points and exact numbers from the user's live telemetry JSON.

LIVE USER TELEMETRY JSON:
${JSON.stringify(liveContext)}`;

      const payload = {
        contents: [{ role: 'user', parts: [{ text: query }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] }
      };

      const result = await callGeminiWithRetry(payload);
      const reply =
        result?.candidates?.[0]?.content?.parts?.[0]?.text ||
        'Unable to generate coaching response at the moment.';

      setCoachMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      setCoachMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Connection error while contacting Gemini API. Check your network and try again.'
        }
      ]);
    } finally {
      setCoachLoading(false);
    }
  };

  // Barbell Plate & Warm-Up Ramp Calculator
  const plateAndWarmupCalc = useMemo(() => {
    const target = parseFloat(targetPlateWeight) || 0;
    const bar = parseFloat(barbellWeight) || 20;
    const availablePlates = [25, 20, 15, 10, 5, 2.5, 1.25];

    const getPlatesPerSide = (totalWeight) => {
      if (totalWeight <= bar) return [];
      let rem = (totalWeight - bar) / 2;
      const loaded = [];
      availablePlates.forEach((p) => {
        while (rem >= p - 0.001) {
          loaded.push(p);
          rem = +(rem - p).toFixed(2);
        }
      });
      return loaded;
    };

    const roundTo2_5 = (val) => Math.max(bar, Math.round(val / 2.5) * 2.5);

    const warmupRamp = [
      { stage: 'Warm-up Set 1 (40%)', pct: 40, weight: roundTo2_5(target * 0.4), reps: 8, rest: '60s' },
      { stage: 'Warm-up Set 2 (60%)', pct: 60, weight: roundTo2_5(target * 0.6), reps: 5, rest: '90s' },
      { stage: 'Warm-up Set 3 (75%)', pct: 75, weight: roundTo2_5(target * 0.75), reps: 3, rest: '120s' },
      { stage: 'Potentiation Primer (85%)', pct: 85, weight: roundTo2_5(target * 0.85), reps: 1, rest: '150s' }
    ].map((w) => ({
      ...w,
      plates: getPlatesPerSide(w.weight)
    }));

    return {
      workingPlates: getPlatesPerSide(target),
      warmupRamp
    };
  }, [targetPlateWeight, barbellWeight]);

  // Computed TDEE & Macro Recommendation
  const tdeeCalculation = useMemo(() => {
    const w = parseFloat(tdeeForm.weightKg) || 78;
    const h = parseFloat(tdeeForm.heightCm) || 176;
    const a = parseInt(tdeeForm.age, 10) || 27;
    const mult = parseFloat(tdeeForm.activityMult) || 1.55;
    const delta = parseInt(tdeeForm.goalDelta, 10) || 0;

    // Mifflin-St Jeor Equation
    const bmr =
      tdeeForm.sex === 'male'
        ? Math.round(10 * w + 6.25 * h - 5 * a + 5)
        : Math.round(10 * w + 6.25 * h - 5 * a - 161);
    const maintenanceKcal = Math.round(bmr * mult);
    const targetKcal = Math.max(1200, maintenanceKcal + delta);
    const recProtein = Math.round(w * 2.3); // 2.3g/kg for lifters
    const recFat = Math.round(w * 0.85); // 0.85g/kg hormone floor
    const recCarbs = Math.max(50, Math.round((targetKcal - recProtein * 4 - recFat * 9) / 4));

    return { bmr, maintenanceKcal, targetKcal, recProtein, recCarbs, recFat };
  }, [tdeeForm]);

  // ============================================================================
  // PROGRESS & BODY METRICS HANDLERS
  // ============================================================================

  const handleLogBodyMetric = (e) => {
    e.preventDefault();
    const w = parseFloat(newWeight);
    if (!w || w <= 0) return;
    const entry = {
      id: `bm_${Date.now()}`,
      date: selectedDate,
      weight: w,
      bodyFat: parseFloat(newBodyFat) || null,
      waist: parseFloat(newWaist) || null,
      note: newBodyNote.trim() || 'Logged weigh-in'
    };

    setBodyMetrics((prev) => {
      const filtered = prev.filter((item) => item.date !== selectedDate);
      return [...filtered, entry];
    });
    setNewBodyNote('');
    notify(`Saved body metrics for ${selectedDate}: ${w} kg`);
  };

  // ============================================================================
  // EXPORT / IMPORT & CLIPBOARD HELPERS
  // ============================================================================

  const copyTextToClipboard = (text, label = 'Copied to clipboard') => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      notify(label);
    } catch (err) {
      notify('Failed to copy');
    }
    document.body.removeChild(textArea);
  };

  const getFullBackupJson = () => {
    return JSON.stringify(
      {
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        macroTargets,
        activeWorkout: { title: workoutTitle, exercises: activeExercises },
        workoutHistory,
        foodLogs,
        bodyMetrics
      },
      null,
      2
    );
  };

  const handleImportBackupJson = () => {
    try {
      const parsed = JSON.parse(importJsonText);
      if (parsed.macroTargets) setMacroTargets(parsed.macroTargets);
      if (parsed.workoutHistory) setWorkoutHistory(parsed.workoutHistory);
      if (parsed.foodLogs) setFoodLogs(parsed.foodLogs);
      if (parsed.bodyMetrics) setBodyMetrics(parsed.bodyMetrics);
      if (parsed.activeWorkout?.exercises) {
        setWorkoutTitle(parsed.activeWorkout.title || 'Imported Workout');
        setActiveExercises(parsed.activeWorkout.exercises);
      }
      setImportJsonText('');
      setShowSupabaseModal(false);
      notify('Successfully restored full gym backup data!');
    } catch (e) {
      notify('Invalid JSON backup format.');
    }
  };

  const shiftDate = (days) => {
    const current = new Date(selectedDate + 'T00:00:00');
    current.setDate(current.getDate() + days);
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  // ============================================================================
  // RENDER
  // ============================================================================
  // RENDER (UTILITARIAN CRISP WHITE / LIGHT THEME)
  // ============================================================================

  return (
    <div className="min-h-screen bg-[#f4f4f5] text-[#09090b] font-sans selection:bg-emerald-600/20 selection:text-emerald-950 pb-16">
      {/* STATUS TOAST */}
      {statusToast && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-[#ffffff] border-2 border-[#16a34a] text-[#09090b] px-4 py-2.5 rounded-lg shadow-xl font-mono text-xs uppercase tracking-wider">
          <CheckCircle2 className="w-4 h-4 text-[#16a34a] shrink-0" />
          <span className="font-semibold">{statusToast}</span>
        </div>
      )}

      {/* =====================================================================
          TOP UTILITARIAN HEADER BAR
      ===================================================================== */}
      <header className="sticky top-0 z-40 bg-[#ffffff]/95 backdrop-blur border-b border-[#e4e4e7] shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
          {/* App Identity */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#09090b] text-[#ffffff] flex items-center justify-center shadow-2xs">
              <Dumbbell className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold tracking-tight text-sm sm:text-base text-[#09090b]">
                  IRONLOG
                </span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#f4f4f5] text-[#52525b] border border-[#e4e4e7] font-semibold">
                  AI GYM ASSISTANT
                </span>
              </div>
              <p className="text-[11px] text-[#52525b] hidden sm:block font-mono">
                RPE // e1RM // AI MACROS // SUPABASE READY
              </p>
            </div>
          </div>

          {/* Center Timers: Active Workout Stopwatch + Rest Timer Countdown */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Active Workout Stopwatch */}
            <div className="flex items-center gap-1.5 bg-[#f8fafc] border border-[#e4e4e7] rounded-lg px-2.5 py-1.5">
              <Clock className={`w-3.5 h-3.5 ${workoutRunning ? 'text-[#16a34a]' : 'text-[#52525b]'}`} />
              <span className="text-[11px] font-mono text-[#52525b] uppercase hidden md:inline font-semibold">
                SESSION
              </span>
              <span className="font-mono text-sm font-bold text-[#09090b] tabular-nums">
                {formatDuration(workoutSec)}
              </span>
              <button
                onClick={() => setWorkoutRunning(!workoutRunning)}
                className="p-1 rounded hover:bg-[#e4e4e7] text-[#09090b]"
                title={workoutRunning ? 'Pause Session Timer' : 'Resume Session Timer'}
              >
                {workoutRunning ? (
                  <Pause className="w-3.5 h-3.5" />
                ) : (
                  <Play className="w-3.5 h-3.5 text-[#16a34a]" />
                )}
              </button>
              <button
                onClick={() => setWorkoutSec(0)}
                className="p-1 rounded hover:bg-[#e4e4e7] text-[#52525b]"
                title="Reset Session Timer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Live Rest Timer Pill */}
            <div
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 border transition-colors ${
                restActive
                  ? 'bg-amber-50 border-[#d97706] text-[#09090b]'
                  : 'bg-[#f8fafc] border-[#e4e4e7] text-[#09090b]'
              }`}
            >
              <span className="text-[11px] font-mono uppercase text-[#d97706] font-bold">REST</span>
              <span className="font-mono text-sm font-bold tabular-nums min-w-[46px] text-center text-[#09090b]">
                {formatDuration(restRemaining)}
              </span>

              <div className="flex items-center gap-1 border-l border-[#e4e4e7] pl-1.5">
                <button
                  onClick={() => adjustRestTimer(-15)}
                  className="px-1.5 py-0.5 text-[11px] font-mono rounded bg-[#ffffff] hover:bg-[#f4f4f5] border border-[#e4e4e7] text-[#09090b] font-medium"
                >
                  -15s
                </button>
                <button
                  onClick={() => adjustRestTimer(30)}
                  className="px-1.5 py-0.5 text-[11px] font-mono rounded bg-[#ffffff] hover:bg-[#f4f4f5] border border-[#e4e4e7] text-[#09090b] font-medium"
                >
                  +30s
                </button>
                {restActive && (
                  <button
                    onClick={() => {
                      setRestActive(false);
                      setRestRemaining(0);
                    }}
                    className="px-1.5 py-0.5 text-[11px] font-mono rounded bg-red-50 hover:bg-red-100 border border-red-200 text-[#dc2626] font-bold"
                  >
                    SKIP
                  </button>
                )}
              </div>

              {/* Preset Rest Buttons */}
              <div className="hidden lg:flex items-center gap-1 border-l border-[#e4e4e7] pl-1.5">
                {[60, 90, 120, 180].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => {
                      setDefaultRestDuration(sec);
                      startRestTimer(sec);
                    }}
                    className={`px-1.5 py-0.5 text-[11px] font-mono rounded border ${
                      defaultRestDuration === sec
                        ? 'bg-[#d97706] border-[#d97706] text-[#ffffff] font-bold'
                        : 'bg-[#ffffff] hover:bg-[#f4f4f5] border-[#e4e4e7] text-[#52525b]'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  const next = !soundEnabled;
                  setSoundEnabled(next);
                  if (next) playGymTimerBeep();
                }}
                className="p-1 rounded hover:bg-[#e4e4e7] text-[#52525b]"
                title={soundEnabled ? 'Timer Beep Enabled (Click to Mute)' : 'Timer Muted (Click to Enable)'}
              >
                {soundEnabled ? (
                  <Volume2 className="w-3.5 h-3.5 text-[#16a34a]" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 text-[#52525b]" />
                )}
              </button>
            </div>
          </div>

          {/* Right Controls: Date Selector + Supabase Config */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#f8fafc] border border-[#e4e4e7] rounded-lg p-1">
              <button
                onClick={() => shiftDate(-1)}
                className="p-1 hover:bg-[#e4e4e7] rounded text-[#52525b] hover:text-[#09090b]"
                title="Previous Day"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <div className="flex items-center gap-1.5 px-2">
                <Calendar className="w-3.5 h-3.5 text-[#09090b] hidden sm:inline" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent font-mono text-xs font-semibold text-[#09090b] focus:outline-none cursor-pointer"
                />
                {selectedDate !== TODAY_STR ? (
                  <button
                    onClick={() => setSelectedDate(TODAY_STR)}
                    className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#2563eb] text-[#ffffff] font-bold"
                  >
                    GO TODAY
                  </button>
                ) : (
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-emerald-50 text-[#16a34a] border border-emerald-200 font-bold">
                    TODAY
                  </span>
                )}
              </div>
              <button
                onClick={() => shiftDate(1)}
                className="p-1 hover:bg-[#e4e4e7] rounded text-[#52525b] hover:text-[#09090b]"
                title="Next Day"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => setShowSupabaseModal(true)}
              className="flex items-center gap-1.5 bg-[#ffffff] hover:bg-[#f4f4f5] border border-[#e4e4e7] px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold text-[#09090b] transition-colors shadow-2xs"
            >
              <Database className="w-3.5 h-3.5 text-[#16a34a]" />
              <span className="hidden sm:inline">Supabase SQL / Backup</span>
            </button>
          </div>
        </div>

        {/* Mobile Rest Presets Bar */}
        <div className="lg:hidden flex items-center justify-between px-3 py-1.5 bg-[#f8fafc] border-t border-[#e4e4e7] text-xs font-mono">
          <span className="text-[11px] text-[#52525b] font-semibold">REST PRESETS:</span>
          <div className="flex items-center gap-1.5">
            {[60, 90, 120, 180].map((sec) => (
              <button
                key={sec}
                onClick={() => {
                  setDefaultRestDuration(sec);
                  startRestTimer(sec);
                }}
                className={`px-2 py-0.5 rounded text-[11px] border ${
                  defaultRestDuration === sec
                    ? 'bg-[#d97706] border-[#d97706] text-[#ffffff] font-bold'
                    : 'bg-[#ffffff] text-[#52525b] border-[#e4e4e7]'
                }`}
              >
                {sec}s
              </button>
            ))}
          </div>
        </div>

        {/* 4 CORE NAVIGATION TABS */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 flex items-center gap-1 overflow-x-auto border-t border-[#e4e4e7] pt-1 bg-[#ffffff]">
          {[
            {
              id: 'workout',
              label: '1. WORKOUT LOGGER',
              icon: Dumbbell,
              badge: `${activeWorkoutSummary.workingSetsDone}/${activeWorkoutSummary.totalWorkingSets}`
            },
            {
              id: 'nutrition',
              label: '2. NUTRITION & AI CALORIES',
              icon: Flame,
              badge: `${dailyMacrosConsumed.calories} kcal`
            },
            { id: 'coach', label: '3. AI COACH & PLATES', icon: Brain, badge: 'GEMINI' },
            {
              id: 'progress',
              label: '4. PROGRESS & BODY',
              icon: TrendingUp,
              badge: `${weightAnalytics.latest} kg`
            }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 font-mono text-xs font-bold tracking-wide border-b-2 whitespace-nowrap transition-all ${
                  isActive
                    ? 'border-[#09090b] text-[#09090b] bg-[#f4f4f5]/70'
                    : 'border-transparent text-[#52525b] hover:text-[#09090b] hover:bg-[#f8fafc]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#16a34a]' : 'text-[#52525b]'}`} />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono border ${
                    isActive
                      ? 'bg-emerald-50 text-[#16a34a] border-emerald-200 font-bold'
                      : 'bg-[#f4f4f5] text-[#52525b] border-[#e4e4e7]'
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>
      </header>

      {/* =====================================================================
          MAIN WORKSPACE CONTAINER
      ===================================================================== */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 pt-4">
        {/* ===================================================================
            TAB 1: WORKOUT (TRAINING LOGGER & SET TRACKER)
        =================================================================== */}
        {activeTab === 'workout' && (
          <div className="space-y-5">
            {/* Quick Template Loader + Session Summary Bar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
              {/* Quick Routine Loader */}
              <div className="lg:col-span-5 bg-[#ffffff] border border-[#e4e4e7] rounded-lg p-3 flex flex-col justify-between gap-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#52525b] font-bold">
                    QUICK TEMPLATE LOADER
                  </span>
                  <label className="flex items-center gap-1.5 text-[11px] font-mono text-[#52525b] cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={autoStartRest}
                      onChange={(e) => setAutoStartRest(e.target.checked)}
                      className="rounded border-[#e4e4e7] text-[#16a34a] focus:ring-0"
                    />
                    Auto-Rest on ✓
                  </label>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { key: 'push', label: 'Push Day' },
                    { key: 'pull', label: 'Pull Day' },
                    { key: 'legs', label: 'Leg Day' },
                    { key: 'upper', label: 'Upper Hypertrophy' },
                    { key: 'blank', label: 'Blank Session' }
                  ].map((tpl) => (
                    <button
                      key={tpl.key}
                      onClick={() => loadTemplate(tpl.key)}
                      className="px-2.5 py-1.5 rounded bg-[#f8fafc] hover:bg-[#09090b] hover:text-[#ffffff] border border-[#e4e4e7] text-xs font-mono font-semibold text-[#09090b] transition-colors"
                    >
                      {tpl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Session Summary Telemetry */}
              <div className="lg:col-span-7 bg-[#ffffff] border border-[#e4e4e7] rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
                <div className="grid grid-cols-4 gap-3 sm:gap-6 flex-1">
                  <div>
                    <div className="text-[10px] font-mono uppercase text-[#52525b] font-semibold">
                      TOTAL VOLUME
                    </div>
                    <div className="font-mono text-base sm:text-lg font-bold text-[#09090b] tabular-nums">
                      {activeWorkoutSummary.totalVolume.toLocaleString()}{' '}
                      <span className="text-xs font-normal text-[#52525b]">kg</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase text-[#52525b] font-semibold">
                      WORKING SETS
                    </div>
                    <div className="font-mono text-base sm:text-lg font-bold text-[#16a34a] tabular-nums">
                      {activeWorkoutSummary.workingSetsDone}
                      <span className="text-xs text-[#52525b]">/{activeWorkoutSummary.totalWorkingSets}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase text-[#52525b] font-semibold">
                      EXERCISES
                    </div>
                    <div className="font-mono text-base sm:text-lg font-bold text-[#09090b] tabular-nums">
                      {activeExercises.length}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase text-[#52525b] font-semibold">
                      AVG RPE
                    </div>
                    <div className="font-mono text-base sm:text-lg font-bold text-[#d97706] tabular-nums">
                      {activeWorkoutSummary.avgRpe}
                    </div>
                  </div>
                </div>

                <button
                  onClick={saveAndFinishWorkout}
                  className="w-full sm:w-auto bg-[#16a34a] hover:bg-emerald-700 text-[#ffffff] font-mono font-bold text-xs uppercase px-4 py-2.5 rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Save & Finish Workout</span>
                </button>
              </div>
            </div>

            {/* Active Session Title Input */}
            <div className="flex items-center justify-between gap-3 bg-[#ffffff] border border-[#e4e4e7] rounded-lg px-3.5 py-2.5 shadow-2xs">
              <div className="flex items-center gap-2 flex-1">
                <Edit3 className="w-4 h-4 text-[#52525b] shrink-0" />
                <input
                  type="text"
                  value={workoutTitle}
                  onChange={(e) => setWorkoutTitle(e.target.value)}
                  placeholder="Workout Session Title..."
                  className="bg-transparent font-mono font-bold text-sm sm:text-base text-[#09090b] focus:outline-none w-full"
                />
              </div>
              <span className="text-xs font-mono text-[#52525b] hidden sm:inline font-semibold">
                DATE: {selectedDate}
              </span>
            </div>

            {/* Exercise Logger Cards */}
            <div className="space-y-4">
              {activeExercises.length === 0 ? (
                <div className="bg-[#ffffff] border border-dashed border-[#e4e4e7] rounded-lg p-8 text-center space-y-3">
                  <Dumbbell className="w-8 h-8 text-[#52525b] mx-auto" />
                  <p className="font-mono text-sm text-[#52525b]">No exercises in active session.</p>
                  <button
                    onClick={() => setShowAddExercise(true)}
                    className="inline-flex items-center gap-1.5 bg-[#09090b] text-[#ffffff] font-mono font-bold text-xs px-4 py-2 rounded-lg"
                  >
                    <Plus className="w-4 h-4" /> Add First Exercise
                  </button>
                </div>
              ) : (
                activeExercises.map((ex, exIdx) => {
                  const currentBestE1RM = Math.max(
                    0,
                    ...ex.sets.map((s) => calcE1RM(s.kg, s.reps))
                  );
                  const historicalMaxE1RM = exerciseHistoryStats[ex.name]?.maxE1RM || 0;

                  return (
                    <div
                      key={ex.id}
                      className="bg-[#ffffff] border border-[#e4e4e7] rounded-lg overflow-hidden shadow-2xs"
                    >
                      {/* Exercise Header */}
                      <div className="p-3 sm:px-4 bg-[#f8fafc] border-b border-[#e4e4e7] flex flex-wrap items-center justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-bold text-[#52525b]">#{exIdx + 1}</span>
                            <h3 className="font-mono font-bold text-sm sm:text-base text-[#09090b]">
                              {ex.name}
                            </h3>
                            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-50 text-[#16a34a] border border-emerald-200 font-bold">
                              {ex.muscle}
                            </span>
                            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#f4f4f5] text-[#52525b] border border-[#e4e4e7] font-semibold">
                              {ex.equipment}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#52525b]">
                            <span>
                              Previous Best:{' '}
                              <strong className="text-[#09090b]">{ex.previousBest || '—'}</strong>
                            </span>
                            <span>•</span>
                            <span>
                              Session Peak e1RM:{' '}
                              <strong className="text-[#16a34a]">{currentBestE1RM} kg</strong>
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={ex.note || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setActiveExercises((prev) =>
                                prev.map((item) => (item.id === ex.id ? { ...item, note: val } : item))
                              );
                            }}
                            placeholder="Pin / seat note..."
                            className="bg-[#ffffff] border border-[#e4e4e7] rounded px-2.5 py-1 text-xs font-mono text-[#09090b] focus:outline-none focus:border-[#09090b] w-36 sm:w-52"
                          />
                          <button
                            onClick={() => removeExerciseCard(ex.id)}
                            className="p-1.5 rounded hover:bg-red-50 text-[#52525b] hover:text-[#dc2626] transition-colors"
                            title="Remove Exercise"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Set Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-[#e4e4e7] text-[10px] font-mono uppercase text-[#52525b] bg-[#f4f4f5]/60 font-bold">
                              <th className="py-2 px-2.5 w-14">SET</th>
                              <th className="py-2 px-2 w-24">PREVIOUS</th>
                              <th className="py-2 px-2 w-36">LOAD (KG)</th>
                              <th className="py-2 px-2 w-28">REPS</th>
                              <th className="py-2 px-2 w-36">RPE / RIR</th>
                              <th className="py-2 px-2 w-20">e1RM</th>
                              <th className="py-2 px-2.5 text-right w-28">STATUS</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#e4e4e7] font-mono text-xs">
                            {ex.sets.map((s) => {
                              const e1rm = calcE1RM(s.kg, s.reps);
                              const isPR =
                                s.type !== 'W' && e1rm > historicalMaxE1RM && historicalMaxE1RM > 0;
                              const highRpe = parseFloat(s.rpe) >= 9;

                              let badgeStyle = 'bg-[#f4f4f5] text-[#09090b] border-[#e4e4e7]';
                              if (s.type === 'W')
                                badgeStyle = 'bg-amber-50 text-[#d97706] border-amber-300';
                              if (s.type === 'D')
                                badgeStyle = 'bg-blue-50 text-[#2563eb] border-blue-200';
                              if (s.type === 'F')
                                badgeStyle = 'bg-red-50 text-[#dc2626] border-red-200';

                              return (
                                <tr
                                  key={s.id}
                                  className={`transition-colors ${
                                    s.done ? 'bg-emerald-50/70' : 'hover:bg-[#f8fafc]'
                                  }`}
                                >
                                  {/* Set Type Toggle */}
                                  <td className="py-2 px-2.5">
                                    <button
                                      onClick={() => cycleSetType(ex.id, s.id)}
                                      title="Click to cycle Set Type: Working (1..N) / Warmup (W) / Dropset (D) / Failure (F)"
                                      className={`w-8 h-7 rounded font-mono font-bold text-xs border flex items-center justify-center ${badgeStyle}`}
                                    >
                                      {s.type}
                                    </button>
                                  </td>

                                  {/* Previous Set Reference */}
                                  <td className="py-2 px-2">
                                    <button
                                      onClick={() => {
                                        if (s.prev && s.prev.includes('×')) {
                                          const [pKg, pReps] = s.prev.split('×');
                                          updateSetField(ex.id, s.id, 'kg', parseFloat(pKg) || s.kg);
                                          updateSetField(
                                            ex.id,
                                            s.id,
                                            'reps',
                                            parseInt(pReps, 10) || s.reps
                                          );
                                        }
                                      }}
                                      title="Click to copy previous weight & reps"
                                      className="text-[#52525b] hover:text-[#09090b] text-xs tabular-nums font-medium"
                                    >
                                      {s.prev || '—'}
                                    </button>
                                  </td>

                                  {/* Weight (KG) with +/- 2.5 steppers */}
                                  <td className="py-2 px-2">
                                    <div className="flex items-center gap-1">
                                      <button
                                        onClick={() => stepSetNumber(ex.id, s.id, 'kg', -2.5)}
                                        className="w-6 h-7 rounded bg-[#f4f4f5] hover:bg-[#e4e4e7] border border-[#e4e4e7] text-[#09090b] font-bold flex items-center justify-center text-xs"
                                      >
                                        -
                                      </button>
                                      <input
                                        type="number"
                                        step="0.5"
                                        value={s.kg}
                                        onChange={(e) =>
                                          updateSetField(ex.id, s.id, 'kg', e.target.value)
                                        }
                                        className="w-16 h-7 bg-[#ffffff] border border-[#e4e4e7] rounded text-center font-mono font-bold text-[#09090b] text-xs focus:outline-none focus:border-[#09090b] tabular-nums"
                                      />
                                      <button
                                        onClick={() => stepSetNumber(ex.id, s.id, 'kg', 2.5)}
                                        className="w-6 h-7 rounded bg-[#f4f4f5] hover:bg-[#e4e4e7] border border-[#e4e4e7] text-[#09090b] font-bold flex items-center justify-center text-xs"
                                      >
                                        +
                                      </button>
                                    </div>
                                  </td>

                                  {/* Reps with +/- 1 steppers */}
                                  <td className="py-2 px-2">
                                    <div className="flex items-center gap-1">
                                      <button
                                        onClick={() => stepSetNumber(ex.id, s.id, 'reps', -1)}
                                        className="w-6 h-7 rounded bg-[#f4f4f5] hover:bg-[#e4e4e7] border border-[#e4e4e7] text-[#09090b] font-bold flex items-center justify-center text-xs"
                                      >
                                        -
                                      </button>
                                      <input
                                        type="number"
                                        value={s.reps}
                                        onChange={(e) =>
                                          updateSetField(ex.id, s.id, 'reps', e.target.value)
                                        }
                                        className="w-12 h-7 bg-[#ffffff] border border-[#e4e4e7] rounded text-center font-mono font-bold text-[#09090b] text-xs focus:outline-none focus:border-[#09090b] tabular-nums"
                                      />
                                      <button
                                        onClick={() => stepSetNumber(ex.id, s.id, 'reps', 1)}
                                        className="w-6 h-7 rounded bg-[#f4f4f5] hover:bg-[#e4e4e7] border border-[#e4e4e7] text-[#09090b] font-bold flex items-center justify-center text-xs"
                                      >
                                        +
                                      </button>
                                    </div>
                                  </td>

                                  {/* RPE / RIR Selector */}
                                  <td className="py-2 px-2">
                                    <select
                                      value={s.rpe}
                                      onChange={(e) =>
                                        updateSetField(ex.id, s.id, 'rpe', e.target.value)
                                      }
                                      className={`h-7 rounded px-1.5 text-xs font-mono border bg-[#ffffff] focus:outline-none ${
                                        highRpe
                                          ? 'border-amber-400 text-[#d97706] font-bold bg-amber-50/40'
                                          : 'border-[#e4e4e7] text-[#09090b]'
                                      }`}
                                    >
                                      {RPE_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                          {opt.label}
                                        </option>
                                      ))}
                                    </select>
                                  </td>

                                  {/* Auto e1RM */}
                                  <td className="py-2 px-2 tabular-nums">
                                    <div className="flex items-center gap-1">
                                      <span className="text-[#09090b] font-bold">{e1rm}</span>
                                      <span className="text-[10px] text-[#52525b]">kg</span>
                                      {isPR && (
                                        <span className="text-[9px] px-1 rounded bg-[#d97706] text-[#ffffff] font-bold">
                                          PR
                                        </span>
                                      )}
                                    </div>
                                  </td>

                                  {/* Done Button & Remove Set */}
                                  <td className="py-2 px-2.5 text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                      <button
                                        onClick={() => toggleSetDone(ex.id, s.id)}
                                        className={`px-2.5 py-1 rounded font-mono text-xs font-bold flex items-center gap-1 transition-all ${
                                          s.done
                                            ? 'bg-[#16a34a] text-[#ffffff] shadow-2xs'
                                            : 'bg-[#f4f4f5] hover:bg-[#e4e4e7] text-[#09090b] border border-[#e4e4e7]'
                                        }`}
                                      >
                                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                        <span>{s.done ? s.timestamp || 'DONE' : 'DONE'}</span>
                                      </button>
                                      <button
                                        onClick={() => removeSetFromExercise(ex.id, s.id)}
                                        className="p-1 text-[#52525b] hover:text-[#dc2626]"
                                        title="Delete Set"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Card Footer: + Add Set */}
                      <div className="px-3 py-2 bg-[#f8fafc] border-t border-[#e4e4e7] flex items-center justify-between">
                        <button
                          onClick={() => addSetToExercise(ex.id)}
                          className="flex items-center gap-1 text-xs font-mono font-bold text-[#16a34a] hover:text-emerald-700 py-1 px-2 rounded hover:bg-emerald-50"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Set</span>
                        </button>
                        <span className="text-[11px] font-mono text-[#52525b]">
                          Tip: Click SET badge to toggle W (Warmup) / D (Dropset) / F (Failure)
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* + ADD EXERCISE SELECTOR PANEL */}
            <div className="bg-[#ffffff] border border-[#e4e4e7] rounded-lg p-3.5 shadow-2xs">
              {!showAddExercise ? (
                <button
                  onClick={() => setShowAddExercise(true)}
                  className="w-full py-2.5 rounded-lg border border-dashed border-[#e4e4e7] hover:border-[#09090b] text-[#09090b] font-mono text-xs font-bold uppercase flex items-center justify-center gap-2 transition-colors bg-[#f8fafc]"
                >
                  <Plus className="w-4 h-4 text-[#16a34a]" />
                  <span>Add Exercise to Session (Barbell / Dumbbell / Smith / Machine / Cable)</span>
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e4e4e7] pb-2">
                    <span className="font-mono text-xs font-bold uppercase text-[#09090b]">
                      EXERCISE PICKER & CUSTOM CREATOR
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-[#52525b] absolute left-2.5 top-2" />
                        <input
                          type="text"
                          value={exerciseSearch}
                          onChange={(e) => setExerciseSearch(e.target.value)}
                          placeholder="Search exercise name..."
                          className="pl-8 pr-2.5 py-1 rounded bg-[#f8fafc] border border-[#e4e4e7] font-mono text-xs text-[#09090b] focus:outline-none focus:border-[#09090b]"
                        />
                      </div>
                      <button
                        onClick={() => setShowAddExercise(false)}
                        className="text-xs font-mono font-bold text-[#52525b] hover:text-[#09090b]"
                      >
                        [CLOSE]
                      </button>
                    </div>
                  </div>

                  {/* Muscle & Equipment Filters */}
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="text-[11px] font-mono text-[#52525b] font-semibold">MUSCLE:</span>
                    {['All', 'Chest', 'Back', 'Quads', 'Hamstrings', 'Shoulders', 'Arms'].map((m) => (
                      <button
                        key={m}
                        onClick={() => setFilterMuscle(m)}
                        className={`px-2 py-1 rounded text-xs font-mono border ${
                          filterMuscle === m
                            ? 'bg-[#09090b] text-[#ffffff] border-[#09090b] font-bold'
                            : 'bg-[#f8fafc] text-[#52525b] border-[#e4e4e7] hover:text-[#09090b]'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="text-[11px] font-mono text-[#52525b] font-semibold">EQUIPMENT:</span>
                    {['All', 'Barbell', 'Dumbbell', 'Smith Machine', 'Machine', 'Cable', 'Bodyweight'].map(
                      (eq) => (
                        <button
                          key={eq}
                          onClick={() => setFilterEquip(eq)}
                          className={`px-2 py-1 rounded text-xs font-mono border ${
                            filterEquip === eq
                              ? 'bg-[#2563eb] text-[#ffffff] border-[#2563eb] font-bold'
                              : 'bg-[#f8fafc] text-[#52525b] border-[#e4e4e7] hover:text-[#09090b]'
                          }`}
                        >
                          {eq}
                        </button>
                      )
                    )}
                  </div>

                  {/* Catalog Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto pt-1">
                    {EXERCISE_CATALOG.filter(
                      (item) =>
                        (filterMuscle === 'All' || item.muscle === filterMuscle) &&
                        (filterEquip === 'All' || item.equipment === filterEquip) &&
                        item.name.toLowerCase().includes(exerciseSearch.toLowerCase())
                    ).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => addExerciseToWorkout(item)}
                        className="text-left p-2.5 rounded bg-[#f8fafc] hover:bg-emerald-50/60 border border-[#e4e4e7] hover:border-[#16a34a] transition-colors flex items-center justify-between"
                      >
                        <div>
                          <div className="font-mono text-xs font-bold text-[#09090b]">{item.name}</div>
                          <div className="text-[10px] font-mono text-[#52525b]">
                            {item.muscle} • {item.equipment}
                          </div>
                        </div>
                        <Plus className="w-4 h-4 text-[#16a34a] shrink-0" />
                      </button>
                    ))}
                  </div>

                  {/* Custom Exercise Form */}
                  <form
                    onSubmit={handleAddCustomExercise}
                    className="pt-2 border-t border-[#e4e4e7] flex flex-wrap items-center gap-2"
                  >
                    <input
                      type="text"
                      value={customExName}
                      onChange={(e) => setCustomExName(e.target.value)}
                      placeholder="Or type custom exercise name..."
                      className="flex-1 min-w-[180px] bg-[#ffffff] border border-[#e4e4e7] rounded px-2.5 py-1.5 text-xs font-mono text-[#09090b] focus:outline-none focus:border-[#09090b]"
                    />
                    <select
                      value={customExMuscle}
                      onChange={(e) => setCustomExMuscle(e.target.value)}
                      className="bg-[#ffffff] border border-[#e4e4e7] rounded px-2 py-1.5 text-xs font-mono text-[#09090b]"
                    >
                      {['Chest', 'Back', 'Quads', 'Hamstrings', 'Shoulders', 'Arms'].map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                    <select
                      value={customExEquip}
                      onChange={(e) => setCustomExEquip(e.target.value)}
                      className="bg-[#ffffff] border border-[#e4e4e7] rounded px-2 py-1.5 text-xs font-mono text-[#09090b]"
                    >
                      {['Barbell', 'Dumbbell', 'Smith Machine', 'Machine', 'Cable', 'Bodyweight'].map(
                        (eq) => (
                          <option key={eq} value={eq}>
                            {eq}
                          </option>
                        )
                      )}
                    </select>
                    <button
                      type="submit"
                      className="bg-[#09090b] hover:bg-zinc-800 text-[#ffffff] font-mono font-bold text-xs px-3 py-1.5 rounded"
                    >
                      + Add Custom
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* RECENT WORKOUT HISTORY LOG */}
            <div className="bg-[#ffffff] border border-[#e4e4e7] rounded-lg p-4 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#09090b] flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#16a34a]" />
                  <span>RECENT WORKOUT ARCHIVE ({workoutHistory.length} SESSIONS)</span>
                </h2>
                <span className="text-[11px] font-mono text-[#52525b]">
                  1-Click Repeat any past workout
                </span>
              </div>

              <div className="space-y-2">
                {workoutHistory.map((sess) => {
                  const isExpanded = expandedHistoryId === sess.id;
                  return (
                    <div
                      key={sess.id}
                      className="border border-[#e4e4e7] rounded-lg bg-[#f8fafc] overflow-hidden"
                    >
                      <div
                        onClick={() => setExpandedHistoryId(isExpanded ? null : sess.id)}
                        className="p-3 flex flex-wrap items-center justify-between gap-2 cursor-pointer hover:bg-[#f4f4f5]"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#ffffff] text-[#16a34a] border border-[#e4e4e7]">
                            {sess.date}
                          </span>
                          <span className="font-mono font-bold text-sm text-[#09090b]">
                            {sess.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 font-mono text-xs text-[#52525b]">
                          <span>
                            Vol:{' '}
                            <strong className="text-[#09090b]">
                              {sess.totalVolume.toLocaleString()} kg
                            </strong>
                          </span>
                          <span>
                            Sets: <strong className="text-[#16a34a]">{sess.workingSets}</strong>
                          </span>
                          <span>
                            Time:{' '}
                            <strong className="text-[#09090b]">
                              {Math.round(sess.durationSec / 60)}m
                            </strong>
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              repeatHistoricalWorkout(sess);
                            }}
                            className="px-2.5 py-1 rounded bg-[#ffffff] hover:bg-[#09090b] hover:text-[#ffffff] text-[#09090b] border border-[#e4e4e7] font-bold flex items-center gap-1 transition-colors"
                          >
                            <Repeat className="w-3 h-3" />
                            <span>Repeat</span>
                          </button>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-[#09090b]" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-[#09090b]" />
                          )}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="px-3 pb-3 pt-2 border-t border-[#e4e4e7] grid grid-cols-1 md:grid-cols-2 gap-2 bg-[#ffffff]">
                          {sess.exercises.map((ex, i) => (
                            <div
                              key={i}
                              className="bg-[#f8fafc] rounded p-2.5 border border-[#e4e4e7]"
                            >
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="font-mono text-xs font-bold text-[#09090b]">
                                  {ex.name}
                                </span>
                                <span className="text-[10px] font-mono text-[#52525b]">
                                  {ex.muscle} • {ex.equipment}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {ex.sets.map((st, sIdx) => (
                                  <span
                                    key={sIdx}
                                    className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#ffffff] border border-[#e4e4e7] text-[#09090b] tabular-nums"
                                  >
                                    <strong className="text-[#52525b]">{st.type}:</strong> {st.kg}kg ×{' '}
                                    {st.reps}{' '}
                                    <span className="text-[#d97706] font-semibold">@{st.rpe}</span>
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 2: NUTRITION & AI CALORIES (MACRO TRACKER + GEMINI FOOD PARSER)
        =================================================================== */}
        {activeTab === 'nutrition' && (
          <div className="space-y-5">
            {/* Daily Macro Dashboard */}
            <div className="bg-[#ffffff] border border-[#e4e4e7] rounded-lg p-4 space-y-4 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#09090b] flex items-center gap-2">
                    <Flame className="w-4 h-4 text-[#16a34a]" />
                    <span>DAILY MACRO TELEMETRY — {selectedDate}</span>
                  </h2>
                  <p className="text-xs font-mono text-[#52525b]">
                    Protein-to-Calorie Ratio:{' '}
                    {dailyMacrosConsumed.calories > 0
                      ? `${((dailyMacrosConsumed.protein * 4 * 100) / dailyMacrosConsumed.calories).toFixed(0)}% calories from protein`
                      : 'No food logged yet'}
                  </p>
                </div>

                {/* Phase Presets & Edit Targets */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() =>
                      setMacroTargets({ calories: 2050, protein: 195, carbs: 180, fat: 60 })
                    }
                    className="px-2.5 py-1 rounded bg-[#f8fafc] hover:bg-[#e4e4e7] border border-[#e4e4e7] text-xs font-mono font-semibold text-[#09090b]"
                  >
                    Cut (2050)
                  </button>
                  <button
                    onClick={() =>
                      setMacroTargets({ calories: 2450, protein: 185, carbs: 265, fat: 70 })
                    }
                    className="px-2.5 py-1 rounded bg-[#f8fafc] hover:bg-[#e4e4e7] border border-[#e4e4e7] text-xs font-mono font-semibold text-[#09090b]"
                  >
                    Maint (2450)
                  </button>
                  <button
                    onClick={() =>
                      setMacroTargets({ calories: 2850, protein: 190, carbs: 350, fat: 78 })
                    }
                    className="px-2.5 py-1 rounded bg-[#f8fafc] hover:bg-[#e4e4e7] border border-[#e4e4e7] text-xs font-mono font-semibold text-[#09090b]"
                  >
                    Lean Bulk (2850)
                  </button>
                  <button
                    onClick={() => setEditingTargets(!editingTargets)}
                    className="px-2.5 py-1 rounded bg-[#09090b] text-[#ffffff] text-xs font-mono font-bold"
                  >
                    {editingTargets ? 'Done Editing' : 'Edit Targets'}
                  </button>
                </div>
              </div>

              {editingTargets && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded bg-[#f8fafc] border border-[#e4e4e7] font-mono text-xs">
                  {[
                    { key: 'calories', label: 'Daily Calories (kcal)' },
                    { key: 'protein', label: 'Protein Target (g)' },
                    { key: 'carbs', label: 'Carbs Target (g)' },
                    { key: 'fat', label: 'Fat Target (g)' }
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-[10px] uppercase text-[#52525b] font-bold mb-1">
                        {field.label}
                      </label>
                      <input
                        type="number"
                        value={macroTargets[field.key]}
                        onChange={(e) =>
                          setMacroTargets((prev) => ({
                            ...prev,
                            [field.key]: parseInt(e.target.value, 10) || 0
                          }))
                        }
                        className="w-full bg-[#ffffff] border border-[#e4e4e7] rounded px-2.5 py-1.5 text-[#09090b] font-bold"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* 4 Progress Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  {
                    label: 'CALORIES',
                    unit: 'kcal',
                    consumed: dailyMacrosConsumed.calories,
                    target: macroTargets.calories,
                    barColor: 'bg-[#09090b]'
                  },
                  {
                    label: 'PROTEIN',
                    unit: 'g',
                    consumed: dailyMacrosConsumed.protein,
                    target: macroTargets.protein,
                    barColor: 'bg-[#16a34a]'
                  },
                  {
                    label: 'CARBOHYDRATES',
                    unit: 'g',
                    consumed: dailyMacrosConsumed.carbs,
                    target: macroTargets.carbs,
                    barColor: 'bg-[#2563eb]'
                  },
                  {
                    label: 'DIETARY FAT',
                    unit: 'g',
                    consumed: dailyMacrosConsumed.fat,
                    target: macroTargets.fat,
                    barColor: 'bg-[#d97706]'
                  }
                ].map((m) => {
                  const pct =
                    m.target > 0 ? Math.min(100, Math.round((m.consumed / m.target) * 100)) : 0;
                  const rem = +(m.target - m.consumed).toFixed(1);
                  return (
                    <div
                      key={m.label}
                      className="bg-[#f8fafc] border border-[#e4e4e7] rounded-lg p-3 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-[#52525b] font-bold">{m.label}</span>
                        <span className={rem >= 0 ? 'text-[#52525b]' : 'text-[#dc2626] font-bold'}>
                          {rem >= 0 ? `${rem}${m.unit} left` : `${Math.abs(rem)}${m.unit} over`}
                        </span>
                      </div>
                      <div className="font-mono text-lg font-bold text-[#09090b] tabular-nums">
                        {m.consumed}{' '}
                        <span className="text-xs font-normal text-[#52525b]">
                          / {m.target} {m.unit}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-[#e4e4e7] rounded-full overflow-hidden">
                        <div
                          className={`h-full ${m.barColor} transition-all`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Active Meal Slot Selector Bar */}
            <div className="bg-[#ffffff] border border-[#e4e4e7] rounded-lg p-3 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
              <span className="font-mono text-xs font-bold uppercase text-[#52525b]">
                TARGET MEAL SLOT FOR LOGGING:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {MEAL_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedMealSlot(slot)}
                    className={`px-3 py-1 rounded font-mono text-xs font-bold border transition-colors ${
                      selectedMealSlot === slot
                        ? 'bg-[#09090b] text-[#ffffff] border-[#09090b]'
                        : 'bg-[#f8fafc] text-[#52525b] border-[#e4e4e7] hover:text-[#09090b]'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* AI CALORIE & MACRO CALCULATOR (GEMINI 3 FLASH) */}
            <div className="bg-[#ffffff] border-2 border-[#09090b] rounded-lg p-4 space-y-3 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#16a34a]" />
                  <h3 className="font-mono text-xs sm:text-sm font-bold uppercase text-[#09090b]">
                    AI CALORIE & MACRO CALCULATOR (TEXT OR MEAL PHOTO)
                  </h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    '250g cooked chicken breast, 180g white rice, 3 scrambled eggs with 1 tsp oil',
                    '1 bowl pork noodle soup (Chu Yuk Fun) with minced pork, liver and 1 poached egg',
                    '200g ribeye steak, 250g baked potato, 15g butter, steamed broccoli'
                  ].map((sample, idx) => (
                    <button
                      key={idx}
                      onClick={() => setAiFoodQuery(sample)}
                      className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#f8fafc] hover:bg-[#e4e4e7] border border-[#e4e4e7] text-[#52525b] hover:text-[#09090b] font-medium"
                    >
                      Sample #{idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                <div className="lg:col-span-9">
                  <textarea
                    rows={2}
                    value={aiFoodQuery}
                    onChange={(e) => setAiFoodQuery(e.target.value)}
                    placeholder='Describe anything you ate (e.g. "250g cooked chicken breast, 180g white rice, 3 whole eggs" or "Pork noodle soup with extra egg")...'
                    className="w-full bg-[#f8fafc] border border-[#e4e4e7] rounded-lg p-3 text-xs sm:text-sm font-mono text-[#09090b] focus:outline-none focus:border-[#09090b]"
                  />
                </div>
                <div className="lg:col-span-3 flex flex-col gap-2 justify-between">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFoodImageUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2 px-3 rounded-lg bg-[#f8fafc] hover:bg-[#e4e4e7] border border-[#e4e4e7] text-xs font-mono font-semibold text-[#09090b] flex items-center justify-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#2563eb]" />
                    <span>{aiFoodImage ? 'Change Photo' : 'Attach Meal Photo'}</span>
                  </button>

                  <button
                    onClick={calculateCaloriesWithAI}
                    disabled={aiFoodLoading}
                    className="w-full py-2.5 px-3 rounded-lg bg-[#09090b] hover:bg-zinc-800 disabled:opacity-50 text-[#ffffff] font-mono font-bold text-xs uppercase flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>{aiFoodLoading ? 'Analyzing Macros...' : 'Calculate with AI'}</span>
                  </button>
                </div>
              </div>

              {/* Photo Thumbnail Preview if attached */}
              {aiFoodImage && (
                <div className="flex items-center gap-3 bg-[#f8fafc] border border-[#e4e4e7] p-2 rounded-lg">
                  <img
                    src={aiFoodImage.previewUrl}
                    alt="Food preview"
                    className="w-12 h-12 object-cover rounded border border-[#e4e4e7]"
                  />
                  <div className="flex-1 font-mono text-xs text-[#09090b] truncate">
                    Attached: {aiFoodImage.name}
                  </div>
                  <button
                    onClick={() => setAiFoodImage(null)}
                    className="text-xs font-mono font-bold text-[#dc2626] hover:underline px-2"
                  >
                    Remove
                  </button>
                </div>
              )}

              {aiFoodError && (
                <div className="p-3 rounded bg-red-50 border border-red-200 text-[#dc2626] font-mono text-xs font-semibold">
                  {aiFoodError}
                </div>
              )}

              {/* AI Structured Output Editable Preview Table */}
              {aiFoodResult && aiFoodResult.items && (
                <div className="bg-[#f8fafc] border border-[#e4e4e7] rounded-lg p-3 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e4e4e7] pb-2">
                    <div className="text-xs font-mono text-[#09090b]">
                      <strong className="text-[#16a34a]">AI Confidence Note:</strong>{' '}
                      {aiFoodResult.summary_note}
                    </div>
                    <button
                      onClick={() => {
                        logFoodItems(aiFoodResult.items, selectedMealSlot);
                        setAiFoodResult(null);
                        setAiFoodQuery('');
                        setAiFoodImage(null);
                      }}
                      className="bg-[#16a34a] hover:bg-emerald-700 text-[#ffffff] font-mono font-bold text-xs px-3 py-1.5 rounded flex items-center gap-1 shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Log All to {selectedMealSlot}</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-xs">
                      <thead>
                        <tr className="text-[10px] uppercase text-[#52525b] border-b border-[#e4e4e7] font-bold">
                          <th className="py-1.5 px-2">FOOD ITEM (EDITABLE)</th>
                          <th className="py-1.5 px-2">WEIGHT / PORTION</th>
                          <th className="py-1.5 px-2">KCAL</th>
                          <th className="py-1.5 px-2">PROTEIN (g)</th>
                          <th className="py-1.5 px-2">CARBS (g)</th>
                          <th className="py-1.5 px-2">FAT (g)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e4e4e7]">
                        {aiFoodResult.items.map((item, idx) => (
                          <tr key={idx}>
                            <td className="py-1.5 px-2">
                              <input
                                type="text"
                                value={item.name}
                                onChange={(e) => updateAiPreviewItem(idx, 'name', e.target.value)}
                                className="w-full bg-[#ffffff] border border-[#e4e4e7] rounded px-2 py-1 text-[#09090b] font-semibold"
                              />
                            </td>
                            <td className="py-1.5 px-2">
                              <input
                                type="text"
                                value={item.portion}
                                onChange={(e) => updateAiPreviewItem(idx, 'portion', e.target.value)}
                                className="w-32 bg-[#ffffff] border border-[#e4e4e7] rounded px-2 py-1 text-[#52525b]"
                              />
                            </td>
                            <td className="py-1.5 px-2">
                              <input
                                type="number"
                                value={item.calories}
                                onChange={(e) => updateAiPreviewItem(idx, 'calories', e.target.value)}
                                className="w-20 bg-[#ffffff] border border-[#e4e4e7] rounded px-2 py-1 text-[#09090b] font-bold"
                              />
                            </td>
                            <td className="py-1.5 px-2">
                              <input
                                type="number"
                                step="0.5"
                                value={item.protein_g}
                                onChange={(e) => updateAiPreviewItem(idx, 'protein_g', e.target.value)}
                                className="w-16 bg-[#ffffff] border border-[#e4e4e7] rounded px-2 py-1 text-[#16a34a] font-bold"
                              />
                            </td>
                            <td className="py-1.5 px-2">
                              <input
                                type="number"
                                step="0.5"
                                value={item.carbs_g}
                                onChange={(e) => updateAiPreviewItem(idx, 'carbs_g', e.target.value)}
                                className="w-16 bg-[#ffffff] border border-[#e4e4e7] rounded px-2 py-1 text-[#2563eb] font-semibold"
                              />
                            </td>
                            <td className="py-1.5 px-2">
                              <input
                                type="number"
                                step="0.5"
                                value={item.fat_g}
                                onChange={(e) => updateAiPreviewItem(idx, 'fat_g', e.target.value)}
                                className="w-16 bg-[#ffffff] border border-[#e4e4e7] rounded px-2 py-1 text-[#d97706] font-semibold"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* 1-TAP GYM STAPLE QUICK-ADD BAR */}
            <div className="bg-[#ffffff] border border-[#e4e4e7] rounded-lg p-3.5 space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold uppercase text-[#09090b]">
                  1-TAP GYM STAPLE QUICK-ADD (LOGS TO {selectedMealSlot.toUpperCase()})
                </span>
                <span className="text-[11px] font-mono text-[#52525b]">
                  Instant log to {selectedDate}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {GYM_STAPLES.map((staple, idx) => (
                  <button
                    key={idx}
                    onClick={() => logFoodItems([staple], selectedMealSlot)}
                    className="p-2 rounded bg-[#f8fafc] hover:bg-emerald-50/70 border border-[#e4e4e7] hover:border-[#16a34a] text-left transition-all group"
                  >
                    <div className="font-mono text-xs font-bold text-[#09090b] group-hover:text-[#16a34a] truncate">
                      + {staple.name}
                    </div>
                    <div className="font-mono text-[10px] text-[#52525b]">
                      {staple.portion} • <span className="text-[#09090b] font-semibold">{staple.calories}kcal</span> •{' '}
                      <span className="text-[#16a34a] font-bold">{staple.protein_g}P</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* SELECTED DATE FOOD LOG TABLE + MANUAL ADD */}
            <div className="bg-[#ffffff] border border-[#e4e4e7] rounded-lg overflow-hidden shadow-2xs">
              <div className="p-3.5 border-b border-[#e4e4e7] bg-[#f8fafc] flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-mono text-xs font-bold uppercase text-[#09090b]">
                  FOOD LOG FOR {selectedDate} ({selectedDateFoods.length} ITEMS)
                </h3>
                <span className="font-mono text-xs text-[#52525b]">
                  Total: <strong className="text-[#09090b]">{dailyMacrosConsumed.calories} kcal</strong> |{' '}
                  <strong className="text-[#16a34a]">{dailyMacrosConsumed.protein}g P</strong> |{' '}
                  <strong className="text-[#2563eb]">{dailyMacrosConsumed.carbs}g C</strong> |{' '}
                  <strong className="text-[#d97706]">{dailyMacrosConsumed.fat}g F</strong>
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-[#e4e4e7] text-[10px] uppercase text-[#52525b] bg-[#f4f4f5]/60 font-bold">
                      <th className="py-2 px-3">SLOT / TIME</th>
                      <th className="py-2 px-3">FOOD / MEAL DESCRIPTION</th>
                      <th className="py-2 px-3">PORTION</th>
                      <th className="py-2 px-3">KCAL</th>
                      <th className="py-2 px-3">PROTEIN</th>
                      <th className="py-2 px-3">CARBS</th>
                      <th className="py-2 px-3">FAT</th>
                      <th className="py-2 px-3 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e4e4e7]">
                    {selectedDateFoods.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-6 text-center text-[#52525b]">
                          No food logged for {selectedDate} yet. Use the AI Calculator or 1-Tap Staples above.
                        </td>
                      </tr>
                    ) : (
                      selectedDateFoods.map((f) => (
                        <tr key={f.id} className="hover:bg-[#f8fafc]">
                          <td className="py-2.5 px-3 tabular-nums">
                            <span className="px-1.5 py-0.5 rounded bg-[#f4f4f5] border border-[#e4e4e7] text-[10px] font-bold text-[#09090b] mr-1.5">
                              {f.mealSlot || 'Meal'}
                            </span>
                            <span className="text-[#52525b]">{f.time}</span>
                          </td>
                          <td className="py-2.5 px-3 font-bold text-[#09090b]">{f.name}</td>
                          <td className="py-2.5 px-3 text-[#52525b]">{f.portion}</td>
                          <td className="py-2.5 px-3 font-bold text-[#09090b] tabular-nums">
                            {f.calories}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-[#16a34a] tabular-nums">
                            {f.protein_g}g
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-[#2563eb] tabular-nums">
                            {f.carbs_g}g
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-[#d97706] tabular-nums">
                            {f.fat_g}g
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => logFoodItems([f], f.mealSlot)}
                                className="px-2 py-0.5 rounded bg-[#f4f4f5] hover:bg-[#e4e4e7] border border-[#e4e4e7] text-[#09090b] font-semibold text-[11px]"
                                title="Duplicate +1x"
                              >
                                +1x
                              </button>
                              <button
                                onClick={() =>
                                  setFoodLogs((prev) => prev.filter((item) => item.id !== f.id))
                                }
                                className="p-1 text-[#52525b] hover:text-[#dc2626]"
                                title="Delete Entry"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Quick Manual Food Row */}
              <form
                onSubmit={handleManualFoodSubmit}
                className="p-3 bg-[#f8fafc] border-t border-[#e4e4e7] flex flex-wrap items-center gap-2 font-mono text-xs"
              >
                <input
                  type="text"
                  placeholder="Manual food name..."
                  value={manualFood.name}
                  onChange={(e) => setManualFood({ ...manualFood, name: e.target.value })}
                  className="flex-1 min-w-[150px] bg-[#ffffff] border border-[#e4e4e7] rounded px-2.5 py-1.5 text-[#09090b]"
                />
                <input
                  type="text"
                  placeholder="Portion"
                  value={manualFood.portion}
                  onChange={(e) => setManualFood({ ...manualFood, portion: e.target.value })}
                  className="w-28 bg-[#ffffff] border border-[#e4e4e7] rounded px-2 py-1.5 text-[#52525b]"
                />
                <input
                  type="number"
                  placeholder="Kcal"
                  value={manualFood.calories}
                  onChange={(e) => setManualFood({ ...manualFood, calories: e.target.value })}
                  className="w-20 bg-[#ffffff] border border-[#e4e4e7] rounded px-2 py-1.5 text-[#09090b]"
                />
                <input
                  type="number"
                  step="0.5"
                  placeholder="Prot (g)"
                  value={manualFood.protein_g}
                  onChange={(e) => setManualFood({ ...manualFood, protein_g: e.target.value })}
                  className="w-20 bg-[#ffffff] border border-[#e4e4e7] rounded px-2 py-1.5 text-[#16a34a]"
                />
                <input
                  type="number"
                  step="0.5"
                  placeholder="Carb (g)"
                  value={manualFood.carbs_g}
                  onChange={(e) => setManualFood({ ...manualFood, carbs_g: e.target.value })}
                  className="w-20 bg-[#ffffff] border border-[#e4e4e7] rounded px-2 py-1.5 text-[#2563eb]"
                />
                <input
                  type="number"
                  step="0.5"
                  placeholder="Fat (g)"
                  value={manualFood.fat_g}
                  onChange={(e) => setManualFood({ ...manualFood, fat_g: e.target.value })}
                  className="w-20 bg-[#ffffff] border border-[#e4e4e7] rounded px-2 py-1.5 text-[#d97706]"
                />
                <button
                  type="submit"
                  className="bg-[#09090b] hover:bg-zinc-800 text-[#ffffff] font-bold px-3 py-1.5 rounded"
                >
                  + Add Manual
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 3: AI COACH & PLATE / WARM-UP CALCULATOR SIDEBAR
        =================================================================== */}
        {activeTab === 'coach' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left 7 Cols: Personal AI Strength & Nutrition Assistant */}
            <div className="lg:col-span-7 bg-[#ffffff] border border-[#e4e4e7] rounded-lg flex flex-col h-[680px] shadow-2xs">
              {/* Coach Header & Live Telemetry Status */}
              <div className="p-3.5 border-b border-[#e4e4e7] bg-[#f8fafc] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-[#16a34a]" />
                    <h2 className="font-mono text-xs sm:text-sm font-bold uppercase text-[#09090b]">
                      AI PERSONAL GYM ASSISTANT (LIVE CONTEXT INJECTED)
                    </h2>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-[#16a34a] border border-emerald-200">
                    SYNCED TO LOGS
                  </span>
                </div>

                {/* Quick Action Prompts */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    "Analyze today's Push volume & RPE",
                    'High-protein post-workout meal to hit remaining macros',
                    'Suggest progressive overload for next session',
                    'Form & setup cues for Smith Machine Incline Press'
                  ].map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendCoachPrompt(q)}
                      disabled={coachLoading}
                      className="text-[11px] font-mono font-medium px-2.5 py-1 rounded bg-[#ffffff] hover:bg-[#09090b] hover:text-[#ffffff] border border-[#e4e4e7] text-[#09090b] transition-colors text-left"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Message Feed */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs bg-[#ffffff]">
                {coachMessages.map((m, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg border leading-relaxed whitespace-pre-wrap ${
                      m.role === 'user'
                        ? 'bg-emerald-50/80 border-emerald-200 text-[#09090b] ml-8'
                        : 'bg-[#f8fafc] border-[#e4e4e7] text-[#09090b] mr-4'
                    }`}
                  >
                    <div className="text-[10px] uppercase text-[#52525b] mb-1 font-bold">
                      {m.role === 'user' ? 'YOU // LIFTER' : 'IRONLOG AI // COACH'}
                    </div>
                    {m.text}
                  </div>
                ))}
                {coachLoading && (
                  <div className="p-3 rounded-lg border border-[#e4e4e7] bg-[#f8fafc] text-[#16a34a] font-mono text-xs font-bold animate-pulse">
                    Analyzing your workout sets, e1RM trends, and macro balance...
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input Box */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendCoachPrompt();
                }}
                className="p-3 border-t border-[#e4e4e7] bg-[#f8fafc] flex items-center gap-2"
              >
                <input
                  type="text"
                  value={coachInput}
                  onChange={(e) => setCoachInput(e.target.value)}
                  placeholder="Ask about your sets, RPE, plateau busting, or post-workout meal..."
                  className="flex-1 bg-[#ffffff] border border-[#e4e4e7] rounded-lg px-3 py-2 text-xs font-mono text-[#09090b] focus:outline-none focus:border-[#09090b]"
                />
                <button
                  type="submit"
                  disabled={coachLoading}
                  className="bg-[#09090b] hover:bg-zinc-800 disabled:opacity-50 text-[#ffffff] font-mono font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Ask</span>
                </button>
              </form>
            </div>

            {/* Right 5 Cols: Warm-Up Ramp & Barbell Plate Calculator Sidebar */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#ffffff] border border-[#e4e4e7] rounded-lg p-4 space-y-4 shadow-2xs">
                <div className="flex items-center gap-2 border-b border-[#e4e4e7] pb-2.5">
                  <Calculator className="w-4 h-4 text-[#d97706]" />
                  <h3 className="font-mono text-xs sm:text-sm font-bold uppercase text-[#09090b]">
                    WARM-UP RAMP & PLATE CALCULATOR
                  </h3>
                </div>

                {/* Target Working Weight & Bar Selector */}
                <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                  <div>
                    <label className="block text-[10px] uppercase text-[#52525b] font-bold mb-1">
                      TARGET WORKING WEIGHT (KG)
                    </label>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setTargetPlateWeight((w) => Math.max(20, Number(w) - 2.5))}
                        className="px-2.5 py-1.5 rounded bg-[#f4f4f5] border border-[#e4e4e7] text-[#09090b] font-bold"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        step="2.5"
                        value={targetPlateWeight}
                        onChange={(e) => setTargetPlateWeight(e.target.value)}
                        className="w-full bg-[#ffffff] border border-[#e4e4e7] rounded px-2.5 py-1.5 text-center font-bold text-[#09090b] text-sm"
                      />
                      <button
                        onClick={() => setTargetPlateWeight((w) => Number(w) + 2.5)}
                        className="px-2.5 py-1.5 rounded bg-[#f4f4f5] border border-[#e4e4e7] text-[#09090b] font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-[#52525b] font-bold mb-1">
                      EMPTY BAR WEIGHT (KG)
                    </label>
                    <select
                      value={barbellWeight}
                      onChange={(e) => setBarbellWeight(Number(e.target.value))}
                      className="w-full bg-[#ffffff] border border-[#e4e4e7] rounded px-2.5 py-1.5 text-[#09090b] font-semibold h-[34px]"
                    >
                      <option value={20}>20 kg (Standard Olympic)</option>
                      <option value={15}>15 kg (Women's Olympic)</option>
                      <option value={10}>10 kg (EZ Curl / Technique)</option>
                      <option value={7}>7 kg (Counterbalanced Smith)</option>
                    </select>
                  </div>
                </div>

                {/* Plates Per Side Display */}
                <div className="bg-[#f8fafc] border border-[#e4e4e7] rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#52525b] font-bold">PLATES PER SIDE:</span>
                    <span className="text-[#16a34a] font-bold">
                      {plateAndWarmupCalc.workingPlates.length > 0
                        ? plateAndWarmupCalc.workingPlates.map((p) => `${p}kg`).join(' + ')
                        : 'Empty Bar Only'}
                    </span>
                  </div>

                  {/* Visual Barbell Sleeve */}
                  <div className="flex items-center gap-1 py-2 overflow-x-auto">
                    <div className="h-3 w-8 bg-zinc-400 rounded-l shrink-0" />
                    <div className="h-7 w-2 bg-zinc-600 shrink-0" />
                    {plateAndWarmupCalc.workingPlates.map((p, idx) => {
                      const heightClass =
                        p === 25
                          ? 'h-14 bg-[#dc2626] border-red-700 text-white'
                          : p === 20
                          ? 'h-14 bg-[#2563eb] border-blue-700 text-white'
                          : p === 15
                          ? 'h-12 bg-[#d97706] border-amber-700 text-white'
                          : p === 10
                          ? 'h-10 bg-[#16a34a] border-emerald-700 text-white'
                          : p === 5
                          ? 'h-8 bg-[#09090b] border-zinc-900 text-white'
                          : 'h-6 bg-zinc-200 text-[#09090b] border-zinc-400';
                      return (
                        <div
                          key={idx}
                          className={`px-1.5 rounded border flex items-center justify-center font-mono text-[10px] font-bold shrink-0 ${heightClass}`}
                        >
                          {p}
                        </div>
                      );
                    })}
                    <div className="h-3 flex-1 min-w-[24px] bg-zinc-400 rounded-r" />
                  </div>
                </div>

                {/* 4-Stage Neural Potentiation Warm-Up Ramp (40%x8, 60%x5, 75%x3, 85%x1) */}
                <div className="space-y-2">
                  <div className="text-[11px] font-mono uppercase text-[#52525b] font-bold">
                    AUTOMATIC WARM-UP RAMP FOR {targetPlateWeight} KG (40% / 60% / 75% / 85%):
                  </div>
                  <div className="divide-y divide-[#e4e4e7] border border-[#e4e4e7] rounded-lg bg-[#f8fafc] font-mono text-xs">
                    {plateAndWarmupCalc.warmupRamp.map((row, idx) => (
                      <div key={idx} className="p-2.5 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-[#09090b]">{row.stage}</div>
                          <div className="text-[10px] text-[#52525b]">
                            Plates/side:{' '}
                            {row.plates.length > 0 ? row.plates.join(', ') + ' kg' : 'Bar only'}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-[#16a34a] tabular-nums">
                            {row.weight} kg × {row.reps}
                          </div>
                          <div className="text-[10px] text-[#d97706] font-semibold">
                            Rest {row.rest}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 4: PROGRESS & BODY (7-DAY MOVING AVG, SVG CHART, MAV & TDEE)
        =================================================================== */}
        {activeTab === 'progress' && (
          <div className="space-y-5">
            {/* Top Row: Bodyweight Logger + SVG Trend Chart + Weekly Sets Landmarks */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Bodyweight & Composition Tracker */}
              <div className="lg:col-span-6 bg-[#ffffff] border border-[#e4e4e7] rounded-lg p-4 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-[#16a34a]" />
                    <h2 className="font-mono text-xs sm:text-sm font-bold uppercase text-[#09090b]">
                      BODYWEIGHT & 7-DAY MOVING AVERAGE
                    </h2>
                  </div>
                  <span className="font-mono text-xs text-[#16a34a] font-bold">
                    7d Avg: {weightAnalytics.avg7} kg ({weightAnalytics.weeklyDelta} kg/wk)
                  </span>
                </div>

                {/* Crisp SVG Trend Chart for Last 7 Weigh-ins */}
                {weightAnalytics.last7.length > 1 && (
                  <div className="bg-[#f8fafc] border border-[#e4e4e7] rounded-lg p-3">
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#52525b] mb-1">
                      <span>7-DAY MORNING WEIGH-IN TREND (KG)</span>
                      <span className="font-bold text-[#09090b]">
                        Latest: {weightAnalytics.latest} kg
                      </span>
                    </div>
                    {(() => {
                      const pts = weightAnalytics.last7;
                      const weights = pts.map((p) => Number(p.weight));
                      const minW = Math.min(...weights) - 0.3;
                      const maxW = Math.max(...weights) + 0.3;
                      const width = 460;
                      const height = 90;
                      const coords = pts.map((p, idx) => {
                        const x =
                          pts.length === 1 ? width / 2 : (idx / (pts.length - 1)) * (width - 40) + 20;
                        const y =
                          height -
                          18 -
                          ((Number(p.weight) - minW) / Math.max(0.1, maxW - minW)) * (height - 34);
                        return { x, y, w: p.weight, d: p.date.slice(5) };
                      });
                      const polylinePoints = coords.map((c) => `${c.x},${c.y}`).join(' ');

                      return (
                        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-24 overflow-visible">
                          <polyline
                            fill="none"
                            stroke="#16a34a"
                            strokeWidth="2.5"
                            points={polylinePoints}
                          />
                          {coords.map((c, i) => (
                            <g key={i}>
                              <circle cx={c.x} cy={c.y} r="3.5" fill="#09090b" />
                              <text
                                x={c.x}
                                y={c.y - 7}
                                textAnchor="middle"
                                className="text-[9px] font-mono fill-[#09090b] font-bold"
                              >
                                {c.w}
                              </text>
                              <text
                                x={c.x}
                                y={height - 2}
                                textAnchor="middle"
                                className="text-[8px] font-mono fill-[#52525b]"
                              >
                                {c.d}
                              </text>
                            </g>
                          ))}
                        </svg>
                      );
                    })()}
                  </div>
                )}

                {/* Log Today's Weight Form */}
                <form
                  onSubmit={handleLogBodyMetric}
                  className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs bg-[#f8fafc] p-3 rounded-lg border border-[#e4e4e7]"
                >
                  <div>
                    <label className="block text-[10px] text-[#52525b] font-bold uppercase mb-1">
                      WEIGHT (KG)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={newWeight}
                      onChange={(e) => setNewWeight(e.target.value)}
                      className="w-full bg-[#ffffff] border border-[#e4e4e7] rounded px-2 py-1.5 text-[#09090b] font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#52525b] font-bold uppercase mb-1">
                      BODY FAT %
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={newBodyFat}
                      onChange={(e) => setNewBodyFat(e.target.value)}
                      className="w-full bg-[#ffffff] border border-[#e4e4e7] rounded px-2 py-1.5 text-[#09090b]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#52525b] font-bold uppercase mb-1">
                      WAIST (CM)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={newWaist}
                      onChange={(e) => setNewWaist(e.target.value)}
                      className="w-full bg-[#ffffff] border border-[#e4e4e7] rounded px-2 py-1.5 text-[#09090b]"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full bg-[#09090b] hover:bg-zinc-800 text-[#ffffff] font-bold py-1.5 px-3 rounded"
                    >
                      Save {selectedDate.slice(5)}
                    </button>
                  </div>
                </form>

                {/* Historical Weight Table */}
                <div className="overflow-x-auto max-h-48">
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="border-b border-[#e4e4e7] text-[10px] text-[#52525b] uppercase font-bold">
                        <th className="py-1.5 px-2">DATE</th>
                        <th className="py-1.5 px-2">WEIGHT</th>
                        <th className="py-1.5 px-2">BF %</th>
                        <th className="py-1.5 px-2">WAIST</th>
                        <th className="py-1.5 px-2">NOTE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e4e4e7]">
                      {[...weightAnalytics.sorted].reverse().map((bm) => (
                        <tr key={bm.id} className="hover:bg-[#f8fafc]">
                          <td className="py-2 px-2 text-[#52525b]">{bm.date}</td>
                          <td className="py-2 px-2 font-bold text-[#09090b]">{bm.weight} kg</td>
                          <td className="py-2 px-2 text-[#16a34a] font-semibold">
                            {bm.bodyFat ? `${bm.bodyFat}%` : '—'}
                          </td>
                          <td className="py-2 px-2 text-[#09090b]">
                            {bm.waist ? `${bm.waist} cm` : '—'}
                          </td>
                          <td className="py-2 px-2 text-[#52525b] truncate max-w-[150px]">
                            {bm.note}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Weekly Muscle Group Sets vs Hypertrophy Landmarks (10-20 MAV) */}
              <div className="lg:col-span-6 bg-[#ffffff] border border-[#e4e4e7] rounded-lg p-4 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#d97706]" />
                    <h2 className="font-mono text-xs sm:text-sm font-bold uppercase text-[#09090b]">
                      WEEKLY SETS PER MUSCLE GROUP (MAV LANDMARKS)
                    </h2>
                  </div>
                  <span className="text-[11px] font-mono text-[#52525b] font-semibold">
                    Optimal Target: 10–20 sets/wk
                  </span>
                </div>

                <div className="space-y-3 pt-1">
                  {Object.entries(weeklyMuscleVolume).map(([muscle, sets]) => {
                    const pct = Math.min(100, Math.round((sets / 20) * 100));
                    let statusColor = 'bg-[#16a34a]';
                    let statusLabel = 'OPTIMAL MAV (10-20)';
                    if (sets < 10) {
                      statusColor = 'bg-[#2563eb]';
                      statusLabel = 'MAINTENANCE / BUILD (<10)';
                    } else if (sets > 20) {
                      statusColor = 'bg-[#d97706]';
                      statusLabel = 'HIGH VOLUME / MRV (>20)';
                    }

                    return (
                      <div key={muscle} className="space-y-1 font-mono text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#09090b]">{muscle}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-[#52525b] font-medium">
                              {statusLabel}
                            </span>
                            <span className="font-bold text-[#09090b] tabular-nums">
                              {sets} sets
                            </span>
                          </div>
                        </div>
                        <div className="w-full h-2.5 bg-[#f4f4f5] rounded-full overflow-hidden border border-[#e4e4e7]">
                          <div
                            className={`h-full ${statusColor} transition-all`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* TDEE & Evidence-Based Macro Calculator */}
            <div className="bg-[#ffffff] border border-[#e4e4e7] rounded-lg p-4 space-y-3 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-mono text-xs sm:text-sm font-bold uppercase text-[#09090b] flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-[#2563eb]" />
                  <span>TDEE & EVIDENCE-BASED LIFTER MACRO CALCULATOR</span>
                </h2>
                <button
                  onClick={() => {
                    setMacroTargets({
                      calories: tdeeCalculation.targetKcal,
                      protein: tdeeCalculation.recProtein,
                      carbs: tdeeCalculation.recCarbs,
                      fat: tdeeCalculation.recFat
                    });
                    notify(`Applied TDEE Targets: ${tdeeCalculation.targetKcal} kcal`);
                  }}
                  className="bg-[#16a34a] hover:bg-emerald-700 text-[#ffffff] font-mono font-bold text-xs px-3 py-1.5 rounded"
                >
                  Apply to My Daily Targets
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5 font-mono text-xs bg-[#f8fafc] p-3 rounded-lg border border-[#e4e4e7]">
                <div>
                  <label className="block text-[10px] text-[#52525b] font-bold uppercase mb-1">
                    SEX
                  </label>
                  <select
                    value={tdeeForm.sex}
                    onChange={(e) => setTdeeForm({ ...tdeeForm, sex: e.target.value })}
                    className="w-full bg-[#ffffff] border border-[#e4e4e7] rounded px-2 py-1.5 text-[#09090b] font-semibold"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-[#52525b] font-bold uppercase mb-1">
                    AGE
                  </label>
                  <input
                    type="number"
                    value={tdeeForm.age}
                    onChange={(e) => setTdeeForm({ ...tdeeForm, age: e.target.value })}
                    className="w-full bg-[#ffffff] border border-[#e4e4e7] rounded px-2 py-1.5 text-[#09090b] font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#52525b] font-bold uppercase mb-1">
                    HEIGHT (CM)
                  </label>
                  <input
                    type="number"
                    value={tdeeForm.heightCm}
                    onChange={(e) => setTdeeForm({ ...tdeeForm, heightCm: e.target.value })}
                    className="w-full bg-[#ffffff] border border-[#e4e4e7] rounded px-2 py-1.5 text-[#09090b] font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#52525b] font-bold uppercase mb-1">
                    WEIGHT (KG)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={tdeeForm.weightKg}
                    onChange={(e) => setTdeeForm({ ...tdeeForm, weightKg: e.target.value })}
                    className="w-full bg-[#ffffff] border border-[#e4e4e7] rounded px-2 py-1.5 text-[#09090b] font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#52525b] font-bold uppercase mb-1">
                    ACTIVITY
                  </label>
                  <select
                    value={tdeeForm.activityMult}
                    onChange={(e) => setTdeeForm({ ...tdeeForm, activityMult: e.target.value })}
                    className="w-full bg-[#ffffff] border border-[#e4e4e7] rounded px-2 py-1.5 text-[#09090b]"
                  >
                    <option value={1.375}>3d Lifting (1.375x)</option>
                    <option value={1.55}>4-5d Lifting (1.55x)</option>
                    <option value={1.725}>6d High Vol (1.725x)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-[#52525b] font-bold uppercase mb-1">
                    GOAL PHASE
                  </label>
                  <select
                    value={tdeeForm.goalDelta}
                    onChange={(e) => setTdeeForm({ ...tdeeForm, goalDelta: e.target.value })}
                    className="w-full bg-[#ffffff] border border-[#e4e4e7] rounded px-2 py-1.5 text-[#09090b]"
                  >
                    <option value={-500}>Aggressive Cut (-500)</option>
                    <option value={-300}>Lean Cut (-300)</option>
                    <option value={0}>Maintenance (0)</option>
                    <option value={250}>Lean Bulk (+250)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 font-mono text-xs">
                <div className="p-2.5 rounded bg-[#f8fafc] border border-[#e4e4e7]">
                  <div className="text-[10px] text-[#52525b]">ESTIMATED TDEE</div>
                  <div className="font-bold text-sm text-[#09090b]">
                    {tdeeCalculation.maintenanceKcal} kcal
                  </div>
                </div>
                <div className="p-2.5 rounded bg-[#f8fafc] border border-[#e4e4e7]">
                  <div className="text-[10px] text-[#52525b]">TARGET CALORIES</div>
                  <div className="font-bold text-sm text-[#09090b]">
                    {tdeeCalculation.targetKcal} kcal
                  </div>
                </div>
                <div className="p-2.5 rounded bg-emerald-50/70 border border-emerald-200">
                  <div className="text-[10px] text-[#16a34a] font-bold">PROTEIN (2.3g/kg)</div>
                  <div className="font-bold text-sm text-[#16a34a]">
                    {tdeeCalculation.recProtein} g
                  </div>
                </div>
                <div className="p-2.5 rounded bg-blue-50/70 border border-blue-200">
                  <div className="text-[10px] text-[#2563eb] font-bold">CARBOHYDRATES</div>
                  <div className="font-bold text-sm text-[#2563eb]">
                    {tdeeCalculation.recCarbs} g
                  </div>
                </div>
                <div className="p-2.5 rounded bg-amber-50/70 border border-amber-200">
                  <div className="text-[10px] text-[#d97706] font-bold">DIETARY FAT</div>
                  <div className="font-bold text-sm text-[#d97706]">{tdeeCalculation.recFat} g</div>
                </div>
              </div>
            </div>

            {/* Strength Progression & All-Time PR Board */}
            <div className="bg-[#ffffff] border border-[#e4e4e7] rounded-lg p-4 space-y-3 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-mono text-xs sm:text-sm font-bold uppercase text-[#09090b] flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#16a34a]" />
                  <span>KEY LIFT e1RM PROGRESSION BOARD</span>
                </h2>
                <select
                  value={selectedPrExercise}
                  onChange={(e) => setSelectedPrExercise(e.target.value)}
                  className="bg-[#f8fafc] border border-[#e4e4e7] rounded px-3 py-1.5 font-mono text-xs font-bold text-[#09090b]"
                >
                  {Object.keys(exerciseHistoryStats).map((exName) => (
                    <option key={exName} value={exName}>
                      {exName} (Peak e1RM: {exerciseHistoryStats[exName].maxE1RM} kg)
                    </option>
                  ))}
                </select>
              </div>

              {exerciseHistoryStats[selectedPrExercise] ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                    <div className="bg-[#f8fafc] border border-[#e4e4e7] rounded p-3">
                      <div className="text-[10px] text-[#52525b] font-bold uppercase">
                        ALL-TIME PEAK e1RM
                      </div>
                      <div className="text-xl font-bold text-[#16a34a]">
                        {exerciseHistoryStats[selectedPrExercise].maxE1RM} kg
                      </div>
                    </div>
                    <div className="bg-[#f8fafc] border border-[#e4e4e7] rounded p-3">
                      <div className="text-[10px] text-[#52525b] font-bold uppercase">
                        BEST WORKING SET
                      </div>
                      <div className="text-xl font-bold text-[#09090b]">
                        {exerciseHistoryStats[selectedPrExercise].bestSet.kg}kg ×{' '}
                        {exerciseHistoryStats[selectedPrExercise].bestSet.reps}
                      </div>
                    </div>
                    <div className="bg-[#f8fafc] border border-[#e4e4e7] rounded p-3">
                      <div className="text-[10px] text-[#52525b] font-bold uppercase">
                        TOTAL LOGGED WORKING SETS
                      </div>
                      <div className="text-xl font-bold text-[#d97706]">
                        {exerciseHistoryStats[selectedPrExercise].logs.length} sets
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-xs">
                      <thead>
                        <tr className="border-b border-[#e4e4e7] text-[10px] text-[#52525b] uppercase font-bold">
                          <th className="py-1.5 px-2">DATE</th>
                          <th className="py-1.5 px-2">WEIGHT (KG)</th>
                          <th className="py-1.5 px-2">REPS</th>
                          <th className="py-1.5 px-2">RPE</th>
                          <th className="py-1.5 px-2">ESTIMATED 1RM</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e4e4e7]">
                        {exerciseHistoryStats[selectedPrExercise].logs.map((log, i) => (
                          <tr key={i} className="hover:bg-[#f8fafc]">
                            <td className="py-2 px-2 text-[#52525b]">{log.date}</td>
                            <td className="py-2 px-2 font-bold text-[#09090b]">{log.kg} kg</td>
                            <td className="py-2 px-2 text-[#09090b]">{log.reps}</td>
                            <td className="py-2 px-2 text-[#d97706] font-semibold">@{log.rpe}</td>
                            <td className="py-2 px-2 font-bold text-[#16a34a]">{log.e1rm} kg</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <p className="text-xs font-mono text-[#52525b]">
                  No sets logged for this exercise yet.
                </p>
              )}
            </div>
          </div>
        )}
      </main>

      {/* =====================================================================
          SUPABASE SQL SCHEMA + VERCEL CONFIG + JSON BACKUP MODAL
      ===================================================================== */}
      {showSupabaseModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#ffffff] border border-[#e4e4e7] rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-[#e4e4e7] flex items-center justify-between bg-[#f8fafc]">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-[#16a34a]" />
                <h2 className="font-mono font-bold text-sm uppercase text-[#09090b]">
                  VERCEL + SUPABASE DEPLOYMENT SCHEMA & DATA BACKUP
                </h2>
              </div>
              <button
                onClick={() => setShowSupabaseModal(false)}
                className="p-1 text-[#52525b] hover:text-[#09090b]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-5 font-mono text-xs">
              {/* JSON Export / Import Section */}
              <div className="bg-[#f8fafc] border border-[#e4e4e7] rounded-lg p-3.5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="font-bold text-[#16a34a] uppercase">
                      1. INSTANT JSON BACKUP / RESTORE
                    </div>
                    <p className="text-[#52525b] text-[11px]">
                      Export all workouts, sets, macros, and bodyweight logs or restore from a JSON snapshot.
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      copyTextToClipboard(getFullBackupJson(), 'Full JSON Backup copied to clipboard!')
                    }
                    className="bg-[#09090b] hover:bg-zinc-800 text-[#ffffff] font-bold px-3 py-1.5 rounded flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Full Backup JSON</span>
                  </button>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={importJsonText}
                    onChange={(e) => setImportJsonText(e.target.value)}
                    placeholder="Paste backup JSON here to restore..."
                    className="flex-1 bg-[#ffffff] border border-[#e4e4e7] rounded px-2.5 py-1.5 text-[#09090b]"
                  />
                  <button
                    onClick={handleImportBackupJson}
                    className="bg-[#16a34a] hover:bg-emerald-700 text-[#ffffff] px-3 py-1.5 rounded font-bold"
                  >
                    Restore JSON
                  </button>
                </div>
              </div>

              {/* Production PostgreSQL Schema for Supabase */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#09090b] uppercase">
                    2. SUPABASE POSTGRESQL SCHEMA (`schema.sql` WITH RLS & GENERATED e1RM)
                  </span>
                  <button
                    onClick={() =>
                      copyTextToClipboard(SUPABASE_SCHEMA_SQL, 'Supabase SQL Schema copied to clipboard!')
                    }
                    className="px-2.5 py-1 rounded bg-[#f8fafc] hover:bg-[#e4e4e7] text-[#09090b] border border-[#e4e4e7] font-bold flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5 text-[#16a34a]" />
                    <span>Copy SQL</span>
                  </button>
                </div>
                <pre className="bg-[#f8fafc] border border-[#e4e4e7] rounded-lg p-3 text-[11px] text-[#09090b] overflow-x-auto max-h-64">
                  {SUPABASE_SCHEMA_SQL}
                </pre>
              </div>

              {/* Vercel Environment Variables Guide */}
              <div className="bg-[#f8fafc] border border-[#e4e4e7] rounded-lg p-3.5 space-y-1.5">
                <div className="font-bold text-[#d97706] uppercase">
                  3. VERCEL ENVIRONMENT VARIABLES (`.env.local`)
                </div>
                <pre className="text-[11px] text-[#52525b] overflow-x-auto">
{`NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
GEMINI_API_KEY="your-google-ai-studio-gemini-key"`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}