import React, { useState } from 'react';

interface PlateVisualProps {
  code: string;
  shape: 'Square' | 'Round';
  name: string;
  imageFileName?: string;
  customImageUrl?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const PlateVisual: React.FC<PlateVisualProps> = ({
  code,
  shape,
  name,
  imageFileName,
  customImageUrl,
  className = '',
  size = 'md'
}) => {
  const [imgError, setImgError] = useState(false);

  // If user provided a base64 custom uploaded image in admin or valid external url
  if (customImageUrl && !imgError) {
    return (
      <div className={`relative overflow-hidden flex items-center justify-center ${className}`}>
        <img
          src={customImageUrl}
          alt={name}
          className="w-full h-full object-contain drop-shadow-md transition-transform duration-300 hover:scale-105"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  // If imageFileName is provided (e.g. /plate1.jpg.jpeg), attempt to render it if available
  const directPath = imageFileName ? (imageFileName.startsWith('/') ? imageFileName : `/${imageFileName}`) : null;

  return (
    <div className={`relative flex items-center justify-center p-2 group ${className}`}>
      {directPath && !imgError ? (
        <img
          src={directPath}
          alt={name}
          className="w-full h-full object-contain drop-shadow-md z-10 transition-transform duration-300 group-hover:scale-105"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
        />
      ) : (
        /* High-Fidelity Vector Render matching user's exact uploaded reference photos */
        <div className="w-full h-full flex items-center justify-center">
          {renderAuthenticPlateSvg(code, shape, name)}
        </div>
      )}
    </div>
  );
};

function renderAuthenticPlateSvg(code: string, shape: 'Square' | 'Round', name: string) {
  const plateCode = (code || '').toLowerCase();

  // Plate 1: Square Tropical Green Leaf Pattern
  if (plateCode.includes('plate1') || plateCode === '1') {
    return (
      <svg
        viewBox="0 0 300 300"
        className="w-full h-full drop-shadow-lg transition-transform duration-300 group-hover:scale-105"
        role="img"
        aria-label={name}
      >
        <defs>
          <radialGradient id="p1-rim-shadow" cx="50%" cy="50%" r="50%">
            <stop offset="65%" stopColor="#1e3a17" stopOpacity="0.25" />
            <stop offset="92%" stopColor="#152b10" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#0b1709" stopOpacity="0.75" />
          </radialGradient>
          <linearGradient id="p1-glaze" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="35%" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="70%" stopColor="#000000" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.15" />
          </linearGradient>
          <pattern id="tropical-leaf-pattern" width="90" height="90" patternUnits="userSpaceOnUse">
            {/* Base pale green */}
            <rect width="90" height="90" fill="#9bd76b" />
            {/* Heart/Monstera leaf 1 */}
            <path
              d="M 45 8 C 30 2, 10 20, 18 45 C 24 60, 45 75, 45 80 C 45 75, 66 60, 72 45 C 80 20, 60 2, 45 8 Z"
              fill="#74bc43"
              stroke="#2e6417"
              strokeWidth="2"
            />
            {/* Veins */}
            <path d="M 45 12 L 45 75" stroke="#235210" strokeWidth="1.5" />
            <path d="M 45 25 Q 30 20 22 28" stroke="#235210" strokeWidth="1.2" fill="none" />
            <path d="M 45 25 Q 60 20 68 28" stroke="#235210" strokeWidth="1.2" fill="none" />
            <path d="M 45 40 Q 28 35 24 45" stroke="#235210" strokeWidth="1.2" fill="none" />
            <path d="M 45 40 Q 62 35 66 45" stroke="#235210" strokeWidth="1.2" fill="none" />
            <path d="M 45 55 Q 32 50 28 60" stroke="#235210" strokeWidth="1.2" fill="none" />
            <path d="M 45 55 Q 58 50 62 60" stroke="#235210" strokeWidth="1.2" fill="none" />
            {/* Offset small leaves */}
            <path
              d="M 5 70 C -5 60, -5 85, 8 92 C 16 95, 20 85, 16 78 C 12 70, 8 68, 5 70 Z"
              fill="#82c74d"
              stroke="#285a14"
              strokeWidth="1.2"
            />
            <path
              d="M 85 10 C 75 0, 95 -5, 98 12 C 100 20, 90 22, 85 18 Z"
              fill="#82c74d"
              stroke="#285a14"
              strokeWidth="1.2"
            />
          </pattern>
        </defs>

        {/* Outer Square Plate with rounded corner rim */}
        <rect x="15" y="15" width="270" height="270" rx="36" fill="url(#tropical-leaf-pattern)" />
        {/* Rim Creasing / Depth */}
        <rect x="15" y="15" width="270" height="270" rx="36" fill="url(#p1-rim-shadow)" />
        {/* Inner Plate Depression */}
        <rect x="42" y="42" width="216" height="216" rx="26" fill="url(#tropical-leaf-pattern)" />
        {/* Inner Rim Groove Highlight & Shadow */}
        <rect x="42" y="42" width="216" height="216" rx="26" fill="none" stroke="#204610" strokeWidth="3" opacity="0.4" />
        <rect x="44" y="44" width="212" height="212" rx="24" fill="none" stroke="#e1f8b8" strokeWidth="1.5" opacity="0.7" />
        {/* Laminated shine highlight */}
        <rect x="15" y="15" width="270" height="270" rx="36" fill="url(#p1-glaze)" />
      </svg>
    );
  }

  // Plate 2: Round Tropical Green Leaf Pattern
  if (plateCode.includes('plate2') || plateCode === '2') {
    return (
      <svg
        viewBox="0 0 300 300"
        className="w-full h-full drop-shadow-lg transition-transform duration-300 group-hover:scale-105"
        role="img"
        aria-label={name}
      >
        <defs>
          <radialGradient id="p2-round-depth" cx="50%" cy="50%" r="50%">
            <stop offset="65%" stopColor="#1e3a17" stopOpacity="0.2" />
            <stop offset="85%" stopColor="#152b10" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#0b1709" stopOpacity="0.75" />
          </radialGradient>
          <linearGradient id="p2-shine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="75%" stopColor="#000000" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.2" />
          </linearGradient>
          <pattern id="round-tropical-pattern" width="85" height="85" patternUnits="userSpaceOnUse">
            <rect width="85" height="85" fill="#a4dc72" />
            <path
              d="M 42 6 C 25 0, 8 18, 16 42 C 22 58, 42 72, 42 76 C 42 72, 62 58, 68 42 C 76 18, 59 0, 42 6 Z"
              fill="#78bf45"
              stroke="#2e6417"
              strokeWidth="2"
            />
            <path d="M 42 10 L 42 72" stroke="#204d0f" strokeWidth="1.4" />
            <path d="M 42 22 Q 28 18 20 25" stroke="#204d0f" strokeWidth="1.2" fill="none" />
            <path d="M 42 22 Q 56 18 64 25" stroke="#204d0f" strokeWidth="1.2" fill="none" />
            <path d="M 42 36 Q 26 32 22 42" stroke="#204d0f" strokeWidth="1.2" fill="none" />
            <path d="M 42 36 Q 58 32 62 42" stroke="#204d0f" strokeWidth="1.2" fill="none" />
            <path d="M 42 50 Q 30 46 26 56" stroke="#204d0f" strokeWidth="1.2" fill="none" />
            <path d="M 42 50 Q 54 46 58 56" stroke="#204d0f" strokeWidth="1.2" fill="none" />
          </pattern>
        </defs>

        {/* Outer Round Disc */}
        <circle cx="150" cy="150" r="135" fill="url(#round-tropical-pattern)" />
        {/* Rim Shadow */}
        <circle cx="150" cy="150" r="135" fill="url(#p2-round-depth)" />
        {/* Inner Plate Well */}
        <circle cx="150" cy="150" r="108" fill="url(#round-tropical-pattern)" />
        {/* Rim Creasing / Bevel */}
        <circle cx="150" cy="150" r="108" fill="none" stroke="#204610" strokeWidth="3" opacity="0.4" />
        <circle cx="150" cy="150" r="106" fill="none" stroke="#d5f5a8" strokeWidth="1.5" opacity="0.8" />
        {/* Pressed Crimped Edge notches */}
        <circle cx="150" cy="150" r="133" fill="none" stroke="#244d14" strokeWidth="2" strokeDasharray="3 3" opacity="0.4" />
        {/* Glaze */}
        <circle cx="150" cy="150" r="135" fill="url(#p2-shine)" />
      </svg>
    );
  }

  // Plate 3: Golden Warm Floral / Leaf Pattern (Square)
  if (plateCode.includes('plate3') || plateCode === '3') {
    return (
      <svg
        viewBox="0 0 300 300"
        className="w-full h-full drop-shadow-lg transition-transform duration-300 group-hover:scale-105"
        role="img"
        aria-label={name}
      >
        <defs>
          <radialGradient id="p3-warm-depth" cx="50%" cy="50%" r="50%">
            <stop offset="65%" stopColor="#b45309" stopOpacity="0.25" />
            <stop offset="90%" stopColor="#78350f" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#451a03" stopOpacity="0.85" />
          </radialGradient>
          <linearGradient id="p3-gold-shine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fffbeb" stopOpacity="0.45" />
            <stop offset="35%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="70%" stopColor="#78350f" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#fef3c7" stopOpacity="0.25" />
          </linearGradient>
          <pattern id="golden-leaf-pattern" width="80" height="80" patternUnits="userSpaceOnUse">
            {/* Deep rich golden yellow background */}
            <rect width="80" height="80" fill="#f59e0b" />
            {/* Curved warm orange petal/leaf outlines */}
            <path
              d="M 10 10 Q 50 15 70 70 Q 30 65 10 10 Z"
              fill="#fbbf24"
              stroke="#b45309"
              strokeWidth="2"
            />
            <path
              d="M 70 10 Q 75 50 15 70 Q 25 30 70 10 Z"
              fill="#f59e0b"
              stroke="#92400e"
              strokeWidth="1.8"
            />
            <path d="M 12 12 Q 38 42 68 68" stroke="#d97706" strokeWidth="1.2" strokeDasharray="2 1" />
            <path d="M 68 12 Q 42 42 16 68" stroke="#d97706" strokeWidth="1.2" strokeDasharray="2 1" />
            {/* Reddish-orange delicate vein arches */}
            <path d="M 25 25 Q 40 30 45 45" stroke="#b45309" strokeWidth="1" fill="none" />
            <path d="M 55 25 Q 40 30 35 45" stroke="#b45309" strokeWidth="1" fill="none" />
          </pattern>
        </defs>

        {/* Square Plate with rounded corner */}
        <rect x="15" y="15" width="270" height="270" rx="36" fill="url(#golden-leaf-pattern)" />
        {/* Rim Depth */}
        <rect x="15" y="15" width="270" height="270" rx="36" fill="url(#p3-warm-depth)" />
        {/* Inner Plate Depression */}
        <rect x="42" y="42" width="216" height="216" rx="26" fill="url(#golden-leaf-pattern)" />
        {/* Inner Rim Outline */}
        <rect x="42" y="42" width="216" height="216" rx="26" fill="none" stroke="#78350f" strokeWidth="2.5" opacity="0.4" />
        <rect x="44" y="44" width="212" height="212" rx="24" fill="none" stroke="#fef08a" strokeWidth="1.5" opacity="0.8" />
        {/* Golden Glaze */}
        <rect x="15" y="15" width="270" height="270" rx="36" fill="url(#p3-gold-shine)" />
      </svg>
    );
  }

  // Plate 4: Banana Leaf Square Plate (Authentic deep green banana leaf ribs + central pale stem)
  if (plateCode.includes('plate4') || plateCode === '4') {
    return (
      <svg
        viewBox="0 0 300 300"
        className="w-full h-full drop-shadow-lg transition-transform duration-300 group-hover:scale-105"
        role="img"
        aria-label={name}
      >
        <defs>
          <linearGradient id="banana-base-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e5128" />
            <stop offset="50%" stopColor="#194d23" />
            <stop offset="100%" stopColor="#143c1b" />
          </linearGradient>
          <linearGradient id="banana-stem-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7fb865" />
            <stop offset="50%" stopColor="#c5e89b" />
            <stop offset="100%" stopColor="#7fb865" />
          </linearGradient>
          <radialGradient id="p4-rim-shadow" cx="50%" cy="50%" r="50%">
            <stop offset="68%" stopColor="#0b240f" stopOpacity="0.25" />
            <stop offset="92%" stopColor="#06190a" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#030e05" stopOpacity="0.85" />
          </radialGradient>
          <linearGradient id="p4-glaze" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
            <stop offset="35%" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="70%" stopColor="#000000" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* Square Base */}
        <rect x="15" y="15" width="270" height="270" rx="36" fill="url(#banana-base-grad)" />

        {/* Banana Leaf Fine Ribs (Diagonal Veins across plate) */}
        <g stroke="#3fa34d" strokeWidth="1.2" opacity="0.65">
          {Array.from({ length: 28 }).map((_, i) => {
            const y = 20 + i * 9.5;
            return (
              <React.Fragment key={i}>
                <line x1="150" y1={y} x2="25" y2={y + 35} />
                <line x1="150" y1={y} x2="275" y2={y + 35} />
              </React.Fragment>
            );
          })}
        </g>

        {/* Central Banana Leaf Midrib / Stem */}
        <path d="M 148 15 Q 149 150 150 285 L 153 285 Q 152 150 151 15 Z" fill="url(#banana-stem-grad)" opacity="0.95" />

        {/* Outer Rim Depth */}
        <rect x="15" y="15" width="270" height="270" rx="36" fill="url(#p4-rim-shadow)" />

        {/* Inner Plate Recess Rim */}
        <rect x="42" y="42" width="216" height="216" rx="26" fill="none" stroke="#0e3015" strokeWidth="3" opacity="0.5" />
        <rect x="44" y="44" width="212" height="212" rx="24" fill="none" stroke="#9ee27b" strokeWidth="1.4" opacity="0.75" />

        {/* Crimped Border Markings */}
        <rect x="18" y="18" width="264" height="264" rx="33" fill="none" stroke="#0b240f" strokeWidth="2" strokeDasharray="3 4" opacity="0.3" />

        {/* Laminated sheen */}
        <rect x="15" y="15" width="270" height="270" rx="36" fill="url(#p4-glaze)" />
      </svg>
    );
  }

  // Plate 5: Banana Leaf Round Plate
  if (plateCode.includes('plate5') || plateCode === '5') {
    return (
      <svg
        viewBox="0 0 300 300"
        className="w-full h-full drop-shadow-lg transition-transform duration-300 group-hover:scale-105"
        role="img"
        aria-label={name}
      >
        <defs>
          <linearGradient id="p5-banana-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e532a" />
            <stop offset="45%" stopColor="#194d23" />
            <stop offset="100%" stopColor="#123a19" />
          </linearGradient>
          <linearGradient id="p5-stem" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7bb262" />
            <stop offset="50%" stopColor="#c5e89b" />
            <stop offset="100%" stopColor="#7bb262" />
          </linearGradient>
          <radialGradient id="p5-depth" cx="50%" cy="50%" r="50%">
            <stop offset="66%" stopColor="#0b240f" stopOpacity="0.25" />
            <stop offset="88%" stopColor="#06190a" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#030e05" stopOpacity="0.8" />
          </radialGradient>
          <linearGradient id="p5-glaze" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="75%" stopColor="#000000" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.18" />
          </linearGradient>
        </defs>

        {/* Round Base */}
        <circle cx="150" cy="150" r="135" fill="url(#p5-banana-grad)" />

        {/* Banana Leaf Radiating Ribs */}
        <g stroke="#3fa34d" strokeWidth="1.3" opacity="0.6">
          {Array.from({ length: 30 }).map((_, i) => {
            const y = 25 + i * 8.5;
            return (
              <React.Fragment key={i}>
                <line x1="145" y1={y} x2="25" y2={y + 24} />
                <line x1="155" y1={y} x2="275" y2={y + 24} />
              </React.Fragment>
            );
          })}
        </g>

        {/* Central curved stem */}
        <path d="M 148 18 Q 152 150 149 282 L 152 282 Q 155 150 151 18 Z" fill="url(#p5-stem)" opacity="0.95" />

        {/* Circular Depth */}
        <circle cx="150" cy="150" r="135" fill="url(#p5-depth)" />

        {/* Inner Plate Recess */}
        <circle cx="150" cy="150" r="108" fill="none" stroke="#0e3015" strokeWidth="3" opacity="0.45" />
        <circle cx="150" cy="150" r="106" fill="none" stroke="#9ee27b" strokeWidth="1.5" opacity="0.75" />

        {/* Crimped Outer Edge */}
        <circle cx="150" cy="150" r="133" fill="none" stroke="#123a19" strokeWidth="2" strokeDasharray="3 3" opacity="0.4" />

        {/* Lamination shine */}
        <circle cx="150" cy="150" r="135" fill="url(#p5-glaze)" />
      </svg>
    );
  }

  // Plate 6: Silver Metallic Fluted Snack Plate / Katori Bowl
  // As shown in reference image: round shiny silver foil embossed with radial corrugated ridges & flat round center
  return (
    <svg
      viewBox="0 0 300 300"
      className="w-full h-full drop-shadow-lg transition-transform duration-300 group-hover:scale-105"
      role="img"
      aria-label={name}
    >
      <defs>
        <radialGradient id="silver-foil-metal" cx="45%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="20%" stopColor="#e2e8f0" />
          <stop offset="45%" stopColor="#94a3b8" />
          <stop offset="70%" stopColor="#cbd5e1" />
          <stop offset="90%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#334155" />
        </radialGradient>
        <radialGradient id="silver-center" cx="45%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="35%" stopColor="#cbd5e1" />
          <stop offset="70%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#475569" />
        </radialGradient>
        <linearGradient id="silver-gleam" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
          <stop offset="30%" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="60%" stopColor="#1e293b" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.5" />
        </linearGradient>
      </defs>

      {/* Fluted Outer Gear / Ripple Silhouette */}
      <circle cx="150" cy="150" r="135" fill="url(#silver-foil-metal)" />

      {/* 48 Embossed Radial Flutes / Ridges around the rim */}
      <g stroke="#334155" strokeWidth="2.5" opacity="0.65">
        {Array.from({ length: 48 }).map((_, i) => {
          const angle = (i * 360) / 48;
          const rad = (angle * Math.PI) / 180;
          const x1 = 150 + Math.cos(rad) * 75;
          const y1 = 150 + Math.sin(rad) * 75;
          const x2 = 150 + Math.cos(rad) * 135;
          const y2 = 150 + Math.sin(rad) * 135;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
      </g>
      <g stroke="#ffffff" strokeWidth="1.5" opacity="0.8">
        {Array.from({ length: 48 }).map((_, i) => {
          const angle = ((i + 0.3) * 360) / 48;
          const rad = (angle * Math.PI) / 180;
          const x1 = 150 + Math.cos(rad) * 75;
          const y1 = 150 + Math.sin(rad) * 75;
          const x2 = 150 + Math.cos(rad) * 134;
          const y2 = 150 + Math.sin(rad) * 134;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
      </g>

      {/* Raised Middle Rim Ring */}
      <circle cx="150" cy="150" r="76" fill="#64748b" opacity="0.4" />
      <circle cx="150" cy="150" r="74" fill="none" stroke="#ffffff" strokeWidth="3" opacity="0.85" />
      <circle cx="150" cy="150" r="71" fill="none" stroke="#334155" strokeWidth="2" opacity="0.6" />

      {/* Flat Metallic Mirror Center */}
      <circle cx="150" cy="150" r="68" fill="url(#silver-center)" />

      {/* Mirror Reflection Arc in center */}
      <ellipse cx="140" cy="138" rx="42" ry="32" fill="#ffffff" opacity="0.45" />

      {/* Metallic Rim Gloss Overlay */}
      <circle cx="150" cy="150" r="135" fill="url(#silver-gleam)" />
    </svg>
  );
}
