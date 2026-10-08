import React from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { X, BookOpen, Building2, Gavel, RefreshCw, Flame, Users, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

export const HowToPlayModal: React.FC = () => {
  const { setActiveModal } = useGameStore();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, rotate: -1 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        exit={{ opacity: 0, scale: 0.95, rotate: 1 }}
        className="neo-brutal bg-surface w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden relative my-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-4 border-border bg-primary shrink-0">
          <div className="flex items-center gap-4">
            <BookOpen className="w-8 h-8 stroke-[3] text-black" />
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-black text-black tracking-widest uppercase">How to Play ADIPOLY</h2>
              <p className="text-sm font-bold text-black/80">Original mechanics, economy, and chaos rules</p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="neo-brutal bg-white p-2 hover:bg-danger hover:text-white transition-colors"
          >
            <X className="w-6 h-6 stroke-[3]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-text bg-background">
          {/* Section 1 */}
          <div className="neo-brutal bg-white p-4 flex gap-4 transform hover:scale-[1.01] transition-transform shadow-[2px_2px_0px_0px_rgba(17,24,39,1)]">
            <div className="w-12 h-12 border-2 border-border bg-accent text-white flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6 stroke-[3]" />
            </div>
            <div>
              <h4 className="font-display font-black text-lg uppercase mb-1">1. Properties & Hubs</h4>
              <p className="text-sm font-bold text-muted">
                Land on tech sectors, clean energy plants, and logistics networks to purchase them. Complete clusters to charge multiplied rents. All transactions execute strictly server-side.
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="neo-brutal bg-white p-4 flex gap-4 transform hover:scale-[1.01] transition-transform shadow-[2px_2px_0px_0px_rgba(17,24,39,1)]">
            <div className="w-12 h-12 border-2 border-border bg-primary text-black flex items-center justify-center shrink-0">
              <RefreshCw className="w-6 h-6 stroke-[3]" />
            </div>
            <div>
              <h4 className="font-display font-black text-lg uppercase mb-1">2. Mortgages w/ Expiration</h4>
              <p className="text-sm font-bold text-muted">
                Need quick liquidity? Mortgage properties for cash. Unredeemed mortgages expire after a set grace period (default 5 turns). Expired properties immediately enter public auction!
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="neo-brutal bg-white p-4 flex gap-4 transform hover:scale-[1.01] transition-transform shadow-[2px_2px_0px_0px_rgba(17,24,39,1)]">
            <div className="w-12 h-12 border-2 border-border bg-success text-white flex items-center justify-center shrink-0">
              <Gavel className="w-6 h-6 stroke-[3]" />
            </div>
            <div>
              <h4 className="font-display font-black text-lg uppercase mb-1">3. Live Auction Engine</h4>
              <p className="text-sm font-bold text-muted">
                When a player skips buying or mortgage grace expires, the property hits the auction floor. Compete with simultaneous bids to claim valuable monopolies at discount rates.
              </p>
            </div>
          </div>

          {/* Section 4 */}
          <div className="neo-brutal bg-white p-4 flex gap-4 transform hover:scale-[1.01] transition-transform shadow-[2px_2px_0px_0px_rgba(17,24,39,1)]">
            <div className="w-12 h-12 border-2 border-border bg-danger text-white flex items-center justify-center shrink-0">
              <Flame className="w-6 h-6 stroke-[3]" />
            </div>
            <div>
              <h4 className="font-display font-black text-lg uppercase mb-1">4. Chaos Mode</h4>
              <p className="text-sm font-bold text-muted">
                Hosts can enable 13 original Chaos Modifiers: Double Rent, Reverse Direction, Teleporting Nodes, Flash Market Crashes, and Underdog Relief Grants for low-cash players.
              </p>
            </div>
          </div>

          {/* Section 5 */}
          <div className="neo-brutal bg-white p-4 flex gap-4 transform hover:scale-[1.01] transition-transform shadow-[2px_2px_0px_0px_rgba(17,24,39,1)]">
            <div className="w-12 h-12 border-2 border-border bg-accent text-white flex items-center justify-center shrink-0">
              <Users className="w-6 h-6 stroke-[3]" />
            </div>
            <div>
              <h4 className="font-display font-black text-lg uppercase mb-1">5. Trade Analyzer</h4>
              <p className="text-sm font-bold text-muted">
                Propose trades consisting of cash, properties, and assets. The ADIPOLY Analyzer evaluates fairness based on portfolio completion, rent potential, and cash flow.
              </p>
            </div>
          </div>

          {/* Section 6 */}
          <div className="neo-brutal bg-white p-4 flex gap-4 transform hover:scale-[1.01] transition-transform shadow-[2px_2px_0px_0px_rgba(17,24,39,1)]">
            <div className="w-12 h-12 border-2 border-border bg-primary text-black flex items-center justify-center shrink-0">
              <ShieldAlert className="w-6 h-6 stroke-[3]" />
            </div>
            <div>
              <h4 className="font-display font-black text-lg uppercase mb-1">6. Regulatory Detention</h4>
              <p className="text-sm font-bold text-muted">
                Sent to regulatory lockdown? Unlike old board games, entering detention pays you an immediate 10% cash dividend while restricting board movement.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t-4 border-border bg-surface flex justify-end shrink-0">
          <button
            onClick={() => setActiveModal(null)}
            className="neo-brutal py-3 px-8 font-black uppercase text-xl text-black bg-primary hover:bg-yellow-400 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] transition-all"
          >
            GOT IT
          </button>
        </div>
      </motion.div>
    </div>
  );
};
