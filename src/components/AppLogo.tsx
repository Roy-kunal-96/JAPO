import React from 'react';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  minimal?: boolean;
  className?: string;
}

export const AppIcon: React.FC<{ size?: number; className?: string }> = ({ size = 44, className = '' }) => {
  const radius = size / 2;
  const beadRingRadius = radius * 0.72;
  const numBeads = 18; // Stylized geometric representation of 108 beads circle for clarity at micro sizes

  const beads = Array.from({ length: numBeads }).map((_, i) => {
    // 0 is top (Meru position)
    const angle = (i / numBeads) * 2 * Math.PI - Math.PI / 2;
    const x = radius + beadRingRadius * Math.cos(angle);
    const y = radius + beadRingRadius * Math.sin(angle);
    return { x, y, isMeru: i === 0 };
  });

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-2xl bg-[#1C1917] text-[#FAF8F5] shadow-md border border-[#E89241]/20 ${className}`}
      style={{ width: size, height: size }}
      aria-label="JAPO App Icon"
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Subtle background glow circle */}
        <circle
          cx={radius}
          cy={radius}
          r={beadRingRadius}
          stroke="#D97706"
          strokeWidth="1"
          strokeDasharray="2 3"
          opacity="0.3"
        />

        {/* Mala beads ring */}
        {beads.map((b, idx) => {
          if (b.isMeru) {
            // Meru Guru bead at top with tiny crown/accent
            return (
              <g key={idx}>
                <circle
                  cx={b.x}
                  cy={b.y}
                  r={Math.max(2.4, size * 0.058)}
                  fill="#E08A2A"
                  stroke="#FAF8F5"
                  strokeWidth="1"
                />
                {/* Subtle Guru tassel knot accent */}
                <path
                  d={`M ${b.x - 2} ${b.y - 3} L ${b.x} ${b.y - 5.5} L ${b.x + 2} ${b.y - 3}`}
                  stroke="#E08A2A"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
              </g>
            );
          }
          return (
            <circle
              key={idx}
              cx={b.x}
              cy={b.y}
              r={Math.max(1.5, size * 0.038)}
              fill="#FAF8F5"
              opacity={0.85}
            />
          );
        })}

        {/* Central Om Symbol */}
        <text
          x={radius}
          y={radius + (size * 0.12)}
          textAnchor="middle"
          fill="#FAF8F5"
          fontFamily="'Noto Serif Devanagari', 'Cinzel', serif"
          fontSize={size * 0.42}
          fontWeight="600"
          className="select-none"
        >
          ॐ
        </text>
      </svg>
    </div>
  );
};

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 'md',
  showTagline = false,
  minimal = false,
  className = '',
}) => {
  const sizeMap = {
    sm: { iconSize: 28, textClass: 'text-lg', tagClass: 'text-[10px]' },
    md: { iconSize: 36, textClass: 'text-2xl', tagClass: 'text-xs' },
    lg: { iconSize: 48, textClass: 'text-3xl', tagClass: 'text-sm' },
    xl: { iconSize: 64, textClass: 'text-4xl', tagClass: 'text-base' },
  };

  const config = sizeMap[size];

  if (minimal) {
    return (
      <div className={`inline-flex items-center gap-2.5 ${className}`}>
        <AppIcon size={config.iconSize} />
        <span className={`font-serif font-bold tracking-widest text-[#1C1917] dark:text-[#FAF8F5] ${config.textClass}`}>
          JAPO
        </span>
      </div>
    );
  }

  return (
    <div className={`inline-flex flex-col items-center justify-center text-center ${className}`}>
      <div className="flex items-center gap-3">
        <AppIcon size={config.iconSize} />
        <div className="text-left">
          <div className="flex items-center gap-1.5">
            <span className={`font-serif font-bold tracking-wider text-[#1C1917] dark:text-[#FAF8F5] ${config.textClass}`}>
              JAPO
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#D97706]" />
          </div>
          {showTagline && (
            <p className={`text-[#78716C] dark:text-[#A8A29E] font-medium tracking-wide ${config.tagClass}`}>
              One Mantra. One Moment.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
