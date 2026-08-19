import React from 'react';
import { motion } from 'motion/react';
import { Minimize2, Volume2, VolumeX } from 'lucide-react';
import { Mantra, UserSettings } from '../types';

interface FocusModeViewProps {
  currentCount: number;
  totalTarget?: number;
  currentMala: number;
  selectedMantra: Mantra;
  settings: UserSettings;
  onTapCount: () => void;
  onExitFocusMode: () => void;
  onToggleSound: () => void;
}

export const FocusModeView: React.FC<FocusModeViewProps> = ({
  currentCount,
  totalTarget = 108,
  currentMala,
  selectedMantra,
  settings,
  onTapCount,
  onExitFocusMode,
  onToggleSound,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#121110] text-[#FAF8F5] flex flex-col justify-between p-6 select-none overflow-hidden"
    >
      {/* Top Subtle Exit & Sound Bar */}
      <div className="flex items-center justify-between text-xs text-[#78716C]">
        <span className="font-serif tracking-widest uppercase text-[10px] text-[#A8A29E]">
          Mala {currentMala} · Focus Mode
        </span>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSound}
            className="p-2 text-[#78716C] hover:text-[#FAF8F5] transition-colors cursor-pointer"
          >
            {settings.soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          <button
            type="button"
            id="exit-focus-mode-btn"
            onClick={onExitFocusMode}
            className="p-2 rounded-full text-[#78716C] hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Minimize2 size={18} />
            <span className="text-[11px]">Exit</span>
          </button>
        </div>
      </div>

      {/* Main Full-Screen Tap Area */}
      <button
        type="button"
        id="focus-mode-tap-surface"
        onClick={onTapCount}
        className="flex-1 w-full flex flex-col items-center justify-center text-center cursor-pointer focus:outline-none relative group my-4 active-tap"
        aria-label={`Count Japa in focus mode. Current count ${currentCount}`}
      >
        {/* Soft slow-breathing radiant aura & rhythmic guide */}
        <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[#D97706]/15 blur-3xl pointer-events-none animate-breath-halo" />
        <div className="absolute w-60 h-60 sm:w-80 sm:h-80 rounded-full border border-[#D97706]/20 pointer-events-none animate-breath-slow" />

        {/* Sanskrit Mantra with profound presence */}
        <motion.div
          key={selectedMantra.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 max-w-sm px-4"
        >
          <p className="font-sanskrit text-3xl sm:text-4xl md:text-5xl font-bold text-[#FAF8F5] leading-relaxed tracking-wider drop-shadow-md">
            {selectedMantra.sanskrit}
          </p>

          <p className="text-xs sm:text-sm text-[#A8A29E] mt-3 italic font-medium">
            {selectedMantra.transliteration}
          </p>
        </motion.div>

        {/* Large Count Number */}
        <div className="relative z-10 mt-8 flex items-baseline justify-center gap-2">
          <motion.span
            key={currentCount}
            initial={{ scale: 1.15, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            className="font-serif text-6xl sm:text-7xl font-bold text-white tracking-tight"
          >
            {currentCount}
          </motion.span>
          <span className="font-serif text-2xl text-[#57534E]">
            / {totalTarget}
          </span>
        </div>

        {/* Subtle Tap Cue with Slow-Breathing Pulse Guide */}
        <div className="relative z-10 mt-6 flex items-center gap-2 text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-[#D97706] opacity-90">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] animate-breath-slow" />
          <span>Tap Screen to Count</span>
        </div>
      </button>

      {/* Footer subtle tip */}
      <div className="text-center text-[11px] text-[#57534E] pb-2 font-serif">
        “One Mantra. One Moment.”
      </div>
    </motion.div>
  );
};
