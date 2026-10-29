import React from 'react';

// Automatically maps exercise names to their primary and secondary muscle groups
export function getExerciseMuscles(exerciseName = '', fallbackMuscle = 'Chest') {
  const n = exerciseName.toLowerCase();
  if (n.includes('incline')) return { primary: ['upper_chest'], secondary: ['front_delts', 'triceps'] };
  if (n.includes('bench') || n.includes('chest') || n.includes('fly') || n.includes('push'))
    return { primary: ['chest'], secondary: ['triceps', 'front_delts'] };
  if (n.includes('squat') || n.includes('leg press') || n.includes('extension'))
    return { primary: ['quads', 'glutes'], secondary: ['hamstrings'] };
  if (n.includes('deadlift') || n.includes('rdl') || n.includes('leg curl'))
    return { primary: ['hamstrings', 'glutes'], secondary: ['lower_back'] };
  if (n.includes('row') || n.includes('pull') || n.includes('lat'))
    return { primary: ['lats', 'upper_back'], secondary: ['biceps'] };
  if (n.includes('overhead') || n.includes('shoulder') || n.includes('lateral'))
    return { primary: ['shoulders'], secondary: ['triceps'] };
  if (n.includes('curl')) return { primary: ['biceps'], secondary: ['forearms'] };
  if (n.includes('tricep') || n.includes('pushdown') || n.includes('dip'))
    return { primary: ['triceps'], secondary: ['chest'] };
  return { primary: [fallbackMuscle.toLowerCase()], secondary: [] };
}

// Renders the 3D-style exercise movement illustrations
export default function AnatomyIllustration({
  exerciseName = '',
  imageUrl = null,
  size = 'md',
}) {
  const dim = size === 'lg' ? 'w-full h-full' : size === 'sm' ? 'w-12 h-12' : 'w-16 h-16';

  // If a custom image URL is provided in the exercise data, use it directly
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={exerciseName}
        className={`${dim} object-contain rounded-xl`}
      />
    );
  }

  const name = exerciseName.toLowerCase();

  // 1. Incline Press Illustration
  if (name.includes('incline')) {
    return (
      <svg viewBox="0 0 120 100" className={dim} fill="none">
        <path d="M75 15 L82 88 M88 20 L95 88" stroke="#CBD5E1" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M25 85 L85 85 M35 85 L40 70 M72 85 L72 52" stroke="#64748B" strokeWidth="3" />
        <path d="M26 72 L48 72 L78 42" stroke="#1E293B" strokeWidth="6" strokeLinecap="round" />
        <path d="M28 70 L16 86 M46 68 L68 46" stroke="#94A3B8" strokeWidth="6" strokeLinecap="round" />
        <circle cx="75" cy="36" r="6.5" fill="#94A3B8" />
        <path d="M56 58 Q65 48 71 46" stroke="#EA580C" strokeWidth="7" strokeLinecap="round" />
        <path d="M64 50 L62 26" stroke="#EF4444" strokeWidth="4.5" strokeLinecap="round" />
        <line x1="38" y1="24" x2="96" y2="24" stroke="#334155" strokeWidth="3" />
        <ellipse cx="46" cy="24" rx="5" ry="12" fill="#0F172A" />
        <ellipse cx="86" cy="24" rx="5" ry="12" fill="#0F172A" />
      </svg>
    );
  }

  // 2. Flat Bench Press Illustration
  if (name.includes('bench') || name.includes('chest') || name.includes('press')) {
    return (
      <svg viewBox="0 0 120 100" className={dim} fill="none">
        <path d="M72 16 L78 82 M90 12 L96 76" stroke="#CBD5E1" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M26 68 L26 88 M76 58 L76 80" stroke="#94A3B8" strokeWidth="3.5" />
        <path d="M18 66 L84 52" stroke="#1E293B" strokeWidth="8" strokeLinecap="round" />
        <path d="M22 64 L12 85" stroke="#94A3B8" strokeWidth="6" strokeLinecap="round" />
        <path d="M25 61 L72 51" stroke="#CBD5E1" strokeWidth="8" strokeLinecap="round" />
        <circle cx="81" cy="47" r="6" fill="#94A3B8" />
        <path d="M52 55 Q64 47 73 50" fill="#DC2626" stroke="#DC2626" strokeWidth="6" strokeLinecap="round" />
        <path d="M66 51 L64 30" stroke="#EA580C" strokeWidth="5" strokeLinecap="round" />
        <line x1="36" y1="24" x2="102" y2="38" stroke="#334155" strokeWidth="3.5" />
        <ellipse cx="45" cy="26" rx="6" ry="13" fill="#1E293B" />
        <ellipse cx="90" cy="35" rx="6" ry="13" fill="#1E293B" />
      </svg>
    );
  }

  // 3. Squat / Leg Exercise Illustration
  if (name.includes('squat') || name.includes('leg') || name.includes('lunge')) {
    return (
      <svg viewBox="0 0 120 100" className={dim} fill="none">
        <path d="M30 12 L30 90 M88 12 L88 90 M22 90 L98 90" stroke="#CBD5E1" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="60" cy="22" r="6.5" fill="#94A3B8" />
        <path d="M58 30 L48 56" stroke="#94A3B8" strokeWidth="8" strokeLinecap="round" />
        <path d="M46 56 L68 62" stroke="#DC2626" strokeWidth="8" strokeLinecap="round" />
        <path d="M68 62 L62 86" stroke="#94A3B8" strokeWidth="6" strokeLinecap="round" />
        <line x1="20" y1="30" x2="100" y2="30" stroke="#1E293B" strokeWidth="3.5" />
        <rect x="26" y="18" width="6" height="24" rx="2" fill="#0F172A" />
        <rect x="88" y="18" width="6" height="24" rx="2" fill="#0F172A" />
      </svg>
    );
  }

  // 4. Pull / Back / Row Illustration
  if (name.includes('pull') || name.includes('row') || name.includes('lat') || name.includes('back')) {
    return (
      <svg viewBox="0 0 120 100" className={dim} fill="none">
        <path d="M88 10 L88 90 M50 12 L88 12" stroke="#CBD5E1" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="58" y1="12" x2="58" y2="34" stroke="#64748B" strokeWidth="2" />
        <path d="M36 36 L80 36" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="58" cy="45" r="6" fill="#94A3B8" />
        <path d="M48 54 L58 76 L68 54 Z" fill="#DC2626" />
        <path d="M48 55 L40 36 M68 55 L76 36" stroke="#EA580C" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M42 78 L74 78 M58 78 L58 90" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
      </svg>
    );
  }

  // 5. Default Dumbbell / Arm / Shoulder Illustration
  return (
    <svg viewBox="0 0 120 100" className={dim} fill="none">
      <circle cx="60" cy="24" r="7" fill="#94A3B8" />
      <path d="M48 36 L72 36 L68 78 L52 78 Z" fill="#CBD5E1" />
      <circle cx="45" cy="40" r="6" fill="#DC2626" />
      <circle cx="75" cy="40" r="6" fill="#DC2626" />
      <path d="M44 42 L34 26 M76 42 L86 26" stroke="#EA580C" strokeWidth="5.5" strokeLinecap="round" />
      <path d="M24 24 L42 24 M78 24 L96 24" stroke="#0F172A" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

// Icon renderer for the Heatmap component
export function MusclePartIcon({ name, isActive }) {
  const color = isActive ? '#EA580C' : '#CBD5E1';

  const renderShape = () => {
    const n = name.toLowerCase();
    if (n.includes('chest') || n.includes('pecs')) {
      return <path d="M12 4 C 18 4, 20 8, 20 12 C 20 16, 12 20, 12 20 C 12 20, 4 16, 4 12 C 4 8, 6 4, 12 4 Z" fill={color} />;
    }
    if (n.includes('back') || n.includes('lat')) {
      return <path d="M12 2 L18 10 L14 22 L10 22 L6 10 Z" fill={color} />;
    }
    if (n.includes('leg') || n.includes('quad') || n.includes('ham') || n.includes('calf') || n.includes('glute')) {
      return <path d="M8 2 L16 2 L14 22 L10 22 Z" fill={color} />;
    }
    if (n.includes('shoulder') || n.includes('delt')) {
      return <circle cx="12" cy="12" r="8" fill={color} />;
    }
    if (n.includes('arm') || n.includes('bicep') || n.includes('tricep') || n.includes('forearm')) {
      return <rect x="8" y="2" width="8" height="20" rx="4" fill={color} />;
    }
    if (n.includes('core') || n.includes('abs')) {
      return (
        <g fill={color}>
          <rect x="8" y="4" width="3" height="4" rx="1" />
          <rect x="13" y="4" width="3" height="4" rx="1" />
          <rect x="8" y="10" width="3" height="4" rx="1" />
          <rect x="13" y="10" width="3" height="4" rx="1" />
          <rect x="8" y="16" width="3" height="4" rx="1" />
          <rect x="13" y="16" width="3" height="4" rx="1" />
        </g>
      );
    }
    return <circle cx="12" cy="12" r="8" fill={color} />;
  };

  return (
    <svg viewBox="0 0 24 24" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {renderShape()}
    </svg>
  );
}