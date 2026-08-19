import React, { useState, useEffect, useCallback } from 'react';
import {
  UserSettings,
  JapaSession,
  Mantra,
  ThemeMode
} from './types';
import { BUILT_IN_MANTRAS } from './data/mantras';
import {
  loadSettings,
  saveSettings,
  loadSessions,
  saveSessions,
  addSession,
  loadCustomMantras,
  saveCustomMantra,
  deleteCustomMantra,
  loadActiveCounterState,
  saveActiveCounterState,
  calculateStats,
  exportDataAsJson,
  exportDataAsCsv,
  resetAllData,
  getTodayDateString,
} from './utils/storage';
import { playBeadSound, triggerHaptic } from './utils/audioHaptics';

// Components & Views
import { Navbar, NavTab } from './components/Navbar';
import { MalaCompleteModal } from './components/MalaCompleteModal';
import { ConfirmationModal } from './components/ConfirmationModal';
import { CustomMantraModal } from './components/CustomMantraModal';
import { OnboardingModal } from './components/OnboardingModal';

import { HomeView } from './views/HomeView';
import { JapaView } from './views/JapaView';
import { ProgressView } from './views/ProgressView';
import { WisdomView } from './views/WisdomView';
import { SettingsView } from './views/SettingsView';
import { FocusModeView } from './views/FocusModeView';

export default function App() {
  // 1. Settings & Core State
  const [settings, setSettings] = useState<UserSettings>(() => loadSettings());
  const [sessions, setSessions] = useState<JapaSession[]>(() => loadSessions());
  const [customMantras, setCustomMantras] = useState<Mantra[]>(() => loadCustomMantras());
  
  // 2. Active Japa Counter State
  const [counterState, setCounterState] = useState(() => loadActiveCounterState());
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [isFocusMode, setIsFocusMode] = useState(false);

  // 3. Modals State
  const [isMalaCompleteOpen, setIsMalaCompleteOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(() => !settings.onboardingCompleted);
  const [isCustomMantraOpen, setIsCustomMantraOpen] = useState(false);
  
  // Confirmation Modal State
  const [confirmModalConfig, setConfirmModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    isDestructive?: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Find active selected mantra
  const allMantras = [...BUILT_IN_MANTRAS, ...customMantras];
  const selectedMantra =
    allMantras.find(m => m.id === settings.selectedMantraId) || BUILT_IN_MANTRAS[0];

  // Calculate live stats
  const stats = calculateStats(sessions, counterState.todayJapaCount);

  // Save settings when updated
  const handleUpdateSettings = useCallback((updates: Partial<UserSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...updates };
      saveSettings(next);
      return next;
    });
  }, []);

  // Save active counter state whenever it changes
  useEffect(() => {
    saveActiveCounterState(counterState);
  }, [counterState]);

  // Handle Theme (Light / Dark / System)
  useEffect(() => {
    const root = document.documentElement;
    const applyTheme = () => {
      let isDark = false;
      if (settings.theme === 'dark') {
        isDark = true;
      } else if (settings.theme === 'light') {
        isDark = false;
      } else {
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }

      if (isDark) {
        root.classList.add('dark');
        root.classList.remove('light');
        document.body.style.backgroundColor = '#121110';
      } else {
        root.classList.remove('dark');
        root.classList.add('light');
        document.body.style.backgroundColor = '#FAF8F5';
      }
    };

    applyTheme();

    if (settings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme();
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [settings.theme]);

  // Main Bead Tap / Count handler (Synchronous audio execution on user gesture stack)
  const handleTapCount = useCallback(() => {
    const nextCount = counterState.currentCount + 1;
    // Trigger sound & haptics immediately in the user interaction event loop
    playBeadSound(nextCount, settings.soundEnabled);
    triggerHaptic(nextCount, settings.hapticEnabled);

    setCounterState(prev => {
      const updatedCount = prev.currentCount + 1;
      const nextTodayCount = prev.todayJapaCount + 1;

      if (updatedCount >= 108) {
        setIsMalaCompleteOpen(true);
        return {
          ...prev,
          currentCount: 108,
          todayJapaCount: nextTodayCount,
        };
      }

      return {
        ...prev,
        currentCount: updatedCount,
        todayJapaCount: nextTodayCount,
      };
    });
  }, [counterState.currentCount, settings.soundEnabled, settings.hapticEnabled]);

  // Keyboard shortcut support (Space or Enter to count)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isMalaCompleteOpen || isOnboardingOpen || isCustomMantraOpen || confirmModalConfig.isOpen) {
        return;
      }
      if (e.code === 'Space' && (activeTab === 'home' || activeTab === 'japa' || isFocusMode)) {
        // Avoid scrolling on space
        const target = e.target as HTMLElement;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
          return;
        }
        e.preventDefault();
        handleTapCount();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleTapCount, activeTab, isFocusMode, isMalaCompleteOpen, isOnboardingOpen, isCustomMantraOpen, confirmModalConfig.isOpen]);

  // Modal Actions: Continue another Mala
  const handleContinueMala = useCallback(() => {
    setIsMalaCompleteOpen(false);
    setCounterState(prev => ({
      ...prev,
      currentCount: 1, // Advance to 1st bead of next round as specified
      currentMala: prev.currentMala + 1,
    }));
    // Play gentle feedback for starting new Mala
    playBeadSound(1, settings.soundEnabled);
    triggerHaptic(1, settings.hapticEnabled);
  }, [settings.soundEnabled, settings.hapticEnabled]);

  // Modal Actions: Finish session and commit
  const handleFinishSession = useCallback(() => {
    setIsMalaCompleteOpen(false);
    setIsFocusMode(false);

    // Save session to history
    if (counterState.todayJapaCount > 0) {
      const completedMalas = Math.max(1, counterState.currentMala);
      const newSession = addSession({
        date: getTodayDateString(),
        mantraId: selectedMantra.id,
        mantraName: selectedMantra.name,
        mantraSanskrit: selectedMantra.sanskrit,
        count: counterState.todayJapaCount,
        malasCompleted: completedMalas,
        durationSeconds: Math.round((Date.now() - counterState.startTime) / 1000),
        sessionType: 'standard',
      });
      setSessions(loadSessions());
    }

    // Reset active counter for fresh next session
    setCounterState({
      currentCount: 0,
      currentMala: 1,
      todayJapaCount: 0,
      startTime: Date.now(),
    });
  }, [counterState, selectedMantra]);

  // Reset current session with confirmation
  const handleRequestResetSession = useCallback(() => {
    setConfirmModalConfig({
      isOpen: true,
      title: 'Reset Current Mala?',
      message: 'This will reset your current Mala count back to 0. Completed sessions in your history will not be affected.',
      confirmLabel: 'Reset Counter',
      isDestructive: false,
      onConfirm: () => {
        setCounterState(prev => ({
          ...prev,
          currentCount: 0,
        }));
        setConfirmModalConfig(c => ({ ...c, isOpen: false }));
      },
    });
  }, []);

  // Finish session button on Japa View
  const handleRequestFinishActiveSession = useCallback(() => {
    setConfirmModalConfig({
      isOpen: true,
      title: 'Finish Japa Session?',
      message: `Save your progress of ${counterState.currentCount} Japa and complete this session.`,
      confirmLabel: 'Save & Finish',
      isDestructive: false,
      onConfirm: () => {
        setConfirmModalConfig(c => ({ ...c, isOpen: false }));
        handleFinishSession();
        setActiveTab('home');
      },
    });
  }, [counterState.currentCount, handleFinishSession]);

  // Reset All Data
  const handleRequestResetAllData = useCallback(() => {
    setConfirmModalConfig({
      isOpen: true,
      title: 'Reset All Data?',
      message: 'This will permanently delete your Japa history, streaks, custom mantras, and settings from this device. This action cannot be undone.',
      confirmLabel: 'Delete Everything',
      isDestructive: true,
      onConfirm: () => {
        resetAllData();
        setSettings(loadSettings());
        setSessions([]);
        setCustomMantras([]);
        setCounterState({ currentCount: 0, currentMala: 1, todayJapaCount: 0, startTime: Date.now() });
        setConfirmModalConfig(c => ({ ...c, isOpen: false }));
        setActiveTab('home');
      },
    });
  }, []);

  // Save new custom mantra
  const handleSaveCustomMantra = useCallback((mantra: Omit<Mantra, 'id' | 'isCustom'>) => {
    const saved = saveCustomMantra(mantra);
    setCustomMantras(loadCustomMantras());
    handleUpdateSettings({ selectedMantraId: saved.id });
  }, [handleUpdateSettings]);

  // Delete custom mantra
  const handleDeleteCustomMantra = useCallback((id: string) => {
    deleteCustomMantra(id);
    setCustomMantras(loadCustomMantras());
    if (settings.selectedMantraId === id) {
      handleUpdateSettings({ selectedMantraId: BUILT_IN_MANTRAS[0].id });
    }
  }, [settings.selectedMantraId, handleUpdateSettings]);

  // Complete onboarding
  const handleCompleteOnboarding = useCallback((chosenMantraId: string, dailyTarget: number) => {
    handleUpdateSettings({
      selectedMantraId: chosenMantraId,
      dailyTarget,
      onboardingCompleted: true,
    });
    setIsOnboardingOpen(false);
  }, [handleUpdateSettings]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#121110] text-[#1C1917] dark:text-[#FAF8F5] flex flex-col font-sans transition-colors duration-200">
      {/* Top Safe Area / Status Bar Spacer */}
      <div className="h-[env(safe-area-inset-top,0px)]" />

      {/* Main Screen Router */}
      <main className="flex-1 flex flex-col">
        {activeTab === 'home' && (
          <HomeView
            currentCount={counterState.currentCount}
            currentMala={counterState.currentMala}
            selectedMantra={selectedMantra}
            settings={settings}
            stats={stats}
            onTapCount={handleTapCount}
            onNavigateTab={tab => setActiveTab(tab)}
            onEnterFocusMode={() => setIsFocusMode(true)}
            onToggleSound={() => {
              const next = !settings.soundEnabled;
              handleUpdateSettings({ soundEnabled: next });
              if (next) playBeadSound(1, true);
            }}
            onToggleHaptic={() => handleUpdateSettings({ hapticEnabled: !settings.hapticEnabled })}
          />
        )}

        {activeTab === 'japa' && (
          <JapaView
            currentCount={counterState.currentCount}
            currentMala={counterState.currentMala}
            todayJapaCount={stats.todayJapa}
            selectedMantra={selectedMantra}
            customMantras={customMantras}
            settings={settings}
            onTapCount={handleTapCount}
            onResetSession={handleRequestResetSession}
            onFinishSession={handleRequestFinishActiveSession}
            onSelectMantra={id => handleUpdateSettings({ selectedMantraId: id })}
            onEnterFocusMode={() => setIsFocusMode(true)}
            onToggleSound={() => {
              const next = !settings.soundEnabled;
              handleUpdateSettings({ soundEnabled: next });
              if (next) playBeadSound(1, true);
            }}
            onToggleHaptic={() => handleUpdateSettings({ hapticEnabled: !settings.hapticEnabled })}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressView
            stats={stats}
            sessions={sessions}
            settings={settings}
          />
        )}

        {activeTab === 'wisdom' && <WisdomView />}

        {activeTab === 'settings' && (
          <SettingsView
            settings={settings}
            customMantras={customMantras}
            onUpdateSettings={handleUpdateSettings}
            onOpenAddCustomMantra={() => setIsCustomMantraOpen(true)}
            onDeleteCustomMantra={handleDeleteCustomMantra}
            onExportJson={() => exportDataAsJson(sessions, settings, customMantras)}
            onExportCsv={() => exportDataAsCsv(sessions)}
            onRequestResetData={handleRequestResetAllData}
          />
        )}
      </main>

      {/* Bottom Navigation Dock (Visible when not in Focus Mode) */}
      {!isFocusMode && (
        <Navbar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          activeCount={counterState.currentCount}
        />
      )}

      {/* Fullscreen Distraction-Free Focus Mode */}
      {isFocusMode && (
        <FocusModeView
          currentCount={counterState.currentCount}
          totalTarget={108}
          currentMala={counterState.currentMala}
          selectedMantra={selectedMantra}
          settings={settings}
          onTapCount={handleTapCount}
          onExitFocusMode={() => setIsFocusMode(false)}
          onToggleSound={() => handleUpdateSettings({ soundEnabled: !settings.soundEnabled })}
        />
      )}

      {/* Mala Complete Modal */}
      <MalaCompleteModal
        isOpen={isMalaCompleteOpen}
        malasCompleted={counterState.currentMala}
        onContinue={handleContinueMala}
        onFinish={handleFinishSession}
        mantraName={selectedMantra.name}
      />

      {/* Onboarding Modal (3 screens max for first time) */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onComplete={handleCompleteOnboarding}
      />

      {/* Custom Mantra Modal */}
      <CustomMantraModal
        isOpen={isCustomMantraOpen}
        onClose={() => setIsCustomMantraOpen(false)}
        onSave={handleSaveCustomMantra}
      />

      {/* Safe Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModalConfig.isOpen}
        title={confirmModalConfig.title}
        message={confirmModalConfig.message}
        confirmLabel={confirmModalConfig.confirmLabel}
        isDestructive={confirmModalConfig.isDestructive}
        onConfirm={confirmModalConfig.onConfirm}
        onCancel={() => setConfirmModalConfig(c => ({ ...c, isOpen: false }))}
      />
    </div>
  );
}
