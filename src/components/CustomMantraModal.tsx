import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Sparkles } from 'lucide-react';
import { Mantra } from '../types';

interface CustomMantraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (mantra: Omit<Mantra, 'id' | 'isCustom'>) => void;
}

export const CustomMantraModal: React.FC<CustomMantraModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [sanskrit, setSanskrit] = useState('');
  const [transliteration, setTransliteration] = useState('');
  const [meaning, setMeaning] = useState('');
  const [deity, setDeity] = useState('Personal / Ishta Devata');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !sanskrit.trim()) {
      setError('Please provide a name and mantra text.');
      return;
    }

    onSave({
      name: name.trim(),
      sanskrit: sanskrit.trim(),
      transliteration: transliteration.trim() || name.trim(),
      meaning: meaning.trim() || 'Custom personal intention and contemplation.',
      deity: deity.trim() || 'Personal Intention',
      recommendedCount: 108,
    });

    setName('');
    setSanskrit('');
    setTransliteration('');
    setMeaning('');
    setError('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-md rounded-3xl bg-[#FAF8F5] dark:bg-[#1C1917] border border-[#E7E2DA] dark:border-[#2D2A26] shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col"
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#E7E2DA] dark:border-[#2D2A26]">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#FEF3C7] dark:bg-[#78350F]/40 text-[#D97706] dark:text-[#F59E0B]">
                <Sparkles size={16} />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#1C1917] dark:text-[#FAF8F5]">
                Add Custom Mantra
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-[#78716C] hover:bg-[#EAE5DE] dark:hover:bg-[#2E2A26] transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 flex-1 overflow-y-auto space-y-4 pr-1">
            {error && (
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-400">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#57534E] dark:text-[#D6D3D1] mb-1">
                Mantra Title / Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g., Peace Affirmation or Hanuman Mantra"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#262320] border border-[#D6D1CA] dark:border-[#3D3833] text-sm text-[#1C1917] dark:text-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#D97706]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#57534E] dark:text-[#D6D3D1] mb-1">
                Mantra Text (Sanskrit / Script / Affirmation) *
              </label>
              <textarea
                rows={3}
                value={sanskrit}
                onChange={e => setSanskrit(e.target.value)}
                placeholder="e.g. ॐ नमो भगवते... or I am peaceful and calm."
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#262320] border border-[#D6D1CA] dark:border-[#3D3833] text-sm font-sanskrit text-[#1C1917] dark:text-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#D97706]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#57534E] dark:text-[#D6D3D1] mb-1">
                Transliteration / Pronunciation (Optional)
              </label>
              <input
                type="text"
                value={transliteration}
                onChange={e => setTransliteration(e.target.value)}
                placeholder="e.g., Om Namo Bhagavate..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#262320] border border-[#D6D1CA] dark:border-[#3D3833] text-xs text-[#1C1917] dark:text-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#D97706]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#57534E] dark:text-[#D6D3D1] mb-1">
                Meaning / Reflection (Optional)
              </label>
              <input
                type="text"
                value={meaning}
                onChange={e => setMeaning(e.target.value)}
                placeholder="Brief meaning or spiritual intention"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#262320] border border-[#D6D1CA] dark:border-[#3D3833] text-xs text-[#1C1917] dark:text-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#D97706]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#57534E] dark:text-[#D6D3D1] mb-1">
                Deity / Category (Optional)
              </label>
              <input
                type="text"
                value={deity}
                onChange={e => setDeity(e.target.value)}
                placeholder="e.g., Hanuman, Shiva, Peace, Gratitude"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#262320] border border-[#D6D1CA] dark:border-[#3D3833] text-xs text-[#1C1917] dark:text-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#D97706]"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-medium text-[#78716C] hover:bg-[#EAE5DE] dark:hover:bg-[#2E2A26] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-medium flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Plus size={14} />
                Save Mantra
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
