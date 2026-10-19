export const TRANSLATIONS = {
    EN: {
      personalApp: '💪 My Personal Gym App',
      ptPortal: '📋 PT & Gym Boss Portal',
      workout: 'Workout',
      nutrition: 'Nutrition',
      coach: 'AI Coach',
      progress: 'Progress',
    },
    ZH: {
      personalApp: '💪 个人健身训练',
      ptPortal: '📋 私教与馆长系统',
      workout: '训练记录',
      nutrition: '饮食与热量',
      coach: 'AI 助手',
      progress: '数据与力量',
    },
    BM: {
      personalApp: '💪 Aplikasi Gim Saya',
      ptPortal: '📋 Portal PT & Bos',
      workout: 'Latihan',
      nutrition: 'Nutrisi',
      coach: 'Jurulatih AI',
      progress: 'Rekod PR',
    },
  };
  
  export const EXERCISE_LIBRARY = [
    { name: 'Barbell Bench Press', muscle: 'Chest', equipment: 'Barbell', defaultBest: '85kg × 8' },
    { name: 'Incline Dumbbell Press', muscle: 'Chest', equipment: 'Dumbbell', defaultBest: '32.5kg × 10' },
    { name: 'Smith Machine Incline Press', muscle: 'Chest', equipment: 'Smith Machine', defaultBest: '75kg × 10' },
    { name: 'Cable Chest Fly', muscle: 'Chest', equipment: 'Cable', defaultBest: '20kg × 15' },
    { name: 'Weighted Chest Dips', muscle: 'Chest', equipment: 'Bodyweight', defaultBest: '+15kg × 10' },
    { name: 'Overhead Barbell Press (OHP)', muscle: 'Shoulders', equipment: 'Barbell', defaultBest: '55kg × 8' },
    { name: 'Dumbbell Lateral Raise', muscle: 'Shoulders', equipment: 'Dumbbell', defaultBest: '14kg × 15' },
    { name: 'Cable Rope Tricep Pushdown', muscle: 'Triceps', equipment: 'Cable', defaultBest: '27.5kg × 12' },
    { name: 'Overhead Cable Tricep Extension', muscle: 'Triceps', equipment: 'Cable', defaultBest: '25kg × 12' },
    { name: 'Lat Pulldown (Wide Grip)', muscle: 'Back', equipment: 'Cable', defaultBest: '70kg × 10' },
    { name: 'Barbell Bent-Over Row', muscle: 'Back', equipment: 'Barbell', defaultBest: '80kg × 8' },
    { name: 'Seated Cable Row', muscle: 'Back', equipment: 'Cable', defaultBest: '65kg × 12' },
    { name: 'Face Pulls', muscle: 'Shoulders', equipment: 'Cable', defaultBest: '25kg × 15' },
    { name: 'Incline Dumbbell Curl', muscle: 'Biceps', equipment: 'Dumbbell', defaultBest: '16kg × 10' },
    { name: 'Barbell Back Squat', muscle: 'Legs', equipment: 'Barbell', defaultBest: '120kg × 6' },
    { name: 'Romanian Deadlift (RDL)', muscle: 'Legs', equipment: 'Barbell', defaultBest: '110kg × 8' },
    { name: 'Leg Press (45°)', muscle: 'Legs', equipment: 'Machine', defaultBest: '200kg × 10' },
    { name: 'Seated Leg Curl', muscle: 'Legs', equipment: 'Machine', defaultBest: '55kg × 12' },
  ];
  
  export const WORKOUT_TEMPLATES = {
    'Push Day': {
      title: 'Push Day (Chest, Shoulders & Triceps)',
      exercises: [
        {
          id: 'ex-1',
          name: 'Barbell Bench Press',
          muscle: 'Chest',
          equipment: 'Barbell',
          prevBest: '85kg × 8',
          sets: [
            { id: 's-1', type: 'W', weight: 60, reps: 10, rpe: 6.5, done: true },
            { id: 's-2', type: '1', weight: 85, reps: 8, rpe: 8.5, done: true },
            { id: 's-3', type: '2', weight: 85, reps: 8, rpe: 9.0, done: false },
            { id: 's-4', type: '3', weight: 82.5, reps: 8, rpe: 9.5, done: false },
          ],
        },
        {
          id: 'ex-2',
          name: 'Smith Machine Incline Press',
          muscle: 'Chest',
          equipment: 'Smith Machine',
          prevBest: '75kg × 10',
          sets: [
            { id: 's-5', type: '1', weight: 75, reps: 10, rpe: 8.5, done: true },
            { id: 's-6', type: '2', weight: 75, reps: 9, rpe: 9.0, done: false },
            { id: 's-7', type: '3', weight: 70, reps: 10, rpe: 9.5, done: false },
          ],
        },
        {
          id: 'ex-3',
          name: 'Dumbbell Lateral Raise',
          muscle: 'Shoulders',
          equipment: 'Dumbbell',
          prevBest: '14kg × 15',
          sets: [
            { id: 's-8', type: '1', weight: 14, reps: 15, rpe: 8.5, done: false },
            { id: 's-9', type: '2', weight: 14, reps: 15, rpe: 9.0, done: false },
            { id: 's-10', type: 'D', weight: 10, reps: 15, rpe: 10, done: false },
          ],
        },
      ],
    },
    'Pull Day': {
      title: 'Pull Day (Back, Rear Delts & Biceps)',
      exercises: [
        {
          id: 'ex-p1',
          name: 'Lat Pulldown (Wide Grip)',
          muscle: 'Back',
          equipment: 'Cable',
          prevBest: '70kg × 10',
          sets: [
            { id: 'sp-1', type: 'W', weight: 50, reps: 12, rpe: 6.5, done: false },
            { id: 'sp-2', type: '1', weight: 70, reps: 10, rpe: 8.5, done: false },
            { id: 'sp-3', type: '2', weight: 70, reps: 10, rpe: 9.0, done: false },
          ],
        },
        {
          id: 'ex-p2',
          name: 'Barbell Bent-Over Row',
          muscle: 'Back',
          equipment: 'Barbell',
          prevBest: '80kg × 8',
          sets: [
            { id: 'sp-4', type: '1', weight: 80, reps: 8, rpe: 8.5, done: false },
            { id: 'sp-5', type: '2', weight: 80, reps: 8, rpe: 9.0, done: false },
          ],
        },
      ],
    },
    'Leg Day': {
      title: 'Leg Day (Quads, Hamstrings & Calves)',
      exercises: [
        {
          id: 'ex-l1',
          name: 'Barbell Back Squat',
          muscle: 'Legs',
          equipment: 'Barbell',
          prevBest: '120kg × 6',
          sets: [
            { id: 'sl-1', type: 'W', weight: 80, reps: 8, rpe: 6.5, done: false },
            { id: 'sl-2', type: '1', weight: 120, reps: 6, rpe: 8.5, done: false },
            { id: 'sl-3', type: '2', weight: 120, reps: 6, rpe: 9.0, done: false },
          ],
        },
      ],
    },
  };
  
  export const GYM_FOOD_STAPLES = [
    { name: 'Chicken Breast (150g cooked)', cal: 248, p: 46, c: 0, f: 5, slot: 'Lunch', icon: '🍗' },
    { name: 'Whole Eggs (3 Large)', cal: 215, p: 19, c: 1, f: 15, slot: 'Breakfast', icon: '🥚' },
    { name: 'Cooked White Rice (200g)', cal: 260, p: 5, c: 56, f: 0, slot: 'Lunch', icon: '🍚' },
    { name: 'Pork Noodle / Chu Yuk Fun (1 Bowl)', cal: 520, p: 34, c: 58, f: 16, slot: 'Lunch', icon: '🍜' },
    { name: 'Whey Isolate Shake (1.5 Scoop)', cal: 180, p: 38, c: 3, f: 1, slot: 'Post-Workout', icon: '🥤' },
    { name: 'Rolled Oats (80g dry)', cal: 304, p: 11, c: 54, f: 5, slot: 'Breakfast', icon: '🥣' },
    { name: 'Grilled Salmon (150g)', cal: 312, p: 34, c: 0, f: 19, slot: 'Dinner', icon: '🐟' },
    { name: 'Egg Whites (200g)', cal: 104, p: 22, c: 1, f: 0, slot: 'Breakfast', icon: '🍳' },
  ];
  
  export const COACH_QUICK_PROMPTS = [
    'Analyze my workout volume & RPE today',
    'What should I eat post-workout to hit my protein?',
    'How do I break my 85kg Bench Press plateau?',
    'Check if my Push/Pull/Legs volume is balanced',
  ];
  
  export const calc1RM = (weight, reps) => {
    const w = Number(weight) || 0;
    const r = Number(reps) || 0;
    if (w <= 0 || r <= 0) return 0;
    if (r === 1) return Math.round(w);
    return Math.round(w * (1 + r / 30));
  };
  
  export const formatDuration = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };