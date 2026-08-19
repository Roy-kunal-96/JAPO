import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  RotateCcw,
  CheckCircle2,
  Maximize2,
  Volume2,
  VolumeX,
  Smartphone,
  ChevronDown,
  Pause,
  Play,
  Sparkles,
  Info
} from 'lucide-react';
import { Mantra, UserSettings } from '../types';
import { VirtualMala } from '../components/VirtualMala';
import { BUILT_IN_MANTRAS } from '../data/mantras';

interface JapaViewProps {
  currentCount: number;
  currentMala: number;
  todayJapaCount: number;
  selectedMantra: Mantra;
  customMantras: Mantra[];
  settings: UserSettings;
  onTapCount: () => void;
  onResetSession: () => void;
  onFinishSession: () => void;
  onSelectMantra: (mantraId: string) => void;
  onEnterFocusMode: () => void;
  onToggleSound: () => void;
  onToggleHaptic: () => void;
}

export const JapaView: React.FC<JapaViewProps> = ({
  currentCount,
  currentMala,
  todayJapaCount,
  selectedMantra,
  customMantras,
  settings,
  onTapCount,
  onResetSession,
  onFinishSession,
  onSelectMantra,
  onEnterFocusMode,
  onToggleSound,
  onToggleHaptic,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [isMantraSelectorOpen, setIsMantraSelectorOpen] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(0);

  // Timer tracking active session
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setSessionSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const allMantras = [...BUILT_IN_MANTRAS, ...customMantras];

  return (
    <div className="flex-1 flex flex-col items-center justify-between max-w-md mx-auto w-full px-4 pt-3 pb-24 min-h-[calc(100vh-4rem)]">
      {/* Top Controls Bar */}
      <div className="w-full flex items-center justify-between py-1">
        {/* Mantra Switcher Pill */}
        <div className="relative">
          <button
            type="button"
            id="japa-mantra-selector-btn"
            onClick={() => setIsMantraSelectorOpen(!isMantraSelectorOpen)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#1C1917] border border-[#E7E2DA] dark:border-[#2D2A26] shadow-xs text-xs font-semibold text-[#1C1917] dark:text-[#FAF8F5] hover:border-[#D97706] transition-colors cursor-pointer"
          >
            <span className="truncate max-w-[140px]">{selectedMantra.name}</span>
            <ChevronDown size={14} className="text-[#78716C]" />
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {isMantraSelectorOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setIsMantraSelectorOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="absolute left-0 top-full mt-2 w-64 max-h-72 overflow-y-auto rounded-2xl bg-white dark:bg-[#1C1917] border border-[#E7E2DA] dark:border-[#2D2A26] shadow-xl p-2 z-30 space-y-1 no-scrollbar"
                >
                  <div className="px-2 py-1 text-[10px] uppercase font-bold text-[#A8A29E] tracking-wider">
                    Select Focus Mantra
                  </div>
                  {allMantras.map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        onSelectMantra(m.id);
                        setIsMantraSelectorOpen(false);
                      }}
                      className={`w-full p-2 rounded-xl text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${
                        selectedMantra.id === m.id
                          ? 'bg-[#FEF3C7] dark:bg-[#78350F]/30 text-[#B45309] dark:text-[#FBBF24] font-semibold'
                          : 'text-[#1C1917] dark:text-[#FAF8F5] hover:bg-[#FAF5EE] dark:hover:bg-[#282420]'
                      }`}
                    >
                      <div className="truncate pr-1">
                        <div className="truncate">{m.name}</div>
                        <div className="font-sanskrit text-[11px] text-[#78716C] dark:text-[#A8A29E] truncate">
                          {m.sanskrit}
                        </div>
                      </div>
                      {selectedMantra.id === m.id && <Sparkles size={12} className="shrink-0" />}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Quick Toggles */}
        <div className="flex items-center gap-1 bg-[#EFEAE2] dark:bg-[#282420] p-1 rounded-2xl border border-[#E0DBD2] dark:border-[#38332E]">
          <button
            type="button"
            onClick={onToggleSound}
            title={settings.soundEnabled ? 'Temple Chime ON' : 'Chime Muted'}
            className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
              settings.soundEnabled
                ? 'text-[#D97706] bg-white dark:bg-[#1C1917] shadow-xs'
                : 'text-[#A8A29E]'
            }`}
          >
            {settings.soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>
          <button
            type="button"
            onClick={onToggleHaptic}
            title={settings.hapticEnabled ? 'Haptics ON' : 'Haptics OFF'}
            className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
              settings.hapticEnabled
                ? 'text-[#D97706] bg-white dark:bg-[#1C1917] shadow-xs'
                : 'text-[#A8A29E]'
            }`}
          >
            <Smartphone size={15} />
          </button>
          <button
            type="button"
            id="japa-enter-focus-btn"
            onClick={onEnterFocusMode}
            title="Focus Mode (Distraction-free)"
            className="p-1.5 rounded-xl text-[#78716C] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-white transition-colors cursor-pointer"
          >
            <Maximize2 size={15} />
          </button>
        </div>
      </div>

      {/* Centerpiece: 108 Virtual Mala */}
      <div className="flex-1 flex flex-col items-center justify-center my-auto w-full">
        <VirtualMala
          currentCount={currentCount}
          totalTarget={108}
          mantraSanskrit={selectedMantra.sanskrit}
          mantraTransliteration={selectedMantra.transliteration}
          onTap={() => {
            if (!isPaused) onTapCount();
          }}
          disabled={isPaused}
          size={330}
        />

        {/* Mala Round & Today's Japa Progress */}
        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-[#78716C] dark:text-[#A8A29E] font-medium">
          <span className="px-3 py-1 rounded-full bg-white dark:bg-[#1C1917] border border-[#E7E2DA] dark:border-[#2D2A26] shadow-2xs font-semibold text-[#1C1917] dark:text-[#FAF8F5]">
            Mala {currentMala}
          </span>
          <span>•</span>
          <span>Today’s Japa: {todayJapaCount}</span>
          <span>•</span>
          <span>Time: {formatTime(sessionSeconds)}</span>
        </div>
      </div>

      {/* Bottom Session Control Actions */}
      <div className="w-full pt-4 pb-2">
        <div className="grid grid-cols-3 gap-2.5">
          {/* Pause / Resume */}
          <button
            type="button"
            id="japa-pause-toggle-btn"
            onClick={() => setIsPaused(!isPaused)}
            className={`py-3 px-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer active-tap ${
              isPaused
                ? 'bg-[#FEF3C7] dark:bg-[#78350F]/30 border-[#FDE68A] text-[#B45309] dark:text-[#FBBF24]'
                : 'bg-white dark:bg-[#1C1917] border-[#E7E2DA] dark:border-[#2D2A26] text-[#57534E] dark:text-[#D6D3D1] hover:bg-[#FAF5EE]'
            }`}
          >
            {isPaused ? <Play size={15} /> : <Pause size={15} />}
            <span>{isPaused ? 'Resume' : 'Pause'}</span>
          </button>

          {/* Reset (Requires Confirmation) */}
          <button
            type="button"
            id="japa-reset-btn"
            onClick={onResetSession}
            className="py-3 px-3 rounded-2xl bg-white dark:bg-[#1C1917] border border-[#E7E2DA] dark:border-[#2D2A26] text-xs font-semibold text-[#78716C] dark:text-[#A8A29E] hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer active-tap"
          >
            <RotateCcw size={15} />
            <span>Reset</span>
          </button>

          {/* Finish Session */}
          <button
            type="button"
            id="japa-finish-btn"
            onClick={onFinishSession}
            className="py-3 px-3 rounded-2xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer active-tap"
          >
            <CheckCircle2 size={15} />
            <span>Finish</span>
          </button>
        </div>
      </div>
    </div>
  );
};
