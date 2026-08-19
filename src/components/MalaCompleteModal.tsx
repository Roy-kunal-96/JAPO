import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { DAILY_THOUGHTS } from '../data/wisdom';

interface MalaCompleteModalProps {
  isOpen: boolean;
  malasCompleted: number; // e.g. 1 or 2
  onContinue: () => void;
  onFinish: () => void;
  mantraName: string;
}

export const MalaCompleteModal: React.FC<MalaCompleteModalProps> = ({
  isOpen,
  malasCompleted,
  onContinue,
  onFinish,
  mantraName,
}) => {
  // Select a thought based on day or malas completed
  const thoughtIndex = (new Date().getDate() + malasCompleted) % DAILY_THOUGHTS.length;
  const thought = DAILY_THOUGHTS[thoughtIndex];

  useEffect(() => {
    if (isOpen) {
      // Gentle warm golden & lotus petal confetti
      try {
        confetti({
          particleCount: 45,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D97706', '#F59E0B', '#E08A2A', '#FDE68A', '#E11D48'],
          disableForReducedMotion: true,
        });
      } catch {}
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="w-full max-w-sm rounded-3xl bg-[#FAF8F5] dark:bg-[#1C1917] border border-[#E7E2DA] dark:border-[#2D2A26] shadow-2xl p-6 text-center overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mala-complete-title"
        >
          {/* Header Icon */}
          <div className="mx-auto w-16 h-16 rounded-full bg-[#FEF3C7] dark:bg-[#78350F]/40 flex items-center justify-center text-3xl mb-4 border border-[#FDE68A] dark:border-[#92400E]">
            🪷
          </div>

          <h2
            id="mala-complete-title"
            className="font-serif text-2xl font-bold text-[#1C1917] dark:text-[#FAF8F5]"
          >
            Mala Complete
          </h2>
          <p className="text-sm text-[#78716C] dark:text-[#A8A29E] mt-1 font-medium">
            You completed {malasCompleted} {malasCompleted === 1 ? 'Mala' : 'Malas'} with {mantraName}.
          </p>

          {/* Count Badge */}
          <div className="my-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF0E6] dark:bg-[#2A241F] border border-[#E89241]/30 text-[#B45309] dark:text-[#FBBF24] font-serif font-bold text-sm">
            <Sparkles size={16} />
            <span>108 Japa</span>
          </div>

          {/* Today's Thought / Contemplation */}
          {thought && (
            <div className="my-4 text-left p-4 rounded-2xl bg-white dark:bg-[#24211E] border border-[#EAE5DE] dark:border-[#332F2B] shadow-sm">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#D97706] dark:text-[#F59E0B]">
                  🪷 Today’s Thought
                </span>
                <span className="text-[10px] text-[#A8A29E] font-medium">
                  {thought.source}
                </span>
              </div>
              <p className="font-sanskrit text-sm font-semibold text-[#1C1917] dark:text-[#FAF8F5] leading-relaxed">
                {thought.sanskrit}
              </p>
              <p className="text-xs text-[#57534E] dark:text-[#D6D3D1] mt-1.5 leading-relaxed">
                <strong className="text-[#1C1917] dark:text-[#FAF8F5]">Meaning:</strong> {thought.englishMeaning}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col gap-2.5">
            <button
              type="button"
              id="continue-mala-button"
              onClick={onContinue}
              className="w-full py-3.5 px-4 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-colors active-tap cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight size={16} />
            </button>

            <button
              type="button"
              id="finish-mala-button"
              onClick={onFinish}
              className="w-full py-3 px-4 rounded-xl bg-transparent hover:bg-[#EAE5DE] dark:hover:bg-[#2E2A26] text-[#78716C] dark:text-[#A8A29E] font-medium text-sm transition-colors active-tap cursor-pointer"
            >
              Finish Session
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
