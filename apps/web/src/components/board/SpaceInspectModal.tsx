import React from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { ADIPOLY_BOARD_SPACES } from '@adipoly/game-engine';
import { X, Building2, User, IndianRupee, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const SpaceInspectModal: React.FC = () => {
  const { selectedSpaceIndex, setSelectedSpaceIndex, roomState } = useGameStore();

  if (selectedSpaceIndex === null || selectedSpaceIndex === undefined) return null;

  const space = ADIPOLY_BOARD_SPACES[selectedSpaceIndex];
  if (!space) return null;

  const property = space.type === 'PROPERTY' ? roomState?.gameState?.properties[space.id] : undefined;
  const owner = property?.ownerId ? roomState?.players.find((p) => p.id === property.ownerId) : undefined;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="neo-brutal bg-surface w-full max-w-md overflow-hidden relative"
        >
          {/* Header */}
          <div
            className="p-6 border-b-4 border-border flex items-center justify-between"
            style={{ backgroundColor: space.groupColor || '#FDE047' }}
          >
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 stroke-[3] text-black" />
              <div>
                <h3 className="text-2xl font-display font-black text-black tracking-widest uppercase">
                  {space.name}
                </h3>
                <span className="text-xs font-black tracking-wider uppercase bg-black text-white px-2 py-0.5 border border-black">
                  {space.group || space.type}
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelectedSpaceIndex(null)}
              className="neo-brutal bg-white p-2 hover:bg-danger hover:text-white transition-colors"
              title="Close"
            >
              <X className="w-6 h-6 stroke-[3]" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4 bg-background">
            {space.description && (
              <p className="text-sm font-bold text-text bg-white p-3 border-2 border-border">
                {space.description}
              </p>
            )}

            {space.type === 'PROPERTY' && (
              <div className="space-y-3">
                {/* Pricing & Rent */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="neo-brutal bg-white p-3">
                    <span className="text-xs font-bold text-muted uppercase tracking-wider block">
                      Purchase Price
                    </span>
                    <span className="text-xl font-black text-success flex items-center gap-1">
                      <IndianRupee className="w-5 h-5 stroke-[3]" />
                      {space.price}
                    </span>
                  </div>
                  <div className="neo-brutal bg-white p-3">
                    <span className="text-xs font-bold text-muted uppercase tracking-wider block">
                      Base Rent
                    </span>
                    <span className="text-xl font-black text-primary flex items-center gap-1">
                      <IndianRupee className="w-5 h-5 stroke-[3]" />
                      {space.baseRent}
                    </span>
                  </div>
                </div>

                {/* Ownership info */}
                <div className="neo-brutal bg-white p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full border-2 border-border flex items-center justify-center font-black text-white text-lg"
                      style={{ backgroundColor: owner?.color || '#9CA3AF' }}
                    >
                      {owner ? owner.displayName.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-muted uppercase block">Current Owner</span>
                      <span className="font-black text-lg text-text">
                        {owner ? owner.displayName : 'Available for Acquisition'}
                      </span>
                    </div>
                  </div>
                  {owner ? (
                    <span className="text-xs font-black uppercase tracking-widest bg-success text-white px-2 py-1 border border-border">
                      ACQUIRED
                    </span>
                  ) : (
                    <span className="text-xs font-black uppercase tracking-widest bg-primary text-black px-2 py-1 border border-border">
                      FOR SALE
                    </span>
                  )}
                </div>

                {/* Mortgage value */}
                <div className="text-xs font-bold text-muted flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-accent" />
                  Mortgage value: ₹{Math.floor((space.price || 0) / 2)}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t-4 border-border bg-surface flex justify-end">
            <button
              onClick={() => setSelectedSpaceIndex(null)}
              className="neo-brutal py-2 px-6 bg-primary font-black uppercase text-sm hover:bg-yellow-400 transition"
            >
              CLOSE
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
