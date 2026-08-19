import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Flame,
  Calendar,
  Sparkles,
  Award,
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Lock,
  Layers
} from 'lucide-react';
import { JapaStats, getTodayDateString } from '../utils/storage';
import { JapaSession, UserSettings } from '../types';
import { JOURNEY_MILESTONES } from '../data/wisdom';

interface ProgressViewProps {
  stats: JapaStats;
  sessions: JapaSession[];
  settings: UserSettings;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  stats,
  sessions,
  settings,
}) => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');

  // Compute daily chart points for the selected range
  const chartDays = React.useMemo(() => {
    const numDays = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 14;
    const days: { dateStr: string; label: string; count: number; malas: number; isToday: boolean }[] = [];
    const today = new Date();

    for (let i = numDays - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      
      const dayName = d.toLocaleDateString('en-US', { weekday: 'narrow' });
      const shortDate = `${d.getMonth() + 1}/${d.getDate()}`;
      
      const historyEntry = stats.dailyHistory.find(h => h.date === dateStr);
      const count = historyEntry ? historyEntry.totalCount : 0;
      const malas = historyEntry ? historyEntry.malas : 0;
      
      days.push({
        dateStr,
        label: timeRange === 'week' ? dayName : shortDate,
        count,
        malas,
        isToday: dateStr === getTodayDateString(),
      });
    }
    return days;
  }, [timeRange, stats.dailyHistory]);

  const maxCount = Math.max(...chartDays.map(d => d.count), settings.dailyTarget, 108);

  const formatDisplayDate = (dateStr: string) => {
    const todayStr = getTodayDateString();
    if (dateStr === todayStr) return 'Today';
    
    const d = new Date(dateStr + 'T00:00:00');
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
    
    if (dateStr === yesterdayStr) return 'Yesterday';

    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex-1 flex flex-col max-w-md mx-auto w-full px-4 pt-4 pb-24 space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-[#1C1917] dark:text-[#FAF8F5]">
          Progress & Insights
        </h1>
        <p className="text-xs text-[#78716C] dark:text-[#A8A29E] mt-0.5 font-medium">
          A calm record of your spiritual devotion and consistency.
        </p>
      </div>

      {/* STREAK & CONSISTENCY HERO (Calm, non-aggressive) */}
      <section
        id="progress-streak-hero"
        className="rounded-3xl bg-gradient-to-br from-[#FAF5EE] to-[#F5EFE6] dark:from-[#24201C] dark:to-[#1C1917] border border-[#E7E0D5] dark:border-[#2D2A26] p-5 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FEF3C7] dark:bg-[#78350F]/40 flex items-center justify-center text-[#EA580C]">
              <Flame size={22} className="animate-gentle-pulse" />
            </div>
            <div>
              <div className="text-[11px] uppercase font-bold tracking-wider text-[#78716C] dark:text-[#A8A29E]">
                Practice Streak
              </div>
              <div className="font-serif text-2xl font-bold text-[#1C1917] dark:text-[#FAF8F5]">
                {stats.currentStreak} {stats.currentStreak === 1 ? 'Day' : 'Days'}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] text-[#A8A29E] font-medium">Longest Streak</div>
            <div className="font-serif text-sm font-bold text-[#D97706] dark:text-[#F59E0B]">
              {stats.longestStreak} days
            </div>
          </div>
        </div>

        <p className="text-[11px] text-[#78716C] dark:text-[#A8A29E] mt-3 pt-3 border-t border-[#EAE5DE] dark:border-[#2D2A26] leading-relaxed">
          {stats.currentStreak > 0
            ? '“Small daily drops of water fill the sacred ocean.” You are cultivating steady inner stillness.'
            : 'Start with just 1 Mala today to begin your unbroken rhythm of peace.'}
        </p>
      </section>

      {/* CORE STATS GRID */}
      <section className="grid grid-cols-3 gap-2.5">
        <div className="rounded-2xl bg-white dark:bg-[#1C1917] border border-[#E7E2DA] dark:border-[#2D2A26] p-3.5 text-center">
          <div className="text-[10px] uppercase font-semibold text-[#78716C] dark:text-[#A8A29E]">
            Today’s Japa
          </div>
          <div className="font-serif text-xl font-bold text-[#1C1917] dark:text-[#FAF8F5] mt-1">
            {stats.todayJapa}
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-[#1C1917] border border-[#E7E2DA] dark:border-[#2D2A26] p-3.5 text-center">
          <div className="text-[10px] uppercase font-semibold text-[#78716C] dark:text-[#A8A29E]">
            Total Japa
          </div>
          <div className="font-serif text-xl font-bold text-[#D97706] dark:text-[#F59E0B] mt-1">
            {stats.totalJapa.toLocaleString()}
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-[#1C1917] border border-[#E7E2DA] dark:border-[#2D2A26] p-3.5 text-center">
          <div className="text-[10px] uppercase font-semibold text-[#78716C] dark:text-[#A8A29E]">
            Total Malas
          </div>
          <div className="font-serif text-xl font-bold text-[#1C1917] dark:text-[#FAF8F5] mt-1">
            {stats.totalMalas}
          </div>
        </div>
      </section>

      {/* MINIMAL CLEAN ACTIVITY CHART */}
      <section className="rounded-3xl bg-white dark:bg-[#1C1917] border border-[#E7E2DA] dark:border-[#2D2A26] p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-serif text-base font-bold text-[#1C1917] dark:text-[#FAF8F5]">
              Daily Volume
            </h3>
            <span className="text-[11px] text-[#78716C] dark:text-[#A8A29E]">
              Target: {settings.dailyTarget} Japa / day
            </span>
          </div>

          {/* Time range selector */}
          <div className="flex items-center bg-[#FAF5EE] dark:bg-[#26221E] p-1 rounded-xl border border-[#E7E0D5] dark:border-[#38332E]">
            {(['week', 'month'] as const).map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setTimeRange(tab)}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg capitalize transition-colors cursor-pointer ${
                  timeRange === tab
                    ? 'bg-white dark:bg-[#1C1917] text-[#D97706] shadow-xs'
                    : 'text-[#78716C] dark:text-[#A8A29E]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Bar Visualizer */}
        <div className="h-36 flex items-end justify-between gap-1 pt-4 pb-2 border-b border-[#F0EBE3] dark:border-[#2D2A26]">
          {chartDays.map((d, idx) => {
            const heightPercent = maxCount > 0 ? Math.max(4, Math.round((d.count / maxCount) * 100)) : 4;
            const reachedTarget = d.count >= settings.dailyTarget && d.count > 0;

            return (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center h-full justify-end group relative"
              >
                {/* Tooltip on hover/touch */}
                <div className="opacity-0 group-hover:opacity-100 pointer-events-none absolute -top-8 px-2 py-1 rounded-md bg-[#1C1917] text-white text-[10px] whitespace-nowrap z-20 transition-opacity">
                  {d.count} Japa ({d.malas} malas)
                </div>

                <div
                  className={`w-full max-w-[28px] rounded-t-md transition-all duration-300 ${
                    d.isToday
                      ? 'bg-[#D97706]'
                      : reachedTarget
                      ? 'bg-[#E08A2A]'
                      : d.count > 0
                      ? 'bg-[#E89241]/50 dark:bg-[#D97706]/40'
                      : 'bg-[#EAE5DE] dark:bg-[#2E2A26]'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* Day labels below bars */}
        <div className="flex items-center justify-between text-[10px] text-[#A8A29E] font-medium pt-2">
          {chartDays.map((d, i) => (
            <span key={i} className={`flex-1 text-center ${d.isToday ? 'font-bold text-[#D97706]' : ''}`}>
              {d.label}
            </span>
          ))}
        </div>
      </section>

      {/* JAPA JOURNEY (Visual Milestone Roadmap) */}
      <section className="rounded-3xl bg-white dark:bg-[#1C1917] border border-[#E7E2DA] dark:border-[#2D2A26] p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-base">🪷</span>
          <div>
            <h3 className="font-serif text-base font-bold text-[#1C1917] dark:text-[#FAF8F5]">
              Your Japa Journey
            </h3>
            <p className="text-[11px] text-[#78716C] dark:text-[#A8A29E]">
              Timeless milestones of devotion and mindfulness.
            </p>
          </div>
        </div>

        <div className="space-y-4 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#EAE5DE] dark:before:bg-[#2E2A26]">
          {JOURNEY_MILESTONES.map((m, idx) => {
            const isUnlocked = stats.totalMalas >= m.malas;
            const progressPercent = Math.min(100, Math.round((stats.totalMalas / m.malas) * 100));

            return (
              <div key={idx} className="relative flex items-start gap-3.5 pl-1">
                {/* Node icon */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 text-xs ${
                    isUnlocked
                      ? 'bg-[#D97706] text-white shadow-xs'
                      : 'bg-[#FAF5EE] dark:bg-[#26221E] border border-[#D6D1CA] dark:border-[#3D3833] text-[#A8A29E]'
                  }`}
                >
                  {isUnlocked ? <CheckCircle2 size={14} /> : <Lock size={12} />}
                </div>

                <div className="flex-1 pb-1">
                  <div className="flex items-center justify-between">
                    <h4
                      className={`text-xs font-bold ${
                        isUnlocked
                          ? 'text-[#1C1917] dark:text-[#FAF8F5]'
                          : 'text-[#78716C] dark:text-[#A8A29E]'
                      }`}
                    >
                      {m.malas} {m.malas === 1 ? 'Mala' : 'Malas'} · {m.title}
                    </h4>
                    <span className="text-[10px] font-semibold text-[#D97706]">
                      {m.japaCount.toLocaleString()} Japa
                    </span>
                  </div>

                  <p className="text-[11px] text-[#78716C] dark:text-[#A8A29E] mt-0.5 leading-relaxed">
                    {m.description}
                  </p>

                  {!isUnlocked && (
                    <div className="mt-2 w-full bg-[#EAE5DE] dark:bg-[#2E2A26] h-1 rounded-full overflow-hidden">
                      <div
                        className="bg-[#D97706] h-full rounded-full transition-all"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* DAILY HISTORY LOG */}
      <section className="rounded-3xl bg-white dark:bg-[#1C1917] border border-[#E7E2DA] dark:border-[#2D2A26] p-5 shadow-sm">
        <h3 className="font-serif text-base font-bold text-[#1C1917] dark:text-[#FAF8F5] mb-3">
          Daily Log History
        </h3>

        {stats.dailyHistory.length === 0 ? (
          <div className="py-6 text-center text-xs text-[#A8A29E]">
            No completed sessions recorded yet. Start your first Mala!
          </div>
        ) : (
          <div className="divide-y divide-[#F0EBE3] dark:divide-[#2D2A26]">
            {stats.dailyHistory.slice(0, 15).map(h => (
              <div key={h.date} className="py-3 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-[#1C1917] dark:text-[#FAF8F5]">
                    {formatDisplayDate(h.date)}
                  </div>
                  <div className="text-[11px] text-[#78716C] dark:text-[#A8A29E]">
                    {h.malas} {h.malas === 1 ? 'Mala' : 'Malas'} completed
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-serif font-bold text-sm text-[#D97706] dark:text-[#F59E0B]">
                    {h.totalCount} Japa
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
