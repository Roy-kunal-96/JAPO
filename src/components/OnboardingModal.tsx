import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { AppIcon } from './AppLogo';
import { BUILT_IN_MANTRAS } from '../data/mantras';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (selectedMantraId: string, dailyTarget: number) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [chosenMantraId, setChosenMantraId] = useState('shiva_namah_shivaya');
  const [chosenTarget, setChosenTarget] = useState(108);

  if (!isOpen) return null;

  const targetOptions = [
    { value: 108, label: '108 Japa', sub: '1 Mala · Gentle daily anchor (~8 min)' },
    { value: 216, label: '216 Japa', sub: '2 Malas · Morning & evening practice' },
    { value: 540, label: '540 Japa', sub: '5 Malas · Deep meditative immersion' },
    { value: 1080, label: '1080 Japa', sub: '10 Malas · Traditional sadhana' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          key={`step-${step}`}
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -15 }}
          transition={{ duration: 0.22 }}
          className="w-full max-w-sm rounded-3xl bg-[#FAF8F5] dark:bg-[#1C1917] border border-[#E7E2DA] dark:border-[#2D2A26] shadow-2xl p-6 sm:p-7 text-center overflow-hidden flex flex-col justify-between min-h-[460px]"
          role="dialog"
          aria-modal="true"
        >
          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-1.5 mb-2">
            {[1, 2, 3].map(s => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step
                    ? 'w-6 bg-[#D97706]'
                    : s < step
                    ? 'w-2 bg-[#D97706]/50'
                    : 'w-2 bg-[#D6D1CA] dark:bg-[#3D3833]'
                }`}
              />
            ))}
          </div>

          {/* SCREEN 1: Welcome */}
          {step === 1 && (
            <div className="flex-1 flex flex-col items-center justify-center py-4">
              <div className="mb-5 animate-gentle-pulse">
                <AppIcon size={64} />
              </div>
              <h2 className="font-serif text-3xl font-bold tracking-wider text-[#1C1917] dark:text-[#FAF8F5]">
                JAPO
              </h2>
              <p className="text-sm font-serif italic text-[#D97706] dark:text-[#F59E0B] mt-1">
                “One Mantra. One Moment.”
              </p>
              <p className="text-xs text-[#78716C] dark:text-[#A8A29E] mt-4 max-w-[260px] leading-relaxed">
                A calm, distraction-free digital Mala for modern mindfulness, sacred chanting, and daily stillness.
              </p>
              <div className="mt-4 flex items-center gap-2 text-[11px] text-[#A8A29E] font-medium">
                <span>Chant</span>
                <span>•</span>
                <span>Count</span>
                <span>•</span>
                <span>Connect</span>
              </div>
            </div>
          )}

          {/* SCREEN 2: Choose Mantra */}
          {step === 2 && (
            <div className="flex-1 flex flex-col items-center justify-start py-2 text-left w-full">
              <h3 className="font-serif text-xl font-bold text-[#1C1917] dark:text-[#FAF8F5] text-center w-full">
                Choose Your Mantra
              </h3>
              <p className="text-xs text-[#78716C] dark:text-[#A8A29E] text-center mt-0.5 mb-3 w-full">
                Select your focus anchor. You can change this anytime.
              </p>

              <div className="w-full space-y-2 max-h-[250px] overflow-y-auto no-scrollbar pr-1">
                {BUILT_IN_MANTRAS.slice(0, 5).map(m => {
                  const isSelected = chosenMantraId === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setChosenMantraId(m.id)}
                      className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#D97706] bg-[#FEF3C7]/40 dark:bg-[#78350F]/20'
                          : 'border-[#E7E2DA] dark:border-[#2D2A26] bg-white dark:bg-[#23201D] hover:border-[#D6D1CA]'
                      }`}
                    >
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="font-sanskrit text-sm font-semibold text-[#1C1917] dark:text-[#FAF8F5]">
                          {m.sanskrit}
                        </div>
                        <div className="text-[11px] text-[#78716C] dark:text-[#A8A29E] truncate">
                          {m.name} · {m.transliteration}
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 ${
                          isSelected
                            ? 'bg-[#D97706] border-[#D97706] text-white'
                            : 'border-[#D6D1CA] dark:border-[#44403C]'
                        }`}
                      >
                        {isSelected && <Check size={12} strokeWidth={3} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* SCREEN 3: Set Daily Intention */}
          {step === 3 && (
            <div className="flex-1 flex flex-col items-center justify-start py-2 text-left w-full">
              <h3 className="font-serif text-xl font-bold text-[#1C1917] dark:text-[#FAF8F5] text-center w-full">
                Set Your Daily Intention
              </h3>
              <p className="text-xs text-[#78716C] dark:text-[#A8A29E] text-center mt-0.5 mb-3 w-full">
                Choose a gentle commitment. Consistency over intensity.
              </p>

              <div className="w-full space-y-2">
                {targetOptions.map(opt => {
                  const isSelected = chosenTarget === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setChosenTarget(opt.value)}
                      className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#D97706] bg-[#FEF3C7]/40 dark:bg-[#78350F]/20'
                          : 'border-[#E7E2DA] dark:border-[#2D2A26] bg-white dark:bg-[#23201D] hover:border-[#D6D1CA]'
                      }`}
                    >
                      <div>
                        <div className="font-serif font-bold text-sm text-[#1C1917] dark:text-[#FAF8F5]">
                          {opt.label}
                        </div>
                        <div className="text-[11px] text-[#78716C] dark:text-[#A8A29E]">
                          {opt.sub}
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 ${
                          isSelected
                            ? 'bg-[#D97706] border-[#D97706] text-white'
                            : 'border-[#D6D1CA] dark:border-[#44403C]'
                        }`}
                      >
                        {isSelected && <Check size={12} strokeWidth={3} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="mt-4 pt-3 border-t border-[#E7E2DA] dark:border-[#2D2A26] flex items-center justify-between gap-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((step - 1) as 1 | 2)}
                className="text-xs text-[#78716C] hover:text-[#1C1917] dark:hover:text-white px-2 py-2"
              >
                Back
              </button>
            ) : (
              <span className="text-[11px] text-[#A8A29E]">No sign-up required</span>
            )}

            {step < 3 ? (
              <button
                type="button"
                id="onboarding-next-btn"
                onClick={() => setStep((step + 1) as 2 | 3)}
                className="py-2.5 px-5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-medium flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer ml-auto"
              >
                <span>{step === 1 ? 'Begin' : 'Continue'}</span>
                <ArrowRight size={14} />
              </button>
            ) : (
              <button
                type="button"
                id="onboarding-start-btn"
                onClick={() => onComplete(chosenMantraId, chosenTarget)}
                className="py-2.5 px-6 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-medium flex items-center gap-2 shadow-sm transition-colors cursor-pointer ml-auto"
              >
                <Sparkles size={14} />
                <span>Start My Japa</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
