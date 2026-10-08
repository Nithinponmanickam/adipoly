import React, { useEffect } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Toast: React.FC = () => {
  const { toast, clearToast } = useGameStore();

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      clearToast();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, clearToast]);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="fixed top-16 right-4 z-[100] max-w-sm w-full pointer-events-auto"
        >
          <div
            className={`neo-brutal p-4 flex items-start gap-3 border-4 shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] ${
              toast.type === 'error'
                ? 'bg-danger border-border text-white'
                : toast.type === 'success'
                ? 'bg-success border-border text-white'
                : 'bg-primary border-border text-black'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'error' ? (
                <AlertCircle className="w-5 h-5 stroke-[3]" />
              ) : toast.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 stroke-[3]" />
              ) : (
                <Info className="w-5 h-5 stroke-[3]" />
              )}
            </div>
            <div className="flex-1 text-sm font-bold mt-0.5">
              {toast.message}
            </div>
            <button
              onClick={clearToast}
              className="shrink-0 hover:scale-110 transition p-0.5"
            >
              <X className="w-5 h-5 stroke-[3]" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
