export type ThemeMode = 'light' | 'dark' | 'system';

export type SessionType = 'standard' | 'morning' | 'evening' | 'focus';

export interface Mantra {
  id: string;
  name: string;
  deity: string;
  sanskrit: string;
  transliteration: string;
  meaning: string;
  benefits?: string;
  recommendedCount?: number;
  isCustom?: boolean;
  createdAt?: string;
}

export interface UserSettings {
  selectedMantraId: string;
  dailyTarget: number; // e.g. 108, 216, 540, 1080 or custom
  hapticEnabled: boolean;
  soundEnabled: boolean;
  morningReminder: {
    enabled: boolean;
    time: string; // "06:30"
    target: number;
  };
  eveningReminder: {
    enabled: boolean;
    time: string; // "20:30"
    target: number;
  };
  theme: ThemeMode;
  onboardingCompleted: boolean;
  installedPwaPromptDismissed?: boolean;
}

export interface JapaSession {
  id: string;
  date: string; // YYYY-MM-DD
  timestamp: number;
  mantraId: string;
  mantraName: string;
  mantraSanskrit: string;
  count: number;
  malasCompleted: number;
  durationSeconds: number;
  sessionType: SessionType;
}

export interface JapaHistoryDay {
  date: string; // YYYY-MM-DD
  totalCount: number;
  malas: number;
  sessionsCount: number;
}

export interface Shloka {
  id: string;
  dayIndex: number;
  source: string;
  chapterVerse?: string;
  sanskrit: string;
  transliteration: string;
  hindiMeaning: string;
  englishMeaning: string;
  practicalLesson: string;
}

export interface WhyQuestion {
  id: string;
  question: string;
  category: 'mala' | 'number108' | 'mantra' | 'philosophy' | 'practice';
  shortAnswer: string;
  scripturalContext: string;
  culturalPractice: string;
  practicalInterpretation: string;
}

export interface DailyThought {
  id: string;
  sanskrit: string;
  transliteration: string;
  hindiMeaning: string;
  englishMeaning: string;
  source: string;
}

export interface JourneyMilestone {
  malas: number;
  japaCount: number;
  title: string;
  description: string;
  iconName: string;
}
