import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { X, Sparkles, Sliders, Users, IndianRupee } from 'lucide-react';
import { STARTING_MONEY_PRESETS, DEFAULT_STARTING_MONEY } from '@adipoly/shared';
import type { MatchSettings } from '@adipoly/shared';
import { motion } from 'framer-motion';

export const CreateGameModal: React.FC = () => {
  const { setActiveModal, createRoom, isLoading } = useGameStore();

  const [displayName, setDisplayName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [startingMoney, setStartingMoney] = useState<number>(DEFAULT_STARTING_MONEY);
  const [isCustomMoney, setIsCustomMoney] = useState(false);
  const [customMoneyInput, setCustomMoneyInput] = useState('1500');

  // Quick toggles
  const [chaosMode, setChaosMode] = useState(false);
  const [teamsEnabled, setTeamsEnabled] = useState(false);
  const [mortgagesEnabled, setMortgagesEnabled] = useState(true);
  const [tradingEnabled, setTradingEnabled] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;

    const money = isCustomMoney ? parseInt(customMoneyInput, 10) || 1500 : startingMoney;

    const initialSettings: Partial<MatchSettings> = {
      players: {
        maxPlayers,
        startingMoney: money,
        currencySymbol: '₹',
      },
      rules: {
        tradingEnabled,
        auctionsEnabled: true,
        mortgagesEnabled,
        mortgageGraceTurns: 5,
        tradeAnalyzerEnabled: true,
        eventsEnabled: true,
        teamsEnabled,
        chatEnabled: true,
      },
      chaos: {
        chaosModeEnabled: chaosMode,
        selectedModifiers: chaosMode ? ['DOUBLE_RENT', 'RENT_SPIKE'] : [],
      },
      jail: {
        jailEnabled: true,
        jailRewardPercent: 10,
        jailEscapeRules: 'doubles_or_fee',
      },
      speed: 'normal',
    };

    await createRoom(displayName.trim(), initialSettings);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, rotate: 1 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        exit={{ opacity: 0, scale: 0.95, rotate: -1 }}
        className="neo-brutal bg-surface w-full max-w-lg overflow-hidden relative my-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-4 border-border bg-success">
          <div className="flex items-center gap-4">
            <Sparkles className="w-8 h-8 stroke-[3] text-black" />
            <div>
              <h2 className="text-3xl font-display font-black text-black tracking-widest uppercase">Create Match</h2>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="neo-brutal bg-white p-2 hover:bg-danger hover:text-white transition-colors"
          >
            <X className="w-6 h-6 stroke-[3]" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8 bg-background">
          {/* Display Name */}
          <div>
            <label className="block text-sm font-black uppercase tracking-widest text-text mb-2">
              Display Name
            </label>
            <input
              type="text"
              required
              autoFocus
              maxLength={20}
              placeholder="e.g. Warren, Riya, Elon"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="neo-brutal w-full bg-white px-4 py-3 font-bold text-xl text-text placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-success transition"
            />
          </div>

          {/* Player Limit */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-black uppercase tracking-widest text-text flex items-center gap-2">
                <Users className="w-5 h-5 stroke-[3] text-primary" />
                Player Limit
              </label>
              <span className="text-lg font-black text-primary">{maxPlayers} MAX</span>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {[2, 3, 4, 5, 6, 7, 8].map((num) => (
                <button
                  type="button"
                  key={num}
                  onClick={() => setMaxPlayers(num)}
                  className={`neo-brutal py-2 text-xl font-black transition ${
                    maxPlayers === num
                      ? 'bg-primary text-black scale-[1.05] shadow-[2px_2px_0px_0px_rgba(17,24,39,1)]'
                      : 'bg-white text-muted hover:bg-gray-100 shadow-none hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)]'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Starting Money */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-black uppercase tracking-widest text-text flex items-center gap-2">
                <IndianRupee className="w-5 h-5 stroke-[3] text-success" />
                Starting Cash
              </label>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {STARTING_MONEY_PRESETS.map((amount) => (
                <button
                  type="button"
                  key={amount}
                  onClick={() => {
                    setStartingMoney(amount);
                    setIsCustomMoney(false);
                  }}
                  className={`neo-brutal py-2 text-sm font-bold transition ${
                    !isCustomMoney && startingMoney === amount
                      ? 'bg-success text-white shadow-[2px_2px_0px_0px_rgba(17,24,39,1)]'
                      : 'bg-white text-muted hover:bg-gray-100 shadow-none hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)]'
                  }`}
                >
                  ₹{amount}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setIsCustomMoney(true)}
                className={`neo-brutal py-2 text-sm font-bold transition ${
                  isCustomMoney
                    ? 'bg-success text-white shadow-[2px_2px_0px_0px_rgba(17,24,39,1)]'
                    : 'bg-white text-muted hover:bg-gray-100 shadow-none hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)]'
                }`}
              >
                CUSTOM
              </button>
            </div>
            {isCustomMoney && (
              <div className="mt-4">
                <input
                  type="number"
                  min={100}
                  max={50000}
                  step={100}
                  placeholder="Enter starting money in ₹"
                  value={customMoneyInput}
                  onChange={(e) => setCustomMoneyInput(e.target.value)}
                  className="neo-brutal w-full bg-white px-4 py-3 font-bold text-xl text-text placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-success"
                />
              </div>
            )}
          </div>

          {/* Quick Rules Toggles */}
          <div className="space-y-4 pt-4 border-t-4 border-border">
            <span className="text-sm font-black uppercase tracking-widest text-text block flex items-center gap-2">
              <Sliders className="w-5 h-5 stroke-[3] text-accent" />
              House Rules
            </span>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <label className="neo-brutal bg-white p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] transition-all">
                <input
                  type="checkbox"
                  checked={chaosMode}
                  onChange={(e) => setChaosMode(e.target.checked)}
                  className="w-5 h-5 border-2 border-border text-primary focus:ring-primary cursor-pointer"
                />
                <span className="font-bold text-text">Chaos Mode</span>
              </label>

              <label className="neo-brutal bg-white p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] transition-all">
                <input
                  type="checkbox"
                  checked={teamsEnabled}
                  onChange={(e) => setTeamsEnabled(e.target.checked)}
                  className="w-5 h-5 border-2 border-border text-accent focus:ring-accent cursor-pointer"
                />
                <span className="font-bold text-text">Team Play</span>
              </label>

              <label className="neo-brutal bg-white p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] transition-all">
                <input
                  type="checkbox"
                  checked={tradingEnabled}
                  onChange={(e) => setTradingEnabled(e.target.checked)}
                  className="w-5 h-5 border-2 border-border text-success focus:ring-success cursor-pointer"
                />
                <span className="font-bold text-text">Trading</span>
              </label>

              <label className="neo-brutal bg-white p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] transition-all">
                <input
                  type="checkbox"
                  checked={mortgagesEnabled}
                  onChange={(e) => setMortgagesEnabled(e.target.checked)}
                  className="w-5 h-5 border-2 border-border text-primary focus:ring-primary cursor-pointer"
                />
                <span className="font-bold text-text">Mortgages</span>
              </label>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || !displayName.trim()}
            className="neo-brutal w-full py-5 px-6 font-black text-2xl text-black bg-success hover:bg-green-400 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 uppercase"
          >
            {isLoading ? 'Creating...' : 'HOST MATCH'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
