import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Flame, Target, ArrowRight, Maximize2, Volume2, VolumeX, Smartphone, BookOpen } from 'lucide-react';
import { Mantra, UserSettings } from '../types';
import { JapaStats } from '../utils/storage';
import { DAILY_THOUGHTS, WHY_QUESTIONS } from '../data/wisdom';

interface HomeViewProps {
  currentCount: number;
  currentMala: number;
  selectedMantra: Mantra;
  settings: UserSettings;
  stats: JapaStats;
  onTapCount: () => void;
  onNavigateTab: (tab: 'home' | 'japa' | 'progress' | 'wisdom' | 'settings') => void;
  onEnterFocusMode: () => void;
  onToggleSound: () => void;
  onToggleHaptic: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  currentCount,
  currentMala,
  selectedMantra,
  settings,
  stats,
  onTapCount,
  onNavigateTab,
  onEnterFocusMode,
  onToggleSound,
  onToggleHaptic,
}) => {
  // Time of day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 12) return { text: 'Good Morning', icon: '🪷', sub: 'Begin your day with sacred stillness' };
    if (hour >= 12 && hour < 17) return { text: 'Good Afternoon', icon: '☀️', sub: 'Take a mindful pause from the day' };
    if (hour >= 17 && hour < 21) return { text: 'Good Evening', icon: '🌅', sub: 'Settle your mind and reflect' };
    return { text: 'Peaceful Night', icon: '🌙', sub: 'Rest your awareness in tranquility' };
  };

  const greeting = getGreeting();
  const todayProgressPercent = Math.min(100, Math.round((stats.todayJapa / settings.dailyTarget) * 100));

  // Today's thought & Did You Know teaser
  const dailyThought = DAILY_THOUGHTS[0];
  const teaserWhy = WHY_QUESTIONS[0];

  return (
    <div className="flex-1 flex flex-col max-w-md mx-auto w-full px-4 pt-4 pb-24 space-y-5">
      {/* Header Bar */}
      <header className="flex items-center justify-between pt-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">{greeting.icon}</span>
            <h1 className="font-serif text-lg font-bold text-[#1C1917] dark:text-[#FAF8F5]">
              {greeting.text}
            </h1>
          </div>
          <p className="text-[11px] text-[#78716C] dark:text-[#A8A29E] mt-0.5 font-medium">
            “One Mantra. One Moment.”
          </p>
        </div>

        {/* Quick Utilities */}
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
            onClick={onEnterFocusMode}
            title="Enter Focus Mode"
            className="p-1.5 rounded-xl text-[#78716C] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-white transition-colors cursor-pointer"
          >
            <Maximize2 size={15} />
          </button>
        </div>
      </header>

      {/* MAIN JAPA COUNTER CARD (Center Sanctuary) */}
      <section
        id="home-japa-card"
        className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#1C1917] border border-[#E7E2DA] dark:border-[#2D2A26] shadow-sm p-6 text-center"
      >
        {/* Subtle decorative background breathing aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-[#FEF3C7]/40 dark:bg-[#D97706]/10 animate-breath-halo pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 rounded-full border border-[#D97706]/15 dark:border-[#D97706]/10 animate-breath-slow pointer-events-none" />

        {/* Selected Mantra Title & Sanskrit */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF5EE] dark:bg-[#26221E] border border-[#E7E0D5] dark:border-[#38332E] text-[11px] font-medium text-[#78716C] dark:text-[#A8A29E] mb-3">
            <span>{selectedMantra.name}</span>
          </div>

          <h2 className="font-sanskrit text-2xl sm:text-3xl font-bold text-[#1C1917] dark:text-[#FAF8F5] leading-snug tracking-wide max-w-[300px] mx-auto min-h-[44px] flex items-center justify-center">
            {selectedMantra.sanskrit}
          </h2>

          <p className="text-xs text-[#78716C] dark:text-[#A8A29E] mt-1 font-medium italic">
            {selectedMantra.transliteration}
          </p>
        </div>

        {/* Big Central Tappable Count Target with Slow-Breathing Mindfulness Rhythm */}
        <button
          type="button"
          id="home-tap-to-count"
          onClick={onTapCount}
          className="relative z-10 my-5 w-full py-8 px-4 rounded-3xl bg-[#FAF8F5] dark:bg-[#23201D] border-2 border-dashed border-[#E0DBD2] dark:border-[#38332E] hover:border-[#D97706] dark:hover:border-[#D97706] flex flex-col items-center justify-center cursor-pointer active-tap transition-all group focus:outline-none overflow-hidden"
        >
          {/* Subtle slow-breathing circular halo guides */}
          <div className="absolute w-44 h-44 rounded-full bg-[#D97706]/15 dark:bg-[#D97706]/10 animate-breath-halo pointer-events-none" />
          <div className="absolute w-36 h-36 rounded-full border border-[#D97706]/25 dark:border-[#D97706]/20 animate-breath-slow pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#FEF3C7]/30 to-transparent dark:from-[#D97706]/10 animate-breath-slow pointer-events-none" />

          <div className="relative z-10 flex items-baseline justify-center gap-2">
            <motion.span
              key={currentCount}
              initial={{ scale: 1.12, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              className="font-serif text-5xl sm:text-6xl font-bold tracking-tight text-[#1C1917] dark:text-[#FAF8F5]"
            >
              {currentCount}
            </motion.span>
            <span className="font-serif text-lg text-[#A8A29E] dark:text-[#78716C]">
              / 108
            </span>
          </div>

          <div className="relative z-10 mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF3C7] dark:bg-[#78350F]/30 text-[#B45309] dark:text-[#FBBF24] text-xs font-semibold tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] animate-breath-slow" />
            <span>Tap to Count</span>
          </div>
        </button>

        {/* Mala & Session Info */}
        <div className="relative z-10 flex items-center justify-between text-xs text-[#78716C] dark:text-[#A8A29E] px-2">
          <span>Mala {currentMala}</span>
          <span className="font-medium">Today’s Japa: {stats.todayJapa}</span>
        </div>

        {/* Quick Link to Full Interactive Virtual Mala */}
        <div className="mt-4 pt-4 border-t border-[#F0EBE3] dark:border-[#2D2A26]">
          <button
            type="button"
            id="home-open-mala-btn"
            onClick={() => onNavigateTab('japa')}
            className="w-full py-2.5 px-4 rounded-xl bg-[#FAF5EE] hover:bg-[#F3EDE2] dark:bg-[#26221E] dark:hover:bg-[#2F2A25] text-xs font-semibold text-[#1C1917] dark:text-[#FAF8F5] flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>Open Virtual Mala Bead View</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </section>

      {/* STREAK & DAILY INTENTION SUMMARY */}
      <section className="grid grid-cols-2 gap-3">
        {/* Streak Card */}
        <div
          id="home-streak-card"
          onClick={() => onNavigateTab('progress')}
          className="rounded-3xl bg-white dark:bg-[#1C1917] border border-[#E7E2DA] dark:border-[#2D2A26] p-4 flex flex-col justify-between cursor-pointer hover:border-[#D6D1CA] transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#78716C] dark:text-[#A8A29E] uppercase tracking-wider">
              Streak
            </span>
            <Flame size={18} className="text-[#EA580C]" />
          </div>
          <div className="mt-2">
            <div className="font-serif text-2xl font-bold text-[#1C1917] dark:text-[#FAF8F5]">
              {stats.currentStreak} <span className="text-xs font-sans font-normal text-[#78716C]">Days</span>
            </div>
            <p className="text-[10px] text-[#A8A29E] mt-0.5">
              Best: {stats.longestStreak} days
            </p>
          </div>
        </div>

        {/* Daily Target Progress */}
        <div
          id="home-target-card"
          onClick={() => onNavigateTab('progress')}
          className="rounded-3xl bg-white dark:bg-[#1C1917] border border-[#E7E2DA] dark:border-[#2D2A26] p-4 flex flex-col justify-between cursor-pointer hover:border-[#D6D1CA] transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#78716C] dark:text-[#A8A29E] uppercase tracking-wider">
              Daily Target
            </span>
            <Target size={18} className="text-[#D97706]" />
          </div>
          <div className="mt-2">
            <div className="font-serif text-lg font-bold text-[#1C1917] dark:text-[#FAF8F5]">
              {stats.todayJapa} <span className="text-xs font-sans font-normal text-[#78716C]">/ {settings.dailyTarget}</span>
            </div>
            {/* Progress Bar */}
            <div className="mt-1.5 w-full bg-[#EAE5DE] dark:bg-[#2E2A26] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#D97706] h-full rounded-full transition-all duration-300"
                style={{ width: `${todayProgressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* FIRST JAPA WELCOME BANNER (If brand new) */}
      {stats.totalJapa === 0 && (
        <section className="p-4 rounded-3xl bg-[#FEF3C7]/60 dark:bg-[#78350F]/20 border border-[#FDE68A] dark:border-[#92400E]/40 text-left">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-2xl bg-[#D97706] text-white shrink-0">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="font-serif text-sm font-bold text-[#1C1917] dark:text-[#FAF8F5]">
                Begin Your Japa Journey
              </h3>
              <p className="text-xs text-[#78716C] dark:text-[#D6D3D1] mt-0.5 leading-relaxed">
                Start with your first Mala. Tap the counter above or open the interactive Mala.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* TODAY'S THOUGHT PREVIEW CARD */}
      <section
        id="home-daily-thought-card"
        onClick={() => onNavigateTab('wisdom')}
        className="rounded-3xl bg-white dark:bg-[#1C1917] border border-[#E7E2DA] dark:border-[#2D2A26] p-5 cursor-pointer hover:border-[#D6D1CA] transition-all group"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">🪷</span>
            <span className="text-xs font-semibold text-[#D97706] dark:text-[#F59E0B] uppercase tracking-wider">
              Today’s Thought
            </span>
          </div>
          <span className="text-xs font-medium text-[#78716C] group-hover:text-[#D97706] flex items-center gap-1 transition-colors">
            Read <ArrowRight size={12} />
          </span>
        </div>

        <p className="font-sanskrit text-sm font-semibold text-[#1C1917] dark:text-[#FAF8F5]">
          {dailyThought.sanskrit}
        </p>
        <p className="text-xs text-[#78716C] dark:text-[#A8A29E] mt-1 line-clamp-2 leading-relaxed">
          {dailyThought.englishMeaning}
        </p>
      </section>

      {/* "WHY?" DISCOVERY TEASER CARD */}
      <section
        id="home-why-discovery-card"
        onClick={() => onNavigateTab('wisdom')}
        className="rounded-3xl bg-[#FAF5EE] dark:bg-[#23201D] border border-[#E7E0D5] dark:border-[#2D2A26] p-5 cursor-pointer hover:border-[#D6D1CA] transition-all group"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <BookOpen size={15} className="text-[#D97706]" />
            <span className="text-xs font-semibold text-[#1C1917] dark:text-[#FAF8F5] uppercase tracking-wider">
              Did You Know?
            </span>
          </div>
          <span className="text-xs font-medium text-[#D97706] flex items-center gap-1">
            Why? <ArrowRight size={12} />
          </span>
        </div>

        <h4 className="font-serif text-sm font-bold text-[#1C1917] dark:text-[#FAF8F5]">
          {teaserWhy.question}
        </h4>
        <p className="text-xs text-[#78716C] dark:text-[#A8A29E] mt-1 line-clamp-2 leading-relaxed">
          {teaserWhy.shortAnswer}
        </p>
      </section>
    </div>
  );
};
