import React from 'react';

// Exact Primary (Deep Red) & Secondary (Coral Pink) anatomical mapping for every exercise
export const EXERCISE_MUSCLE_MAP = {
  'Barbell Bench Press': { primary: ['chest'], secondary: ['front_delts', 'triceps'] },
  'Incline Dumbbell Press': { primary: ['chest', 'front_delts'], secondary: ['triceps'] },
  'Smith Machine Incline Press': { primary: ['chest', 'front_delts'], secondary: ['triceps'] },
  'Cable Chest Fly': { primary: ['chest'], secondary: ['front_delts'] },
  'Weighted Chest Dips': { primary: ['chest', 'triceps'], secondary: ['front_delts'] },
  'Overhead Barbell Press (OHP)': { primary: ['front_delts', 'side_delts'], secondary: ['triceps', 'traps', 'abs'] },
  'Seated Dumbbell Shoulder Press': { primary: ['front_delts', 'side_delts'], secondary: ['triceps'] },
  'Dumbbell Lateral Raise': { primary: ['side_delts'], secondary: ['front_delts', 'traps'] },
  'Cable Rope Tricep Pushdown': { primary: ['triceps'], secondary: ['forearms'] },
  'Overhead Cable Tricep Extension': { primary: ['triceps'], secondary: ['forearms'] },
  'Skullcrushers (EZ-Bar)': { primary: ['triceps'], secondary: ['forearms'] },
  'Lat Pulldown (Wide Grip)': { primary: ['lats'], secondary: ['biceps', 'rear_delts', 'traps', 'forearms'] },
  'Barbell Bent-Over Row': { primary: ['lats', 'traps', 'lower_back'], secondary: ['biceps', 'rear_delts', 'hamstrings'] },
  'Chest-Supported T-Bar Row': { primary: ['lats', 'traps'], secondary: ['biceps', 'rear_delts'] },
  'Seated Cable Row': { primary: ['lats', 'traps'], secondary: ['biceps', 'rear_delts', 'lower_back'] },
  'Face Pulls': { primary: ['rear_delts', 'traps'], secondary: ['biceps'] },
  'Incline Dumbbell Curl': { primary: ['biceps'], secondary: ['forearms'] },
  'Barbell EZ-Bar Curl': { primary: ['biceps'], secondary: ['forearms'] },
  'Hammer Curls': { primary: ['biceps', 'forearms'], secondary: [] },
  'Barbell Back Squat': { primary: ['quads', 'glutes', 'adductors', 'lower_back'], secondary: ['calves', 'hamstrings', 'abs'] },
  'Smith Machine Squat': { primary: ['quads', 'glutes'], secondary: ['adductors', 'calves'] },
  'Romanian Deadlift (RDL)': { primary: ['hamstrings', 'glutes', 'lower_back'], secondary: ['forearms', 'traps', 'calves'] },
  'Leg Press (45°)': { primary: ['quads', 'glutes', 'adductors'], secondary: ['calves', 'hamstrings'] },
  'Seated Leg Curl': { primary: ['hamstrings'], secondary: ['calves'] },
  'Leg Extension': { primary: ['quads'], secondary: [] },
  'Standing Calf Raise': { primary: ['calves'], secondary: [] },
};

// Fallback if user adds a custom exercise name
export function getExerciseMuscles(exerciseName = '', fallbackMuscle = 'Chest') {
  if (EXERCISE_MUSCLE_MAP[exerciseName]) {
    return EXERCISE_MUSCLE_MAP[exerciseName];
  }
  const lower = exerciseName.toLowerCase();
  if (lower.includes('squat') || lower.includes('lunge') || lower.includes('leg press')) {
    return { primary: ['quads', 'glutes', 'adductors', 'lower_back'], secondary: ['calves', 'hamstrings'] };
  }
  if (lower.includes('deadlift') || lower.includes('rdl') || lower.includes('hip thrust')) {
    return { primary: ['hamstrings', 'glutes', 'lower_back'], secondary: ['traps', 'forearms', 'calves'] };
  }
  if (lower.includes('bench') || lower.includes('chest') || lower.includes('fly') || lower.includes('push')) {
    return { primary: ['chest'], secondary: ['front_delts', 'triceps'] };
  }
  if (lower.includes('row') || lower.includes('pull') || lower.includes('lat')) {
    return { primary: ['lats', 'traps'], secondary: ['biceps', 'rear_delts', 'lower_back'] };
  }
  if (lower.includes('shoulder') || lower.includes('ohp') || lower.includes('lateral')) {
    return { primary: ['front_delts', 'side_delts'], secondary: ['triceps', 'traps'] };
  }
  if (lower.includes('curl') || lower.includes('bicep')) {
    return { primary: ['biceps'], secondary: ['forearms'] };
  }
  if (lower.includes('tricep') || lower.includes('extension') || lower.includes('dip')) {
    return { primary: ['triceps'], secondary: ['front_delts'] };
  }

  // Fallback by muscle category
  const catMap = {
    Chest: { primary: ['chest'], secondary: ['front_delts', 'triceps'] },
    Back: { primary: ['lats', 'traps'], secondary: ['biceps', 'lower_back'] },
    Shoulders: { primary: ['front_delts', 'side_delts'], secondary: ['rear_delts', 'traps'] },
    Legs: { primary: ['quads', 'glutes', 'adductors'], secondary: ['hamstrings', 'calves'] },
    Triceps: { primary: ['triceps'], secondary: ['forearms'] },
    Biceps: { primary: ['biceps'], secondary: ['forearms'] },
  };
  return catMap[fallbackMuscle] || { primary: ['chest'], secondary: ['triceps'] };
}

export default function AnatomyIllustration({
  exerciseName,
  fallbackMuscle,
  customPrimary = null,
  customSecondary = null,
  size = 'md', // 'sm' | 'md' | 'lg'
}) {
  const mapped = getExerciseMuscles(exerciseName, fallbackMuscle);
  const primaryList = customPrimary || mapped.primary;
  const secondaryList = customSecondary || mapped.secondary;

  // Exact colors from your reference image:
  // Deep Crimson Red (#BD1E1E) for Primary, Coral Pink (#FF8A8A) for Secondary, Neutral Grey (#969696) for Inactive
  const fillFor = (id) => {
    if (primaryList.includes(id)) return '#BD1E1E';
    if (secondaryList.includes(id)) return '#FF8A8A';
    return '#969696';
  };

  const sizeClasses =
    size === 'sm'
      ? 'w-28 h-28'
      : size === 'lg'
      ? 'w-64 h-64 sm:w-72 sm:h-72'
      : 'w-40 h-40 sm:w-44 sm:h-44';

  return (
    <div className={`inline-flex items-center justify-center select-none ${sizeClasses}`}>
      <svg
        viewBox="0 0 420 440"
        className="w-full h-full drop-shadow-2xs"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ===================================================================
            LEFT FIGURE: ANTERIOR (FRONT ANATOMY)
        =================================================================== */}
        <g transform="translate(10, 10)">
          {/* Black Head, Neck, Hands & Feet Base Silhouette */}
          <path
            d="M85,12 C100,12 110,24 110,42 C110,58 102,70 96,76 L102,88 L68,88 L74,76 C68,70 60,58 60,42 C60,24 70,12 85,12 Z"
            fill="#0A0A0A"
          />
          {/* Ears */}
          <ellipse cx="59" cy="45" rx="3" ry="6" fill="#0A0A0A" />
          <ellipse cx="111" cy="45" rx="3" ry="6" fill="#0A0A0A" />

          {/* Traps (Front) */}
          <path
            d="M68,86 L46,96 L64,102 L75,88 Z M102,86 L124,96 L106,102 L95,88 Z"
            fill={fillFor('traps')}
            stroke="#0A0A0A"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Chest / Pectorals (Left & Right) */}
          <path
            d="M48,98 L84,102 L84,142 C70,145 55,142 46,128 Z"
            fill={fillFor('chest')}
            stroke="#0A0A0A"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <path
            d="M122,98 L86,102 L86,142 C100,145 115,142 124,128 Z"
            fill={fillFor('chest')}
            stroke="#0A0A0A"
            strokeWidth="4"
            strokeLinejoin="round"
          />

          {/* Front & Side Deltoids (Shoulders) */}
          <path
            d="M46,96 C32,100 25,114 27,134 C34,136 42,132 47,124 Z"
            fill={fillFor('front_delts')}
            stroke="#0A0A0A"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <path
            d="M124,96 C138,100 145,114 143,134 C136,136 128,132 123,124 Z"
            fill={fillFor('front_delts')}
            stroke="#0A0A0A"
            strokeWidth="4"
            strokeLinejoin="round"
          />

          {/* Biceps (Left & Right) */}
          <path
            d="M27,135 C22,148 22,162 25,172 C33,174 40,168 43,154 L46,128 Z"
            fill={fillFor('biceps')}
            stroke="#0A0A0A"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <path
            d="M143,135 C148,148 148,162 145,172 C137,174 130,168 127,154 L124,128 Z"
            fill={fillFor('biceps')}
            stroke="#0A0A0A"
            strokeWidth="4"
            strokeLinejoin="round"
          />

          {/* Forearms (Left & Right) */}
          <path
            d="M24,173 C16,188 14,205 14,220 L25,222 C32,208 38,190 41,173 Z"
            fill={fillFor('forearms')}
            stroke="#0A0A0A"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <path
            d="M146,173 C154,188 156,205 156,220 L145,222 C138,208 132,190 129,173 Z"
            fill={fillFor('forearms')}
            stroke="#0A0A0A"
            strokeWidth="4"
            strokeLinejoin="round"
          />

          {/* Black Hands Silhouette */}
          <path d="M13,221 L6,236 L12,248 L24,244 L26,223 Z" fill="#0A0A0A" />
          <path d="M157,221 L164,236 L158,248 L146,244 L144,223 Z" fill="#0A0A0A" />

          {/* Core / 6-Pack Abs & Obliques */}
          <g fill={fillFor('abs')} stroke="#0A0A0A" strokeWidth="3.8" strokeLinejoin="round">
            {/* Upper Abs */}
            <rect x="64" y="143" width="19" height="17" rx="4" />
            <rect x="87" y="143" width="19" height="17" rx="4" />
            {/* Mid Abs */}
            <rect x="64" y="162" width="19" height="17" rx="4" />
            <rect x="87" y="162" width="19" height="17" rx="4" />
            {/* Lower Abs */}
            <path d="M65,181 L83,181 L83,210 L69,205 Z" />
            <path d="M105,181 L87,181 L87,210 L101,205 Z" />
            {/* Side Obliques */}
            <path d="M48,134 L62,145 L62,198 L49,185 Z" />
            <path d="M122,134 L108,145 L108,198 L121,185 Z" />
          </g>

          {/* Adductors (Inner Thighs) */}
          <path
            d="M66,208 L83,215 L77,275 L66,255 Z"
            fill={fillFor('adductors')}
            stroke="#0A0A0A"
            strokeWidth="3.5"
          />
          <path
            d="M104,208 L87,215 L93,275 L104,255 Z"
            fill={fillFor('adductors')}
            stroke="#0A0A0A"
            strokeWidth="3.5"
          />

          {/* Quadriceps (Teardrop Vastus Medialis, Rectus Femoris, Vastus Lateralis) */}
          <g fill={fillFor('quads')} stroke="#0A0A0A" strokeWidth="4" strokeLinejoin="round">
            {/* Left Leg Quads */}
            <path d="M48,192 C38,225 40,265 48,298 C56,296 62,282 65,260 L64,205 Z" />
            <path d="M64,208 C60,240 60,275 64,302 C72,302 78,292 78,275 L74,215 Z" />
            {/* Right Leg Quads */}
            <path d="M122,192 C132,225 130,265 122,298 C114,296 108,282 105,260 L106,205 Z" />
            <path d="M106,208 C110,240 110,275 106,302 C98,302 92,292 92,275 L96,215 Z" />
          </g>

          {/* Black Knee Joint & Shins Frame */}
          <path
            d="M48,296 L77,298 L74,318 L49,316 Z M93,298 L122,296 L121,316 L96,318 Z"
            fill="#0A0A0A"
          />

          {/* Front Calves (Gastrocnemius / Tibialis Anterior) */}
          <g fill={fillFor('calves')} stroke="#0A0A0A" strokeWidth="3.8" strokeLinejoin="round">
            {/* Inner Medial Strip (Highlighted in Squat reference) */}
            <path d="M67,318 C75,335 75,360 69,385 L62,385 C62,360 62,335 67,318 Z" />
            <path d="M103,318 C95,335 95,360 101,385 L108,385 C108,360 108,335 103,318 Z" />
          </g>
          {/* Outer Shin Neutral */}
          <path
            d="M49,316 C43,340 46,368 53,392 L62,390 L64,318 Z M121,316 C127,340 124,368 117,392 L108,390 L106,318 Z"
            fill="#969696"
            stroke="#0A0A0A"
            strokeWidth="3.8"
          />

          {/* Black Feet Silhouette */}
          <path d="M51,390 L38,412 L68,415 L66,390 Z" fill="#0A0A0A" />
          <path d="M119,390 L132,412 L102,415 L104,390 Z" fill="#0A0A0A" />
        </g>

        {/* ===================================================================
            RIGHT FIGURE: POSTERIOR (BACK ANATOMY)
        =================================================================== */}
        <g transform="translate(220, 10)">
          {/* Black Head Silhouette */}
          <path
            d="M85,12 C100,12 110,24 110,42 C110,58 102,70 96,76 L102,86 L68,86 L74,76 C68,70 60,58 60,42 C60,24 70,12 85,12 Z"
            fill="#0A0A0A"
          />
          <ellipse cx="59" cy="45" rx="3" ry="6" fill="#0A0A0A" />
          <ellipse cx="111" cy="45" rx="3" ry="6" fill="#0A0A0A" />

          {/* Traps (Upper & Mid Trapezius Diamond) */}
          <path
            d="M68,84 L45,96 L65,112 L83,148 L83,84 Z M102,84 L125,96 L105,112 L87,148 L87,84 Z"
            fill={fillFor('traps')}
            stroke="#0A0A0A"
            strokeWidth="4"
            strokeLinejoin="round"
          />

          {/* Rear Delts (Posterior Shoulders) */}
          <path
            d="M45,96 C30,100 25,114 28,132 L49,124 L62,110 Z"
            fill={fillFor('rear_delts')}
            stroke="#0A0A0A"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <path
            d="M125,96 C140,100 145,114 142,132 L121,124 L108,110 Z"
            fill={fillFor('rear_delts')}
            stroke="#0A0A0A"
            strokeWidth="4"
            strokeLinejoin="round"
          />

          {/* Lats (Latissimus Dorsi V-Taper) */}
          <path
            d="M49,124 L65,114 L82,150 L68,185 L50,168 Z"
            fill={fillFor('lats')}
            stroke="#0A0A0A"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <path
            d="M121,124 L105,114 L88,150 L102,185 L120,168 Z"
            fill={fillFor('lats')}
            stroke="#0A0A0A"
            strokeWidth="4"
            strokeLinejoin="round"
          />

          {/* Lower Back (Erector Spinae / Lumbar) - Highlighted Red in Squat/Deadlift */}
          <path
            d="M82,150 L68,185 L82,202 Z M88,150 L102,185 L88,202 Z"
            fill={fillFor('lower_back')}
            stroke="#0A0A0A"
            strokeWidth="4"
            strokeLinejoin="round"
          />

          {/* Triceps (Horseshoe Lateral & Long Head) */}
          <path
            d="M28,133 C22,148 22,164 25,174 L42,172 L48,126 Z"
            fill={fillFor('triceps')}
            stroke="#0A0A0A"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <path
            d="M142,133 C148,148 148,164 145,174 L128,172 L122,126 Z"
            fill={fillFor('triceps')}
            stroke="#0A0A0A"
            strokeWidth="4"
            strokeLinejoin="round"
          />

          {/* Forearms (Back) */}
          <path
            d="M24,175 C16,190 14,206 14,220 L25,222 C33,206 39,190 42,174 Z"
            fill={fillFor('forearms')}
            stroke="#0A0A0A"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <path
            d="M146,175 C154,190 156,206 156,220 L145,222 C137,206 131,190 128,174 Z"
            fill={fillFor('forearms')}
            stroke="#0A0A0A"
            strokeWidth="4"
            strokeLinejoin="round"
          />

          {/* Black Hands Silhouette */}
          <path d="M13,221 L6,236 L12,248 L24,244 L26,223 Z" fill="#0A0A0A" />
          <path d="M157,221 L164,236 L158,248 L146,244 L144,223 Z" fill="#0A0A0A" />

          {/* Glutes (Gluteus Maximus Butterfly Shape) */}
          <path
            d="M50,186 L83,202 L83,240 C66,244 48,236 44,214 Z"
            fill={fillFor('glutes')}
            stroke="#0A0A0A"
            strokeWidth="4.2"
            strokeLinejoin="round"
          />
          <path
            d="M120,186 L87,202 L87,240 C104,244 122,236 126,214 Z"
            fill={fillFor('glutes')}
            stroke="#0A0A0A"
            strokeWidth="4.2"
            strokeLinejoin="round"
          />

          {/* Adductor Magnus / Inner Posterior Thigh */}
          <path
            d="M70,242 L83,242 L77,292 L69,282 Z M100,242 L87,242 L93,292 L101,282 Z"
            fill={fillFor('adductors')}
            stroke="#0A0A0A"
            strokeWidth="3.5"
          />

          {/* Hamstrings (Biceps Femoris & Semitendinosus) */}
          <path
            d="M46,228 C42,254 45,280 51,302 L70,296 L69,242 Z"
            fill={fillFor('hamstrings')}
            stroke="#0A0A0A"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <path
            d="M124,228 C128,254 125,280 119,302 L100,296 L101,242 Z"
            fill={fillFor('hamstrings')}
            stroke="#0A0A0A"
            strokeWidth="4"
            strokeLinejoin="round"
          />

          {/* Calves (Two-Headed Gastrocnemius + Lower Soleus - Exact Coral Pink / Red Match) */}
          <g fill={fillFor('calves')} stroke="#0A0A0A" strokeWidth="3.8" strokeLinejoin="round">
            {/* Left Calf */}
            <path d="M49,306 C42,324 43,344 50,356 L61,356 L61,306 Z" />
            <path d="M62,306 C70,324 69,344 62,356 L51,356 L62,306 Z" />
            <path d="M50,358 L64,358 L59,394 L54,394 Z" />
            {/* Right Calf */}
            <path d="M109,306 C102,324 103,344 110,356 L121,356 L121,306 Z" />
            <path d="M121,306 C128,324 127,344 120,356 L109,356 L121,306 Z" />
            <path d="M106,358 L120,358 L116,394 L111,394 Z" />
          </g>

          {/* Black Feet Silhouette */}
          <path d="M51,392 L38,412 L68,415 L66,392 Z" fill="#0A0A0A" />
          <path d="M119,392 L132,412 L102,415 L104,392 Z" fill="#0A0A0A" />
        </g>
      </svg>
    </div>
  );
}