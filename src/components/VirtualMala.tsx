import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface VirtualMalaProps {
  currentCount: number; // 0 to 108
  totalTarget?: number; // 108
  mantraSanskrit: string;
  mantraTransliteration?: string;
  onTap: () => void;
  disabled?: boolean;
  size?: number;
  className?: string;
  isFocusMode?: boolean;
}

interface TapRipple {
  id: number;
  x: number;
  y: number;
}

export const VirtualMala: React.FC<VirtualMalaProps> = ({
  currentCount,
  totalTarget = 108,
  mantraSanskrit,
  mantraTransliteration,
  onTap,
  disabled = false,
  size = 330,
  className = '',
  isFocusMode = false,
}) => {
  // SVG Dimensions & Geometry
  const viewBoxSize = 400;
  const center = viewBoxSize / 2;
  const radius = 168; // Ring radius
  const totalBeads = 108;

  // Local state for tap ripple animations
  const [ripples, setRipples] = useState<TapRipple[]>([]);
  // Breath Phase text (Inhale 3s -> Exhale 3s)
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Exhale'>('Inhale');

  useEffect(() => {
    const breathInterval = setInterval(() => {
      setBreathPhase(prev => (prev === 'Inhale' ? 'Exhale' : 'Inhale'));
    }, 3000);
    return () => clearInterval(breathInterval);
  }, []);

  const handlePointerDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple: TapRipple = {
      id: Date.now() + Math.random(),
      x,
      y,
    };

    setRipples(prev => [...prev.slice(-4), newRipple]);
    onTap();
  };

  const removeRipple = (id: number) => {
    setRipples(prev => prev.filter(r => r.id !== id));
  };

  // Generate 108 beads coordinates
  const beads = useMemo(() => {
    return Array.from({ length: totalBeads }).map((_, i) => {
      const beadNumber = i + 1;
      const angle = -Math.PI / 2 + ((i + 0.5) / totalBeads) * (2 * Math.PI);
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);

      const isCompleted = beadNumber <= currentCount;
      const isActive = beadNumber === currentCount + 1;
      const isQuarter = beadNumber === 27 || beadNumber === 54 || beadNumber === 81;

      return {
        number: beadNumber,
        x,
        y,
        isCompleted,
        isActive,
        isQuarter,
      };
    });
  }, [currentCount, center, radius, totalBeads]);

  // Meru (Guru) bead at top (-90 degrees)
  const meruX = center;
  const meruY = center - radius;
  const progressRatio = Math.min(currentCount / totalTarget, 1);
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progressRatio * circumference;

  return (
    <div
      className={`relative select-none flex items-center justify-center ${className}`}
      style={{ maxWidth: '100%', width: size, height: size }}
    >
      {/* Outer interactive Tap Surface */}
      <button
        type="button"
        id="japa-mala-tap-button"
        onClick={handlePointerDown}
        disabled={disabled}
        aria-label={`Count Japa. Current count ${currentCount} of ${totalTarget}`}
        className="w-full h-full relative flex items-center justify-center rounded-full p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D97706] active-tap cursor-pointer group overflow-hidden"
      >
        {/* Dynamic Tap Ripple Waves */}
        <AnimatePresence>
          {ripples.map(ripple => (
            <motion.span
              key={ripple.id}
              initial={{ scale: 0.2, opacity: 0.65 }}
              animate={{ scale: 2.8, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.65, ease: 'easeOut' }}
              onAnimationComplete={() => removeRipple(ripple.id)}
              style={{
                position: 'absolute',
                left: ripple.x - 40,
                top: ripple.y - 40,
                width: 80,
                height: 80,
              }}
              className="rounded-full bg-[#D97706]/30 dark:bg-[#F59E0B]/25 pointer-events-none blur-xs"
            />
          ))}
        </AnimatePresence>

        <svg
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
          className="w-full h-full overflow-visible transition-transform duration-150 ease-out"
        >
          <defs>
            {/* Golden Gradient for Progress Arc */}
            <linearGradient id="malaProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>

            {/* Glowing filter for Active Beads */}
            <filter id="activeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Guideline Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="currentColor"
            className="text-[#E7E2DA] dark:text-[#2D2A26]"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Smooth Circular Progress Arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="url(#malaProgressGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-300 ease-out -rotate-90 origin-center opacity-70"
          />

          {/* 108 Mala Beads */}
          {beads.map(b => {
            if (b.isCompleted) {
              return (
                <circle
                  key={b.number}
                  cx={b.x}
                  cy={b.y}
                  r={b.isQuarter ? 5.2 : 3.8}
                  fill="#D97706"
                  stroke="#FAF8F5"
                  strokeWidth="1.2"
                  className="transition-all duration-200"
                />
              );
            }

            if (b.isActive) {
              return (
                <g key={b.number} filter="url(#activeGlow)">
                  {/* Expanding Beacon Ring */}
                  <circle
                    cx={b.x}
                    cy={b.y}
                    r={9}
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="1.5"
                    className="animate-ping opacity-60 origin-center"
                    style={{ transformOrigin: `${b.x}px ${b.y}px` }}
                  />
                  {/* Pulsing Guide Ring */}
                  <circle
                    cx={b.x}
                    cy={b.y}
                    r={6.8}
                    fill="none"
                    stroke="#D97706"
                    strokeWidth="1.5"
                  />
                  {/* Core Active Bead */}
                  <circle
                    cx={b.x}
                    cy={b.y}
                    r={4.5}
                    fill="#F59E0B"
                    stroke="#FFF"
                    strokeWidth="1"
                  />
                </g>
              );
            }

            return (
              <circle
                key={b.number}
                cx={b.x}
                cy={b.y}
                r={b.isQuarter ? 3.8 : 2.5}
                fill={b.isQuarter ? '#A8A29E' : '#D6D1CA'}
                className="dark:fill-[#44403C] transition-colors"
              />
            );
          })}

          {/* Meru / Guru Bead at the Top */}
          <g className={currentCount >= 100 ? 'animate-gentle-pulse' : ''}>
            {/* Meru Outer Glow when near 108 */}
            {currentCount >= 100 && (
              <circle
                cx={meruX}
                cy={meruY}
                r={12}
                fill="none"
                stroke="#D97706"
                strokeWidth="1.5"
                className="opacity-50 animate-ping"
                style={{ transformOrigin: `${meruX}px ${meruY}px` }}
              />
            )}
            {/* Meru Bead */}
            <circle
              cx={meruX}
              cy={meruY}
              r={8}
              fill="#D97706"
              stroke="#FAF8F5"
              strokeWidth="1.5"
              className="drop-shadow-sm"
            />
            {/* Meru Top Bindu / Stupa Point */}
            <circle
              cx={meruX}
              cy={meruY - 7.5}
              r={3.2}
              fill="#B45309"
            />
            {/* Tassel Strands */}
            <path
              d={`M ${meruX - 3} ${meruY - 10} L ${meruX - 5} ${meruY - 18} M ${meruX} ${meruY - 10} L ${meruX} ${meruY - 19} M ${meruX + 3} ${meruY - 10} L ${meruX + 5} ${meruY - 18}`}
              stroke="#D97706"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </g>
        </svg>

        {/* Center Sanctuary (Mantra + Counter + Tap Prompt + Slow-Breathing Mindfulness Guide) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center pointer-events-none">
          {/* Synchronized 6-Second Breathing Aura & Concentric Guide Ring */}
          <div className="absolute w-44 h-44 rounded-full bg-[#D97706]/15 dark:bg-[#D97706]/10 animate-breath-halo pointer-events-none" />
          <div className="absolute w-36 h-36 rounded-full border border-[#D97706]/20 dark:border-[#D97706]/15 animate-breath-slow pointer-events-none" />

          {/* Sanskrit Mantra with smooth transition */}
          <motion.div
            key={mantraSanskrit}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="relative z-10 flex flex-col items-center justify-center max-w-[230px]"
          >
            <span
              className={`font-sanskrit font-bold text-[#1C1917] dark:text-[#FAF8F5] leading-relaxed tracking-wide drop-shadow-xs transition-all ${
                mantraSanskrit.length > 20
                  ? 'text-lg sm:text-xl'
                  : 'text-2xl sm:text-3xl'
              }`}
            >
              {mantraSanskrit}
            </span>

            {mantraTransliteration && !isFocusMode && (
              <span className="text-[11px] sm:text-xs text-[#78716C] dark:text-[#A8A29E] mt-0.5 font-medium tracking-wide line-clamp-1">
                {mantraTransliteration}
              </span>
            )}
          </motion.div>

          {/* Large Spring-Animated Counter Display */}
          <div className="relative z-10 mt-2 flex items-baseline justify-center gap-1.5 font-serif">
            <motion.span
              key={currentCount}
              initial={{ scale: 1.18, opacity: 0.7, y: -2 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 24 }}
              className="text-4xl sm:text-5xl font-bold tracking-tight text-[#1C1917] dark:text-[#FAF8F5]"
            >
              {currentCount}
            </motion.span>
            <span className="text-sm sm:text-base font-normal text-[#A8A29E] dark:text-[#78716C]">
              / {totalTarget}
            </span>
          </div>

          {/* Tap Prompt + Real-time Inhale/Exhale Breath Cue */}
          <div className="relative z-10 mt-2 flex flex-col items-center gap-1">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-[#D97706] dark:text-[#F59E0B]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D97706] animate-breath-slow" />
              <span>Tap to Count</span>
            </div>

            {/* Meditative Breathing Guide Cue */}
            <motion.span
              key={breathPhase}
              initial={{ opacity: 0, y: 2 }}
              animate={{ opacity: 0.8, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-[9px] text-[#A8A29E] tracking-wider uppercase font-medium"
            >
              {breathPhase} · 6s Breath
            </motion.span>
          </div>
        </div>
      </button>
    </div>
  );
};
