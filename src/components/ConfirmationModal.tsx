import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-sm rounded-3xl bg-[#FAF8F5] dark:bg-[#1C1917] border border-[#E7E2DA] dark:border-[#2D2A26] shadow-2xl p-6 text-center"
          role="dialog"
          aria-modal="true"
        >
          <div
            className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
              isDestructive
                ? 'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400'
                : 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400'
            }`}
          >
            <AlertCircle size={24} />
          </div>

          <h3 className="font-serif text-lg font-bold text-[#1C1917] dark:text-[#FAF8F5]">
            {title}
          </h3>

          <p className="text-xs text-[#78716C] dark:text-[#A8A29E] mt-2 leading-relaxed">
            {message}
          </p>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              id="confirm-modal-cancel"
              onClick={onCancel}
              className="flex-1 py-2.5 px-4 rounded-xl border border-[#D6D1CA] dark:border-[#3D3833] text-[#57534E] dark:text-[#D6D3D1] hover:bg-[#EFEAE2] dark:hover:bg-[#2A2622] text-xs font-medium transition-colors cursor-pointer"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              id="confirm-modal-confirm"
              onClick={onConfirm}
              className={`flex-1 py-2.5 px-4 rounded-xl text-white text-xs font-medium shadow-sm transition-colors cursor-pointer ${
                isDestructive
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : 'bg-[#D97706] hover:bg-[#B45309]'
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
