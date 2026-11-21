export function CelestialMoon({ className = '' }) {
  return (
    <svg
      viewBox="0 0 260 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <radialGradient id="moonHalo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f5d08a" stopOpacity="0.45" />
          <stop offset="55%" stopColor="#d8b4fe" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#0b0716" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="moonBody" x1="40" y1="30" x2="210" y2="220" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="55%" stopColor="#f5d08a" />
          <stop offset="100%" stopColor="#e9d5ff" />
        </linearGradient>
      </defs>
      <circle cx="130" cy="130" r="126" fill="url(#moonHalo)" />
      <path
        d="M158 46C113.817 46 78 81.8172 78 126C78 170.183 113.817 206 158 206C174.167 206 189.217 201.205 201.8 192.961C186.245 209.61 164.087 220 139.5 220C92.2797 220 54 181.72 54 134.5C54 87.2797 92.2797 49 139.5 49C145.847 49 152.033 49.6918 158 51.0041V46Z"
        fill="url(#moonBody)"
      />
      <circle cx="182" cy="78" r="3" fill="#fffbeb" opacity="0.9" />
      <circle cx="198" cy="112" r="2" fill="#e9d5ff" opacity="0.8" />
    </svg>
  );
}

export function FloatingIsland({ className = '', variant = 'left' }) {
  const isLeft = variant === 'left';
  return (
    <svg
      viewBox="0 0 360 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient id={`rockGrad-${variant}`} x1="180" y1="90" x2="180" y2="245" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3b236b" />
          <stop offset="55%" stopColor="#211242" />
          <stop offset="100%" stopColor="#110924" />
        </linearGradient>
        <linearGradient id={`meadowGrad-${variant}`} x1="60" y1="80" x2="300" y2="115" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#c084fc" stopOpacity="0.65" />
          <stop offset="50%" stopColor="#f9a8d4" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#e9d5ff" stopOpacity="0.7" />
        </linearGradient>
      </defs>

      {/* Island underside */}
      <path
        d={
          isLeft
            ? 'M42 104C95 92 265 92 318 104L266 176L214 238L168 192L122 224L84 162L42 104Z'
            : 'M48 106C110 92 252 92 312 106L272 168L226 228L182 186L138 234L94 170L48 106Z'
        }
        fill={`url(#rockGrad-${variant})`}
      />

      {/* Glowing top rim */}
      <ellipse cx="180" cy="103" rx="138" ry="16" fill={`url(#meadowGrad-${variant})`} />

      {/* Fantasy spires / crystals */}
      {isLeft ? (
        <g opacity="0.88">
          <polygon points="118,98 130,52 142,98" fill="#e9d5ff" />
          <polygon points="138,100 154,38 168,100" fill="#f5d08a" opacity="0.85" />
          <polygon points="164,100 174,64 185,100" fill="#f9a8d4" />
        </g>
      ) : (
        <g opacity="0.88">
          <polygon points="192,100 206,44 220,100" fill="#f5d08a" opacity="0.85" />
          <polygon points="218,99 229,62 241,99" fill="#e9d5ff" />
          <circle cx="152" cy="84" r="14" fill="#c084fc" opacity="0.45" />
          <circle cx="166" cy="88" r="10" fill="#f9a8d4" opacity="0.45" />
        </g>
      )}
    </svg>
  );
}

export function MistCloud({ className = '' }) {
  return (
    <svg
      viewBox="0 0 420 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient id="cloudMist" x1="210" y1="10" x2="210" y2="115" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#e9d5ff" stopOpacity="0.24" />
          <stop offset="100%" stopColor="#1f143d" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M35 95C15 95 5 82 14 68C22 55 42 54 55 58C64 34 96 22 126 32C145 14 186 12 212 28C236 16 276 20 294 40C318 34 348 44 358 64C380 64 402 76 396 90C390 102 365 104 340 104H65C50 104 42 100 35 95Z"
        fill="url(#cloudMist)"
      />
    </svg>
  );
}

export function ForegroundBlossom({ className = '', flip = false }) {
  return (
    <svg
      viewBox="0 0 220 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={`${flip ? '-scale-x-100' : ''} ${className}`}
    >
      <defs>
        <radialGradient id="petalGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fbcfe8" stopOpacity="0.95" />
          <stop offset="70%" stopColor="#c084fc" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#2e1d59" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Stem & leaves */}
      <path
        d="M28 216C48 164 84 128 134 94"
        stroke="#c084fc"
        strokeOpacity="0.45"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M68 158C44 142 36 122 56 112C74 104 86 128 68 158Z"
        fill="#a855f7"
        fillOpacity="0.32"
      />
      <path
        d="M96 126C118 134 138 124 134 106C130 90 108 98 96 126Z"
        fill="#f9a8d4"
        fillOpacity="0.32"
      />

      {/* Luminous flower */}
      <g transform="translate(136, 90)">
        <circle cx="0" cy="0" r="46" fill="url(#petalGlow)" />
        {[0, 72, 144, 216, 288].map((angle) => (
          <ellipse
            key={angle}
            cx="0"
            cy="-18"
            rx="10"
            ry="20"
            transform={`rotate(${angle})`}
            fill="#fbcfe8"
            fillOpacity="0.72"
          />
        ))}
        <circle cx="0" cy="0" r="7" fill="#f5d08a" />
      </g>
    </svg>
  );
}