import React from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { PlusCircle, LogIn, HelpCircle, Shield, Zap, Sparkles, Building2, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

export const HomeScreen: React.FC = () => {
  const { setActiveModal } = useGameStore();

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 max-w-5xl mx-auto w-full relative">
      {/* Hero Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="neo-brutal bg-primary px-4 py-2 font-black uppercase tracking-widest text-black mb-8 flex items-center gap-2"
      >
        <Sparkles className="w-5 h-5 stroke-[3]" />
        Original Multiplayer Board Game
      </motion.div>

      {/* Main Title & Subtitle */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center max-w-3xl mb-12"
      >
        <h1 className="text-7xl sm:text-9xl font-display font-black tracking-tighter text-text mb-6 drop-shadow-[6px_6px_0_rgba(17,24,39,1)]">
          ADI<span className="text-accent">POLY</span>
        </h1>
        <p className="text-xl sm:text-2xl font-bold text-text bg-white neo-brutal p-4 inline-block transform rotate-1">
          The property negotiation & corporate strategy game.
        </p>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row items-center gap-6 w-full max-w-2xl mb-16"
      >
        <button
          onClick={() => setActiveModal('CREATE')}
          className="neo-brutal w-full flex items-center justify-center gap-3 py-6 px-8 font-black text-2xl text-black bg-success hover:bg-green-400 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] transition-all"
        >
          <PlusCircle className="w-8 h-8 stroke-[3]" />
          <span>CREATE GAME</span>
        </button>

        <button
          onClick={() => setActiveModal('JOIN')}
          className="neo-brutal w-full flex items-center justify-center gap-3 py-6 px-8 font-black text-2xl text-black bg-primary hover:bg-yellow-400 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] transition-all"
        >
          <LogIn className="w-8 h-8 stroke-[3]" />
          <span>JOIN GAME</span>
        </button>
      </motion.div>

      {/* Secondary Action */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-16"
      >
        <button
          onClick={() => setActiveModal('HOW_TO_PLAY')}
          className="neo-brutal bg-white px-6 py-3 font-bold text-lg flex items-center gap-2 hover:bg-gray-100 transition-colors"
        >
          <HelpCircle className="w-5 h-5 stroke-[3]" />
          <span>HOW TO PLAY</span>
        </button>
      </motion.div>

      {/* Pillars / Feature Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full"
      >
        <div className="neo-brutal bg-white p-6 flex flex-col items-center text-center transform -rotate-1 hover:rotate-0 transition-transform">
          <div className="w-16 h-16 bg-accent border-4 border-border rounded-full flex items-center justify-center mb-4 shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] text-white">
            <Building2 className="w-8 h-8 stroke-[3]" />
          </div>
          <h3 className="font-display font-black text-xl mb-2 uppercase">Corporate</h3>
          <p className="font-bold text-sm text-muted">Acquire industries & build tech clusters.</p>
        </div>

        <div className="neo-brutal bg-white p-6 flex flex-col items-center text-center transform rotate-1 hover:rotate-0 transition-transform">
          <div className="w-16 h-16 bg-danger border-4 border-border rounded-full flex items-center justify-center mb-4 shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] text-white">
            <Flame className="w-8 h-8 stroke-[3]" />
          </div>
          <h3 className="font-display font-black text-xl mb-2 uppercase">Chaos Mode</h3>
          <p className="font-bold text-sm text-muted">13 wildcards to shake up the board rules.</p>
        </div>

        <div className="neo-brutal bg-white p-6 flex flex-col items-center text-center transform -rotate-1 hover:rotate-0 transition-transform">
          <div className="w-16 h-16 bg-success border-4 border-border rounded-full flex items-center justify-center mb-4 shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] text-white">
            <Zap className="w-8 h-8 stroke-[3]" />
          </div>
          <h3 className="font-display font-black text-xl mb-2 uppercase">Instant</h3>
          <p className="font-bold text-sm text-muted">No login required. Seamless reconnects.</p>
        </div>

        <div className="neo-brutal bg-white p-6 flex flex-col items-center text-center transform rotate-1 hover:rotate-0 transition-transform">
          <div className="w-16 h-16 bg-primary border-4 border-border rounded-full flex items-center justify-center mb-4 shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] text-black">
            <Shield className="w-8 h-8 stroke-[3]" />
          </div>
          <h3 className="font-display font-black text-xl mb-2 uppercase">Secure</h3>
          <p className="font-bold text-sm text-muted">Server validates dice, money, & trades.</p>
        </div>
      </motion.div>
    </div>
  );
};
