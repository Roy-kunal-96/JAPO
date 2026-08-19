import React, { useState } from 'react';
import {
  Sparkles,
  Target,
  Smartphone,
  Volume2,
  Bell,
  Sun,
  Moon,
  ShieldCheck,
  Download,
  Trash2,
  Plus,
  Trash,
  Check,
  Info
} from 'lucide-react';
import { UserSettings, Mantra, ThemeMode } from '../types';
import { BUILT_IN_MANTRAS } from '../data/mantras';
import { AppLogo } from '../components/AppLogo';

interface SettingsViewProps {
  settings: UserSettings;
  customMantras: Mantra[];
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onOpenAddCustomMantra: () => void;
  onDeleteCustomMantra: (id: string) => void;
  onExportJson: () => void;
  onExportCsv: () => void;
  onRequestResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  customMantras,
  onUpdateSettings,
  onOpenAddCustomMantra,
  onDeleteCustomMantra,
  onExportJson,
  onExportCsv,
  onRequestResetData,
}) => {
  const [customTargetInput, setCustomTargetInput] = useState<string>(
    [108, 216, 540, 1080].includes(settings.dailyTarget) ? '' : String(settings.dailyTarget)
  );
  const [notificationMsg, setNotificationMsg] = useState<string>('');

  const allMantras = [...BUILT_IN_MANTRAS, ...customMantras];

  const handleCustomTargetSave = () => {
    const val = parseInt(customTargetInput, 10);
    if (!isNaN(val) && val > 0 && val <= 10800) {
      onUpdateSettings({ dailyTarget: val });
    }
  };

  const requestNotificationPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          setNotificationMsg('Notifications enabled successfully.');
          new Notification('JAPO Reminder Test', {
            body: 'Gentle reminder: Take a moment for your daily Japa.',
            icon: '/favicon.ico',
          });
        } else {
          setNotificationMsg('Notification permission was not granted.');
        }
      } catch {
        setNotificationMsg('Notifications are not supported in this preview mode.');
      }
    } else {
      setNotificationMsg('Notifications are not supported on this device.');
    }
    setTimeout(() => setNotificationMsg(''), 4000);
  };

  return (
    <div className="flex-1 flex flex-col max-w-md mx-auto w-full px-4 pt-4 pb-24 space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-[#1C1917] dark:text-[#FAF8F5]">
          Settings
        </h1>
        <p className="text-xs text-[#78716C] dark:text-[#A8A29E] mt-0.5 font-medium">
          Personalize your mantra, practice reminders, and preferences.
        </p>
      </div>

      {/* 1. MANTRA SELECTION */}
      <section className="rounded-3xl bg-white dark:bg-[#1C1917] border border-[#E7E2DA] dark:border-[#2D2A26] p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#D97706]" />
            <h2 className="font-serif text-sm font-bold text-[#1C1917] dark:text-[#FAF8F5]">
              Default Focus Mantra
            </h2>
          </div>
          <button
            type="button"
            onClick={onOpenAddCustomMantra}
            className="text-xs font-semibold text-[#D97706] hover:text-[#B45309] flex items-center gap-1 cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Custom</span>
          </button>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar pr-1">
          {allMantras.map(m => {
            const isSelected = settings.selectedMantraId === m.id;
            return (
              <div
                key={m.id}
                className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                  isSelected
                    ? 'border-[#D97706] bg-[#FEF3C7]/40 dark:bg-[#78350F]/20'
                    : 'border-[#E7E2DA] dark:border-[#2D2A26] bg-white dark:bg-[#23201D]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ selectedMantraId: m.id })}
                  className="flex-1 text-left min-w-0 pr-2 cursor-pointer"
                >
                  <div className="font-sanskrit text-sm font-semibold text-[#1C1917] dark:text-[#FAF8F5] truncate">
                    {m.sanskrit}
                  </div>
                  <div className="text-[11px] text-[#78716C] dark:text-[#A8A29E] truncate">
                    {m.name} · {m.transliteration}
                  </div>
                </button>

                <div className="flex items-center gap-2 shrink-0">
                  {m.isCustom && (
                    <button
                      type="button"
                      onClick={() => onDeleteCustomMantra(m.id)}
                      title="Delete Custom Mantra"
                      className="p-1.5 text-[#A8A29E] hover:text-rose-600 transition-colors"
                    >
                      <Trash size={14} />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ selectedMantraId: m.id })}
                    className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                      isSelected
                        ? 'bg-[#D97706] border-[#D97706] text-white'
                        : 'border-[#D6D1CA] dark:border-[#44403C]'
                    }`}
                  >
                    {isSelected && <Check size={12} strokeWidth={3} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. DAILY TARGET */}
      <section className="rounded-3xl bg-white dark:bg-[#1C1917] border border-[#E7E2DA] dark:border-[#2D2A26] p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Target size={16} className="text-[#D97706]" />
          <h2 className="font-serif text-sm font-bold text-[#1C1917] dark:text-[#FAF8F5]">
            Daily Target (Japa / Day)
          </h2>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[108, 216, 540, 1080].map(val => (
            <button
              key={val}
              type="button"
              onClick={() => {
                onUpdateSettings({ dailyTarget: val });
                setCustomTargetInput('');
              }}
              className={`py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                settings.dailyTarget === val
                  ? 'bg-[#D97706] border-[#D97706] text-white shadow-xs'
                  : 'bg-white dark:bg-[#23201D] border-[#E7E2DA] dark:border-[#2D2A26] text-[#57534E] dark:text-[#D6D3D1]'
              }`}
            >
              {val}
            </button>
          ))}
        </div>

        {/* Custom Target Input */}
        <div className="pt-2 flex items-center gap-2">
          <input
            type="number"
            min="1"
            max="10800"
            value={customTargetInput}
            onChange={e => setCustomTargetInput(e.target.value)}
            placeholder="Custom target (e.g. 324)"
            className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-[#23201D] border border-[#D6D1CA] dark:border-[#3D3833] text-xs text-[#1C1917] dark:text-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#D97706]"
          />
          <button
            type="button"
            onClick={handleCustomTargetSave}
            className="px-4 py-2 rounded-xl bg-[#FAF5EE] hover:bg-[#F0EBE3] dark:bg-[#2D2824] dark:hover:bg-[#38332E] text-xs font-semibold text-[#1C1917] dark:text-[#FAF8F5] border border-[#E7E0D5] dark:border-[#3D3833] transition-colors cursor-pointer"
          >
            Set Custom
          </button>
        </div>
      </section>

      {/* 3. TACTILE & SOUND */}
      <section className="rounded-3xl bg-white dark:bg-[#1C1917] border border-[#E7E2DA] dark:border-[#2D2A26] p-5 shadow-sm divide-y divide-[#F0EBE3] dark:divide-[#2D2A26]">
        {/* Haptic Toggle */}
        <div className="py-3 first:pt-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#FAF5EE] dark:bg-[#26221E] text-[#D97706]">
              <Smartphone size={16} />
            </div>
            <div>
              <div className="text-xs font-bold text-[#1C1917] dark:text-[#FAF8F5]">
                Haptic Vibration
              </div>
              <div className="text-[11px] text-[#78716C] dark:text-[#A8A29E]">
                Tactile pulse on every bead and milestone
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onUpdateSettings({ hapticEnabled: !settings.hapticEnabled })}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
              settings.hapticEnabled ? 'bg-[#D97706] justify-end' : 'bg-[#D6D1CA] dark:bg-[#3D3833] justify-start'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
          </button>
        </div>

        {/* Sound Toggle */}
        <div className="py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#FAF5EE] dark:bg-[#26221E] text-[#D97706]">
              <Volume2 size={16} />
            </div>
            <div>
              <div className="text-xs font-bold text-[#1C1917] dark:text-[#FAF8F5] flex items-center gap-2">
                <span>Temple Bell / Bead Chime</span>
                {settings.soundEnabled && (
                  <button
                    type="button"
                    onClick={() => {
                      import('../utils/audioHaptics').then(m => m.playBeadSound(1, true));
                    }}
                    className="text-[10px] font-semibold text-[#D97706] bg-[#FEF3C7] dark:bg-[#78350F]/40 px-2 py-0.5 rounded-md hover:underline cursor-pointer"
                  >
                    Test Sound
                  </button>
                )}
              </div>
              <div className="text-[11px] text-[#78716C] dark:text-[#A8A29E]">
                Gentle harmonic tone on count & complete
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              const nextVal = !settings.soundEnabled;
              onUpdateSettings({ soundEnabled: nextVal });
              if (nextVal) {
                import('../utils/audioHaptics').then(m => m.playBeadSound(1, true));
              }
            }}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
              settings.soundEnabled ? 'bg-[#D97706] justify-end' : 'bg-[#D6D1CA] dark:bg-[#3D3833] justify-start'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
          </button>
        </div>
      </section>

      {/* 4. PRACTICE REMINDERS */}
      <section className="rounded-3xl bg-white dark:bg-[#1C1917] border border-[#E7E2DA] dark:border-[#2D2A26] p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell size={16} className="text-[#D97706]" />
            <h2 className="font-serif text-sm font-bold text-[#1C1917] dark:text-[#FAF8F5]">
              Practice Reminders
            </h2>
          </div>
          <button
            type="button"
            onClick={requestNotificationPermission}
            className="text-[11px] font-semibold text-[#D97706] hover:underline"
          >
            Test Alert
          </button>
        </div>

        {notificationMsg && (
          <div className="p-2.5 rounded-xl bg-[#FEF3C7]/60 dark:bg-[#78350F]/20 text-[11px] text-[#B45309] dark:text-[#FBBF24]">
            {notificationMsg}
          </div>
        )}

        {/* Morning Japa */}
        <div className="p-3 rounded-2xl bg-[#FAF5EE] dark:bg-[#23201D] border border-[#E7E0D5] dark:border-[#332F2B] flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-[#1C1917] dark:text-[#FAF8F5] flex items-center gap-1.5">
              <span>🌅</span>
              <span>Morning Japa</span>
            </div>
            <div className="text-[11px] text-[#78716C] dark:text-[#A8A29E] mt-0.5">
              Target: {settings.morningReminder.target} Japa
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="time"
              value={settings.morningReminder.time}
              onChange={e =>
                onUpdateSettings({
                  morningReminder: { ...settings.morningReminder, time: e.target.value },
                })
              }
              className="px-2 py-1 rounded-lg bg-white dark:bg-[#1C1917] border border-[#D6D1CA] dark:border-[#3D3833] text-xs text-[#1C1917] dark:text-[#FAF8F5]"
            />
            <button
              type="button"
              onClick={() =>
                onUpdateSettings({
                  morningReminder: {
                    ...settings.morningReminder,
                    enabled: !settings.morningReminder.enabled,
                  },
                })
              }
              className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                settings.morningReminder.enabled
                  ? 'bg-[#D97706] justify-end'
                  : 'bg-[#D6D1CA] dark:bg-[#3D3833] justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
            </button>
          </div>
        </div>

        {/* Evening Japa */}
        <div className="p-3 rounded-2xl bg-[#FAF5EE] dark:bg-[#23201D] border border-[#E7E0D5] dark:border-[#332F2B] flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-[#1C1917] dark:text-[#FAF8F5] flex items-center gap-1.5">
              <span>🌙</span>
              <span>Evening Japa</span>
            </div>
            <div className="text-[11px] text-[#78716C] dark:text-[#A8A29E] mt-0.5">
              Target: {settings.eveningReminder.target} Japa
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="time"
              value={settings.eveningReminder.time}
              onChange={e =>
                onUpdateSettings({
                  eveningReminder: { ...settings.eveningReminder, time: e.target.value },
                })
              }
              className="px-2 py-1 rounded-lg bg-white dark:bg-[#1C1917] border border-[#D6D1CA] dark:border-[#3D3833] text-xs text-[#1C1917] dark:text-[#FAF8F5]"
            />
            <button
              type="button"
              onClick={() =>
                onUpdateSettings({
                  eveningReminder: {
                    ...settings.eveningReminder,
                    enabled: !settings.eveningReminder.enabled,
                  },
                })
              }
              className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                settings.eveningReminder.enabled
                  ? 'bg-[#D97706] justify-end'
                  : 'bg-[#D6D1CA] dark:bg-[#3D3833] justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. THEME & APPEARANCE */}
      <section className="rounded-3xl bg-white dark:bg-[#1C1917] border border-[#E7E2DA] dark:border-[#2D2A26] p-5 shadow-sm space-y-3">
        <h2 className="font-serif text-sm font-bold text-[#1C1917] dark:text-[#FAF8F5]">
          Appearance Theme
        </h2>

        <div className="grid grid-cols-3 gap-2">
          {(['light', 'dark', 'system'] as ThemeMode[]).map(mode => (
            <button
              key={mode}
              type="button"
              onClick={() => onUpdateSettings({ theme: mode })}
              className={`py-2 px-3 rounded-xl border text-xs font-semibold capitalize transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                settings.theme === mode
                  ? 'bg-[#D97706] border-[#D97706] text-white shadow-xs'
                  : 'bg-white dark:bg-[#23201D] border-[#E7E2DA] dark:border-[#2D2A26] text-[#57534E] dark:text-[#D6D3D1]'
              }`}
            >
              {mode === 'light' && <Sun size={13} />}
              {mode === 'dark' && <Moon size={13} />}
              {mode === 'system' && <Sparkles size={13} />}
              <span>{mode}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 6. PRIVACY & LOCAL DATA */}
      <section className="rounded-3xl bg-white dark:bg-[#1C1917] border border-[#E7E2DA] dark:border-[#2D2A26] p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} className="text-emerald-600 dark:text-emerald-400" />
          <div>
            <h2 className="font-serif text-sm font-bold text-[#1C1917] dark:text-[#FAF8F5]">
              Your Japa, Your Device.
            </h2>
            <p className="text-[11px] text-[#78716C] dark:text-[#A8A29E]">
              100% private. No accounts, no trackers, all data stored on this device.
            </p>
          </div>
        </div>

        {/* Export & Reset Buttons */}
        <div className="space-y-2 pt-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              id="settings-export-json-btn"
              onClick={onExportJson}
              className="py-2.5 px-3 rounded-xl bg-[#FAF5EE] hover:bg-[#F0EBE3] dark:bg-[#282420] dark:hover:bg-[#332E29] text-xs font-semibold text-[#1C1917] dark:text-[#FAF8F5] border border-[#E7E0D5] dark:border-[#38332E] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download size={14} />
              <span>Export JSON</span>
            </button>
            <button
              type="button"
              id="settings-export-csv-btn"
              onClick={onExportCsv}
              className="py-2.5 px-3 rounded-xl bg-[#FAF5EE] hover:bg-[#F0EBE3] dark:bg-[#282420] dark:hover:bg-[#332E29] text-xs font-semibold text-[#1C1917] dark:text-[#FAF8F5] border border-[#E7E0D5] dark:border-[#38332E] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
          </div>

          <button
            type="button"
            id="settings-reset-data-btn"
            onClick={onRequestResetData}
            className="w-full py-2.5 px-3 rounded-xl border border-rose-200 dark:border-rose-900/50 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash2 size={14} />
            <span>Reset All Data</span>
          </button>
        </div>
      </section>

      {/* 7. ABOUT JAPO */}
      <section className="text-center py-4">
        <AppLogo size="md" showTagline={true} />
        <p className="text-[11px] text-[#A8A29E] mt-2">
          Version 1.0.0 · Offline-First Progressive Web App
        </p>
      </section>
    </div>
  );
};
