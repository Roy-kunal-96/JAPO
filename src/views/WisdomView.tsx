import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  HelpCircle,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Search,
  CheckCircle2,
  Share2,
  Layers,
  Compass,
  Bookmark
} from 'lucide-react';
import { SHLOKAS_COLLECTION, WHY_QUESTIONS, DAILY_THOUGHTS } from '../data/wisdom';

export const WisdomView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'shloka' | 'why' | 'thoughts'>('shloka');
  const [currentShlokaIndex, setCurrentShlokaIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedWhyId, setExpandedWhyId] = useState<string | null>(WHY_QUESTIONS[0].id);

  const currentShloka = SHLOKAS_COLLECTION[currentShlokaIndex % SHLOKAS_COLLECTION.length];

  // Filter Why questions
  const filteredWhyQuestions = WHY_QUESTIONS.filter(q => {
    const matchesCategory = selectedCategory === 'all' || q.category === selectedCategory;
    const matchesSearch =
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.shortAnswer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.practicalInterpretation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { id: 'all', label: 'All Questions' },
    { id: 'number108', label: '108 Sacred Number' },
    { id: 'mala', label: 'Mala & Meru Bead' },
    { id: 'mantra', label: 'Mantras & Om' },
    { id: 'practice', label: 'Science & Practice' },
    { id: 'philosophy', label: 'Philosophy' },
  ];

  return (
    <div className="flex-1 flex flex-col max-w-md mx-auto w-full px-4 pt-4 pb-24 space-y-5">
      {/* Header & Section Switcher */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-[#1C1917] dark:text-[#FAF8F5]">
          Spiritual Wisdom
        </h1>
        <p className="text-xs text-[#78716C] dark:text-[#A8A29E] mt-0.5 font-medium">
          Timeless shlokas, sacred insights, and the science of mantra.
        </p>

        {/* Tab Buttons */}
        <div className="mt-4 flex items-center bg-[#FAF5EE] dark:bg-[#26221E] p-1 rounded-2xl border border-[#E7E0D5] dark:border-[#38332E]">
          <button
            type="button"
            onClick={() => setActiveTab('shloka')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'shloka'
                ? 'bg-white dark:bg-[#1C1917] text-[#D97706] dark:text-[#F59E0B] shadow-xs'
                : 'text-[#78716C] dark:text-[#A8A29E]'
            }`}
          >
            <BookOpen size={14} />
            <span>One Shloka</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('why')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'why'
                ? 'bg-white dark:bg-[#1C1917] text-[#D97706] dark:text-[#F59E0B] shadow-xs'
                : 'text-[#78716C] dark:text-[#A8A29E]'
            }`}
          >
            <HelpCircle size={14} />
            <span>🕉️ WHY?</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('thoughts')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'thoughts'
                ? 'bg-white dark:bg-[#1C1917] text-[#D97706] dark:text-[#F59E0B] shadow-xs'
                : 'text-[#78716C] dark:text-[#A8A29E]'
            }`}
          >
            <Sparkles size={14} />
            <span>Thoughts</span>
          </button>
        </div>
      </div>

      {/* TAB 1: ONE SHLOKA */}
      {activeTab === 'shloka' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#78716C] dark:text-[#A8A29E] uppercase tracking-wider">
              {currentShloka.source} · {currentShloka.chapterVerse}
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() =>
                  setCurrentShlokaIndex(
                    prev => (prev - 1 + SHLOKAS_COLLECTION.length) % SHLOKAS_COLLECTION.length
                  )
                }
                aria-label="Previous Shloka"
                className="p-1.5 rounded-xl border border-[#E7E2DA] dark:border-[#2D2A26] bg-white dark:bg-[#1C1917] text-[#78716C] hover:text-[#1C1917] transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => setCurrentShlokaIndex(prev => (prev + 1) % SHLOKAS_COLLECTION.length)}
                aria-label="Next Shloka"
                className="p-1.5 rounded-xl border border-[#E7E2DA] dark:border-[#2D2A26] bg-white dark:bg-[#1C1917] text-[#78716C] hover:text-[#1C1917] transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Shloka Card */}
          <motion.div
            key={currentShloka.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="rounded-3xl bg-white dark:bg-[#1C1917] border border-[#E7E2DA] dark:border-[#2D2A26] p-6 shadow-sm space-y-5"
          >
            {/* Sanskrit Text */}
            <div className="text-center py-2">
              <p className="font-sanskrit text-xl sm:text-2xl font-bold text-[#1C1917] dark:text-[#FAF8F5] leading-relaxed whitespace-pre-line tracking-wide">
                {currentShloka.sanskrit}
              </p>
              <p className="text-xs text-[#78716C] dark:text-[#A8A29E] mt-3 italic leading-relaxed">
                {currentShloka.transliteration}
              </p>
            </div>

            {/* Hindi Meaning */}
            <div className="p-4 rounded-2xl bg-[#FAF5EE] dark:bg-[#23201D] border border-[#E7E0D5] dark:border-[#332F2B]">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#D97706] dark:text-[#F59E0B] mb-1">
                हिंदी भावार्थ
              </div>
              <p className="font-sanskrit text-xs text-[#44403C] dark:text-[#D6D3D1] leading-relaxed">
                {currentShloka.hindiMeaning}
              </p>
            </div>

            {/* English Meaning */}
            <div className="p-4 rounded-2xl bg-[#FAF5EE] dark:bg-[#23201D] border border-[#E7E0D5] dark:border-[#332F2B]">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#D97706] dark:text-[#F59E0B] mb-1">
                English Translation
              </div>
              <p className="text-xs text-[#44403C] dark:text-[#D6D3D1] leading-relaxed">
                {currentShloka.englishMeaning}
              </p>
            </div>

            {/* What can we learn? (Practical Life Lesson) */}
            <div className="p-4 rounded-2xl bg-[#FEF3C7]/40 dark:bg-[#78350F]/20 border border-[#FDE68A] dark:border-[#92400E]/40">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#B45309] dark:text-[#FBBF24] mb-1.5">
                <Sparkles size={14} />
                <span>What can we learn?</span>
              </div>
              <p className="text-xs text-[#78350F] dark:text-[#FEF3C7] leading-relaxed font-medium">
                {currentShloka.practicalLesson}
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* TAB 2: "WHY?" DISCOVERY */}
      {activeTab === 'why' && (
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78716C]" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search why 108, mala, mantras, tulsi..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-[#1C1917] border border-[#E7E2DA] dark:border-[#2D2A26] text-xs text-[#1C1917] dark:text-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#D97706]"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-[#D97706] text-white shadow-xs'
                    : 'bg-white dark:bg-[#1C1917] border border-[#E7E2DA] dark:border-[#2D2A26] text-[#78716C] dark:text-[#A8A29E]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Question Cards */}
          <div className="space-y-3">
            {filteredWhyQuestions.map(q => {
              const isExpanded = expandedWhyId === q.id;

              return (
                <motion.div
                  key={q.id}
                  className="rounded-3xl bg-white dark:bg-[#1C1917] border border-[#E7E2DA] dark:border-[#2D2A26] shadow-sm overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedWhyId(isExpanded ? null : q.id)}
                    className="w-full p-5 text-left flex items-start justify-between gap-3 cursor-pointer"
                  >
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#D97706] dark:text-[#F59E0B]">
                        🕉️ WHY?
                      </span>
                      <h3 className="font-serif text-sm font-bold text-[#1C1917] dark:text-[#FAF8F5] mt-1 leading-snug">
                        {q.question}
                      </h3>
                      <p className="text-xs text-[#78716C] dark:text-[#A8A29E] mt-1 line-clamp-2">
                        {q.shortAnswer}
                      </p>
                    </div>
                    <span className="text-[#A8A29E] text-xs font-bold mt-1">
                      {isExpanded ? '−' : '+'}
                    </span>
                  </button>

                  {/* Expanded Multi-Perspective Breakdown */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-5 pb-5 pt-1 border-t border-[#F0EBE3] dark:border-[#2D2A26] space-y-3 text-xs"
                      >
                        {/* Scriptural Context */}
                        <div className="p-3 rounded-2xl bg-[#FAF5EE] dark:bg-[#23201D] border border-[#E7E0D5] dark:border-[#332F2B]">
                          <div className="font-bold text-[#1C1917] dark:text-[#FAF8F5] mb-0.5 flex items-center gap-1.5">
                            <span>📜</span>
                            <span>Scriptural Tradition</span>
                          </div>
                          <p className="text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
                            {q.scripturalContext}
                          </p>
                        </div>

                        {/* Cultural Practice */}
                        <div className="p-3 rounded-2xl bg-[#FAF5EE] dark:bg-[#23201D] border border-[#E7E0D5] dark:border-[#332F2B]">
                          <div className="font-bold text-[#1C1917] dark:text-[#FAF8F5] mb-0.5 flex items-center gap-1.5">
                            <span>🪷</span>
                            <span>Cultural Practice</span>
                          </div>
                          <p className="text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
                            {q.culturalPractice}
                          </p>
                        </div>

                        {/* Practical / Scientific Interpretation */}
                        <div className="p-3 rounded-2xl bg-[#FEF3C7]/40 dark:bg-[#78350F]/20 border border-[#FDE68A] dark:border-[#92400E]/40">
                          <div className="font-bold text-[#B45309] dark:text-[#FBBF24] mb-0.5 flex items-center gap-1.5">
                            <span>🧠</span>
                            <span>Practical & Mindful Insight</span>
                          </div>
                          <p className="text-[#78350F] dark:text-[#FEF3C7] leading-relaxed">
                            {q.practicalInterpretation}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: DAILY THOUGHTS & REFLECTIONS */}
      {activeTab === 'thoughts' && (
        <div className="space-y-3">
          {DAILY_THOUGHTS.map(t => (
            <div
              key={t.id}
              className="rounded-3xl bg-white dark:bg-[#1C1917] border border-[#E7E2DA] dark:border-[#2D2A26] p-5 shadow-sm space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-[#D97706] tracking-wider">
                  🪷 Contemplation
                </span>
                <span className="text-[10px] text-[#A8A29E] font-medium">
                  {t.source}
                </span>
              </div>
              <p className="font-sanskrit text-base font-bold text-[#1C1917] dark:text-[#FAF8F5]">
                {t.sanskrit}
              </p>
              <p className="text-xs text-[#78716C] italic">
                {t.transliteration}
              </p>
              <p className="text-xs text-[#44403C] dark:text-[#D6D3D1] pt-1 leading-relaxed">
                <strong className="text-[#1C1917] dark:text-[#FAF8F5]">Meaning:</strong> {t.englishMeaning}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
