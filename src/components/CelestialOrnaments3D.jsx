export default function CelestialOrnaments3D({ accent = 'lavender', className = '' }) {
  const palette = {
    lavender: {
      ring: '#d8b4fe',
      core: '#c084fc',
      glow: 'rgba(192, 132, 252, 0.35)',
    },
    gold: {
      ring: '#f5d08a',
      core: '#fde68a',
      glow: 'rgba(245, 208, 138, 0.38)',
    },
    blush: {
      ring: '#f9a8d4',
      core: '#fbcfe8',
      glow: 'rgba(249, 168, 212, 0.35)',
    },
  };

  const theme = palette[accent] || palette.lavender;

  return (
    <div
      aria-hidden="true"
      className={`relative flex h-12 w-12 shrink-0 items-center justify-center ${className}`}
    >
      <div
        style={{ backgroundColor: theme.glow }}
        className="pointer-events-none absolute inset-1 rounded-full blur-md"
      />
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative h-11 w-11"
      >
        <ellipse
          cx="32"
          cy="32"
          rx="24"
          ry="11"
          transform="rotate(-24 32 32)"
          stroke={theme.ring}
          strokeOpacity="0.65"
          strokeWidth="1.5"
        />
        <polygon
          points="32,12 37,27 52,32 37,37 32,52 27,37 12,32 27,27"
          fill={theme.core}
          fillOpacity="0.88"
        />
        <circle cx="32" cy="32" r="3.5" fill="#fffbeb" />
      </svg>
    </div>
  );
}