import { UserSettings, JapaSession, JapaHistoryDay, Mantra } from '../types';
import { BUILT_IN_MANTRAS } from '../data/mantras';

const SETTINGS_KEY = 'japo_user_settings_v1';
const SESSIONS_KEY = 'japo_sessions_v1';
const CUSTOM_MANTRAS_KEY = 'japo_custom_mantras_v1';
const ACTIVE_SESSION_KEY = 'japo_active_counter_v1';

export const DEFAULT_SETTINGS: UserSettings = {
  selectedMantraId: 'shiva_namah_shivaya',
  dailyTarget: 108,
  hapticEnabled: true,
  soundEnabled: true,
  morningReminder: {
    enabled: false,
    time: '06:30',
    target: 108,
  },
  eveningReminder: {
    enabled: false,
    time: '20:30',
    target: 108,
  },
  theme: 'light',
  onboardingCompleted: false,
};

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function loadSettings(): UserSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch (e) {
    console.error('Failed to load settings from storage', e);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: UserSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}

export function loadSessions(): JapaSession[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load sessions', e);
    return [];
  }
}

export function saveSessions(sessions: JapaSession[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch (e) {
    console.error('Failed to save sessions', e);
  }
}

export function addSession(session: Omit<JapaSession, 'id' | 'timestamp'>): JapaSession {
  const newSession: JapaSession = {
    ...session,
    id: `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: Date.now(),
  };

  const sessions = loadSessions();
  sessions.unshift(newSession);
  saveSessions(sessions);
  return newSession;
}

export function loadCustomMantras(): Mantra[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CUSTOM_MANTRAS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load custom mantras', e);
    return [];
  }
}

export function saveCustomMantra(mantra: Omit<Mantra, 'id' | 'isCustom'>): Mantra {
  const newMantra: Mantra = {
    ...mantra,
    id: `custom_${Date.now()}`,
    isCustom: true,
    createdAt: new Date().toISOString(),
  };

  const list = loadCustomMantras();
  list.unshift(newMantra);
  try {
    localStorage.setItem(CUSTOM_MANTRAS_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save custom mantra', e);
  }
  return newMantra;
}

export function deleteCustomMantra(id: string): void {
  const list = loadCustomMantras().filter(m => m.id !== id);
  try {
    localStorage.setItem(CUSTOM_MANTRAS_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to delete custom mantra', e);
  }
}

export interface ActiveCounterState {
  currentCount: number; // 0 to 108
  currentMala: number; // starts at 1
  todayJapaCount: number; // all japa done today
  startTime: number;
}

export function loadActiveCounterState(): ActiveCounterState {
  if (typeof window === 'undefined') {
    return { currentCount: 0, currentMala: 1, todayJapaCount: 0, startTime: Date.now() };
  }
  try {
    const raw = localStorage.getItem(ACTIVE_SESSION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Validate that the today date matches
      if (parsed.savedDate === getTodayDateString()) {
        return {
          currentCount: parsed.currentCount || 0,
          currentMala: parsed.currentMala || 1,
          todayJapaCount: parsed.todayJapaCount || 0,
          startTime: parsed.startTime || Date.now(),
        };
      }
    }
  } catch (e) {
    console.error('Failed to load active counter', e);
  }
  return { currentCount: 0, currentMala: 1, todayJapaCount: 0, startTime: Date.now() };
}

export function saveActiveCounterState(state: ActiveCounterState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(
      ACTIVE_SESSION_KEY,
      JSON.stringify({
        ...state,
        savedDate: getTodayDateString(),
      })
    );
  } catch (e) {
    console.error('Failed to save active counter state', e);
  }
}

// Compute streak and statistics
export interface JapaStats {
  todayJapa: number;
  todayMalas: number;
  totalJapa: number;
  totalMalas: number;
  currentStreak: number;
  longestStreak: number;
  daysPracticed: number;
  dailyHistory: JapaHistoryDay[];
}

export function calculateStats(sessions: JapaSession[], liveActiveCount: number = 0): JapaStats {
  const todayStr = getTodayDateString();
  const dayMap: Record<string, { totalCount: number; malas: number; sessionsCount: number }> = {};

  let totalJapa = 0;
  let totalMalas = 0;

  // Process historical sessions
  for (const s of sessions) {
    totalJapa += s.count;
    totalMalas += s.malasCompleted;

    if (!dayMap[s.date]) {
      dayMap[s.date] = { totalCount: 0, malas: 0, sessionsCount: 0 };
    }
    dayMap[s.date].totalCount += s.count;
    dayMap[s.date].malas += s.malasCompleted;
    dayMap[s.date].sessionsCount += 1;
  }

  // Include any live active uncommitted count for today in today's visual stats
  const todayHistorical = dayMap[todayStr]?.totalCount || 0;
  const todayTotalJapa = todayHistorical + liveActiveCount;
  const todayTotalMalas = (dayMap[todayStr]?.malas || 0) + Math.floor(liveActiveCount / 108);

  const dailyHistory: JapaHistoryDay[] = Object.keys(dayMap)
    .sort((a, b) => b.localeCompare(a))
    .map(date => ({
      date,
      totalCount: date === todayStr ? todayTotalJapa : dayMap[date].totalCount,
      malas: date === todayStr ? todayTotalMalas : dayMap[date].malas,
      sessionsCount: dayMap[date].sessionsCount,
    }));

  if (!dayMap[todayStr] && liveActiveCount > 0) {
    dailyHistory.unshift({
      date: todayStr,
      totalCount: liveActiveCount,
      malas: Math.floor(liveActiveCount / 108),
      sessionsCount: 1,
    });
  }

  // Calculate Streak (Calm, non-punishing)
  // Check daily occurrences back in time
  let currentStreak = 0;
  let longestStreak = 0;

  // Generate date array for calculation
  const datesWithPractice = new Set(Object.keys(dayMap).filter(d => dayMap[d].totalCount > 0));
  if (liveActiveCount > 0) {
    datesWithPractice.add(todayStr);
  }

  // Check current streak starting from today or yesterday (graceful)
  const d = new Date();
  let checkDate = new Date(d);
  const formattedToday = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
  
  const hasPracticedToday = datesWithPractice.has(formattedToday);
  
  if (!hasPracticedToday) {
    // If not practiced today, check if yesterday was practiced to keep streak alive
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const dateKey = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
    if (datesWithPractice.has(dateKey)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  // Calculate longest streak from all recorded unique dates
  const sortedDates = Array.from(datesWithPractice).sort();
  let tempStreak = 0;
  let prevDateMs: number | null = null;

  for (const dateStr of sortedDates) {
    const [y, m, day] = dateStr.split('-').map(Number);
    const dateObj = new Date(y, m - 1, day);
    const timeMs = dateObj.getTime();

    if (prevDateMs === null) {
      tempStreak = 1;
    } else {
      const diffDays = Math.round((timeMs - prevDateMs) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        tempStreak++;
      } else if (diffDays > 1) {
        tempStreak = 1;
      }
    }
    prevDateMs = timeMs;
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
  }

  if (currentStreak > longestStreak) {
    longestStreak = currentStreak;
  }

  return {
    todayJapa: todayTotalJapa,
    todayMalas: todayTotalMalas,
    totalJapa: totalJapa + liveActiveCount,
    totalMalas: totalMalas + Math.floor(liveActiveCount / 108),
    currentStreak: Math.max(currentStreak, datesWithPractice.size > 0 ? 1 : 0),
    longestStreak: Math.max(longestStreak, currentStreak),
    daysPracticed: datesWithPractice.size,
    dailyHistory,
  };
}

// Data Export to JSON & CSV
export function exportDataAsJson(sessions: JapaSession[], settings: UserSettings, customMantras: Mantra[]): void {
  const exportPayload = {
    app: 'JAPO — Smart Japa Companion',
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    settings,
    customMantras,
    sessions,
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `japo_backup_${getTodayDateString()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function exportDataAsCsv(sessions: JapaSession[]): void {
  const headers = ['Session ID', 'Date', 'Time', 'Mantra Name', 'Mantra Sanskrit', 'Japa Count', 'Malas Completed', 'Duration (Seconds)', 'Session Type'];
  
  const rows = sessions.map(s => [
    s.id,
    s.date,
    new Date(s.timestamp).toLocaleTimeString(),
    `"${s.mantraName.replace(/"/g, '""')}"`,
    `"${s.mantraSanskrit.replace(/"/g, '""')}"`,
    s.count,
    s.malasCompleted,
    s.durationSeconds,
    s.sessionType,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `japo_history_${getTodayDateString()}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function resetAllData(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(SETTINGS_KEY);
    localStorage.removeItem(SESSIONS_KEY);
    localStorage.removeItem(CUSTOM_MANTRAS_KEY);
    localStorage.removeItem(ACTIVE_SESSION_KEY);
  } catch (e) {
    console.error('Failed to reset all data', e);
  }
}
