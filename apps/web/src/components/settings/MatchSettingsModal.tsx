import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import {
  X,
  Sliders,
  Users,
  IndianRupee,
  Flame,
  Shield,
  Clock,
  Sparkles,
  Layers,
} from 'lucide-react';
import {
  ALL_CHAOS_MODIFIERS,
  STARTING_MONEY_PRESETS,
} from '@adipoly/shared';
import type { ChaosModifierId, MatchSettings } from '@adipoly/shared';
import { motion } from 'framer-motion';

export const MatchSettingsModal: React.FC = () => {
  const { roomState, isHost, updateSettings, setActiveModal, showToast } = useGameStore();

  if (!roomState) return null;

  const hostMode = isHost();
  const [tab, setTab] = useState<'economy' | 'rules' | 'chaos' | 'jail' | 'speed'>('economy');

  // Local copy of settings to edit
  const [settings, setSettings] = useState<MatchSettings>(
    JSON.parse(JSON.stringify(roomState.settings))
  );

  const [isCustomMoney, setIsCustomMoney] = useState(
    !STARTING_MONEY_PRESETS.includes(settings.players.startingMoney as any)
  );
  const [customMoneyInput, setCustomMoneyInput] = useState(
    settings.players.startingMoney.toString()
  );

  const handleSave = () => {
    if (!hostMode) return;

    const finalMoney = isCustomMoney
      ? parseInt(customMoneyInput, 10) || 1500
      : settings.players.startingMoney;

    const payload: Partial<MatchSettings> = {
      ...settings,
      players: {
        ...settings.players,
        startingMoney: finalMoney,
      },
    };

    updateSettings(payload);
    showToast('Match settings updated', 'success');
    setActiveModal(null);
  };

  const toggleChaosModifier = (id: ChaosModifierId) => {
    if (!hostMode) return;
    const exists = settings.chaos.selectedModifiers.includes(id);
    const updated = exists
      ? settings.chaos.selectedModifiers.filter((m) => m !== id)
      : [...settings.chaos.selectedModifiers, id];

    setSettings({
      ...settings,
      chaos: {
        ...settings.chaos,
        selectedModifiers: updated,
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="neo-brutal bg-surface w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden relative"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-4 border-border bg-primary shrink-0">
          <div className="flex items-center gap-4">
            <Sliders className="w-8 h-8 stroke-[3] text-black" />
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-black text-black tracking-widest uppercase flex items-center gap-3">
                <span>Match Rules</span>
                {!hostMode && (
                  <span className="text-[10px] font-black tracking-widest px-2 py-1 bg-white border-2 border-border text-black">
                    READ-ONLY (HOST CONTROLS)
                  </span>
                )}
              </h2>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="neo-brutal bg-white p-2 hover:bg-danger hover:text-white transition-colors"
          >
            <X className="w-6 h-6 stroke-[3]" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b-4 border-border bg-white shrink-0 overflow-x-auto overflow-y-hidden">
          {[
            { id: 'economy', label: 'Economy', icon: IndianRupee },
            { id: 'rules', label: 'Rules', icon: Layers },
            { id: 'chaos', label: 'Chaos', icon: Flame },
            { id: 'jail', label: 'Detention', icon: Shield },
            { id: 'speed', label: 'Speed', icon: Clock },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id as any)}
                className={`flex items-center gap-2 py-4 px-6 font-black uppercase tracking-widest transition whitespace-nowrap border-r-4 border-border ${
                  tab === t.id
                    ? 'bg-black text-white'
                    : 'bg-white text-muted hover:bg-gray-100 hover:text-text'
                }`}
              >
                <Icon className="w-5 h-5 stroke-[3]" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-8 flex-1 bg-background text-text">
          {/* TAB 1: ECONOMY & PLAYERS */}
          {tab === 'economy' && (
            <div className="space-y-8">
              {/* Max Players */}
              <div>
                <label className="block text-sm font-black uppercase tracking-widest text-text mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 stroke-[3] text-primary" />
                  Max Players Limit (2 - 8)
                </label>
                <div className="grid grid-cols-7 gap-3">
                  {[2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <button
                      key={num}
                      type="button"
                      disabled={!hostMode || num < roomState.players.length}
                      onClick={() =>
                        setSettings({
                          ...settings,
                          players: { ...settings.players, maxPlayers: num },
                        })
                      }
                      className={`neo-brutal py-3 text-xl font-black transition ${
                        settings.players.maxPlayers === num
                          ? 'bg-primary text-black shadow-[2px_2px_0px_0px_rgba(17,24,39,1)]'
                          : 'bg-white text-muted hover:bg-gray-100 shadow-none hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)]'
                      } disabled:opacity-40 disabled:cursor-not-allowed`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                {roomState.players.length > 2 && (
                  <p className="text-xs font-bold text-danger mt-2">
                    Limit cannot be lower than current active player count ({roomState.players.length}).
                  </p>
                )}
              </div>

              {/* Starting Money */}
              <div>
                <label className="block text-sm font-black uppercase tracking-widest text-text mb-4 flex items-center gap-2">
                  <IndianRupee className="w-5 h-5 stroke-[3] text-success" />
                  Starting Capital (₹)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {STARTING_MONEY_PRESETS.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      disabled={!hostMode}
                      onClick={() => {
                        setSettings({
                          ...settings,
                          players: { ...settings.players, startingMoney: amt },
                        });
                        setIsCustomMoney(false);
                      }}
                      className={`neo-brutal py-3 text-sm font-bold transition ${
                        !isCustomMoney && settings.players.startingMoney === amt
                          ? 'bg-success text-white shadow-[2px_2px_0px_0px_rgba(17,24,39,1)]'
                          : 'bg-white text-muted hover:bg-gray-100 shadow-none hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)]'
                      } disabled:opacity-50`}
                    >
                      ₹{amt.toLocaleString()}
                    </button>
                  ))}
                  <button
                    type="button"
                    disabled={!hostMode}
                    onClick={() => setIsCustomMoney(true)}
                    className={`neo-brutal py-3 text-sm font-bold transition ${
                      isCustomMoney
                        ? 'bg-success text-white shadow-[2px_2px_0px_0px_rgba(17,24,39,1)]'
                        : 'bg-white text-muted hover:bg-gray-100 shadow-none hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)]'
                    } disabled:opacity-50`}
                  >
                    Custom
                  </button>
                </div>
                {isCustomMoney && (
                  <div className="mt-4">
                    <input
                      type="number"
                      min={100}
                      max={100000}
                      disabled={!hostMode}
                      value={customMoneyInput}
                      onChange={(e) => setCustomMoneyInput(e.target.value)}
                      className="neo-brutal w-full bg-white px-4 py-3 font-bold text-xl text-text placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-success"
                      placeholder="Enter amount in ₹"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: GAME RULES */}
          {tab === 'rules' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    key: 'tradingEnabled',
                    title: 'Property Trading',
                    desc: 'Negotiate and exchange cash and assets',
                  },
                  {
                    key: 'auctionsEnabled',
                    title: 'Property Auctions',
                    desc: 'Unbought properties trigger public bidding',
                  },
                  {
                    key: 'tradeAnalyzerEnabled',
                    title: 'Trade Analyzer',
                    desc: 'Advisory analysis on equity balance of trades',
                  },
                  {
                    key: 'mortgagesEnabled',
                    title: 'Mortgages',
                    desc: 'Mortgage properties for quick capital',
                  },
                  {
                    key: 'eventsEnabled',
                    title: 'ADIPOLY Events',
                    desc: 'Market Pulse cards & economic surprises',
                  },
                  {
                    key: 'teamsEnabled',
                    title: 'Team Mode',
                    desc: 'Cooperative play in 2-4 teams',
                  },
                  {
                    key: 'chatEnabled',
                    title: 'Chat Enabled',
                    desc: 'Real-time text communication',
                  },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="neo-brutal bg-white p-4 flex items-start gap-4 cursor-pointer hover:shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:-translate-y-1 transition-all"
                  >
                    <input
                      type="checkbox"
                      disabled={!hostMode}
                      checked={(settings.rules as any)[item.key]}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          rules: {
                            ...settings.rules,
                            [item.key]: e.target.checked,
                          },
                        })
                      }
                      className="mt-1 w-5 h-5 border-2 border-border text-primary focus:ring-primary cursor-pointer disabled:opacity-50"
                    />
                    <div>
                      <span className="font-display font-black text-sm uppercase block text-text">{item.title}</span>
                      <span className="text-xs font-bold text-muted mt-1 block">
                        {item.desc}
                      </span>
                    </div>
                  </label>
                ))}
              </div>

              {/* Mortgage Expiration Grace Turns */}
              {settings.rules.mortgagesEnabled && (
                <div className="pt-6 border-t-4 border-border">
                  <label className="block text-sm font-black uppercase tracking-widest text-text mb-4">
                    Mortgage Expiration Grace Period
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {[
                      { turns: 3, label: '3 Turns' },
                      { turns: 4, label: '4 Turns' },
                      { turns: 5, label: '5 Turns' },
                      { turns: 6, label: '6 Turns' },
                      { turns: -1, label: 'Never' },
                    ].map((g) => (
                      <button
                        key={g.turns}
                        type="button"
                        disabled={!hostMode}
                        onClick={() =>
                          setSettings({
                            ...settings,
                            rules: { ...settings.rules, mortgageGraceTurns: g.turns },
                          })
                        }
                        className={`neo-brutal py-3 text-sm font-bold transition ${
                          settings.rules.mortgageGraceTurns === g.turns
                            ? 'bg-accent text-white shadow-[2px_2px_0px_0px_rgba(17,24,39,1)]'
                            : 'bg-white text-muted hover:bg-gray-100 shadow-none hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)]'
                        } disabled:opacity-50`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs font-bold text-danger mt-3">
                    If not repaid within grace turns, mortgaged properties automatically trigger forced auctions.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CHAOS MODE */}
          {tab === 'chaos' && (
            <div className="space-y-6">
              <div className="neo-brutal bg-danger p-6 text-white flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white text-danger border-4 border-border flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(17,24,39,1)]">
                    <Flame className="w-6 h-6 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="font-display font-black text-xl uppercase tracking-widest">Chaos Mode Master Switch</h4>
                    <p className="text-sm font-bold opacity-90 mt-1">
                      Inject wild events, fluctuating real estate prices, and unexpected turns
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    disabled={!hostMode}
                    checked={settings.chaos.chaosModeEnabled}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        chaos: {
                          ...settings.chaos,
                          chaosModeEnabled: e.target.checked,
                          selectedModifiers: e.target.checked
                            ? settings.chaos.selectedModifiers.length > 0
                              ? settings.chaos.selectedModifiers
                              : ['DOUBLE_RENT', 'RENT_SPIKE', 'POOR_GET_LUCKY']
                            : [],
                        },
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-16 h-8 bg-white border-4 border-border rounded-full peer peer-checked:after:translate-x-8 peer-checked:after:border-border after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-success"></div>
                </label>
              </div>

              {settings.chaos.chaosModeEnabled && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black uppercase tracking-widest text-text">
                      Select Modifiers ({settings.chaos.selectedModifiers.length} active):
                    </span>
                    {hostMode && (
                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={() =>
                            setSettings({
                              ...settings,
                              chaos: {
                                ...settings.chaos,
                                selectedModifiers: ALL_CHAOS_MODIFIERS.map((m) => m.id),
                              },
                            })
                          }
                          className="font-bold text-sm text-primary hover:underline"
                        >
                          SELECT ALL
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setSettings({
                              ...settings,
                              chaos: { ...settings.chaos, selectedModifiers: [] },
                            })
                          }
                          className="font-bold text-sm text-danger hover:underline"
                        >
                          CLEAR
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[360px] overflow-y-auto p-1">
                    {ALL_CHAOS_MODIFIERS.map((mod) => {
                      const isSelected = settings.chaos.selectedModifiers.includes(mod.id);
                      return (
                        <div
                          key={mod.id}
                          onClick={() => toggleChaosModifier(mod.id)}
                          className={`neo-brutal p-4 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-primary text-black shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] -translate-y-1'
                              : 'bg-white text-muted hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] hover:-translate-y-[1px]'
                          } ${!hostMode ? 'cursor-default' : ''}`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <span className={`font-display font-black uppercase text-sm flex items-center gap-2 ${isSelected ? 'text-black' : 'text-text'}`}>
                              {isSelected ? (
                                <Sparkles className="w-5 h-5 stroke-[3] text-black" />
                              ) : null}
                              {mod.name}
                            </span>
                            <span className="text-[10px] uppercase font-black px-2 py-1 bg-white border-2 border-border text-black">
                              {mod.category}
                            </span>
                          </div>
                          <p className={`text-xs font-bold ${isSelected ? 'text-black/80' : 'text-muted'}`}>
                            {mod.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: DETENTION & LAW */}
          {tab === 'jail' && (
            <div className="space-y-6">
              <label className="neo-brutal bg-white p-6 flex items-start gap-4 cursor-pointer hover:shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:-translate-y-1 transition-all">
                <input
                  type="checkbox"
                  disabled={!hostMode}
                  checked={settings.jail.jailEnabled}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      jail: { ...settings.jail, jailEnabled: e.target.checked },
                    })
                  }
                  className="mt-1 w-6 h-6 border-2 border-border text-accent focus:ring-accent cursor-pointer"
                />
                <div>
                  <span className="font-display font-black text-lg uppercase block text-text">
                    Regulatory Detention Enabled
                  </span>
                  <span className="text-sm font-bold text-muted block mt-1">
                    Players can be detained for violations and audit failures
                  </span>
                </div>
              </label>

              {settings.jail.jailEnabled && (
                <div className="space-y-6 pt-4">
                  <div>
                    <label className="block text-sm font-black uppercase tracking-widest text-text mb-4">
                      Detention Entry Dividend: {settings.jail.jailRewardPercent}%
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={25}
                      step={1}
                      disabled={!hostMode}
                      value={settings.jail.jailRewardPercent}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          jail: {
                            ...settings.jail,
                            jailRewardPercent: parseInt(e.target.value, 10),
                          },
                        })
                      }
                      className="w-full accent-accent h-4 bg-border appearance-none cursor-pointer"
                    />
                    <p className="text-xs font-bold text-muted mt-3">
                      Original ADIPOLY rule: entering detention grants the player {settings.jail.jailRewardPercent}% of their cash.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-black uppercase tracking-widest text-text mb-4">
                      Escape Condition
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { id: 'doubles_or_fee', label: 'Doubles or Fee' },
                        { id: 'fee_only', label: 'Bail Fee Only' },
                        { id: 'event_only', label: 'Event Card Only' },
                      ].map((esc) => (
                        <button
                          key={esc.id}
                          type="button"
                          disabled={!hostMode}
                          onClick={() =>
                            setSettings({
                              ...settings,
                              jail: { ...settings.jail, jailEscapeRules: esc.id as any },
                            })
                          }
                          className={`neo-brutal py-4 text-sm font-black uppercase transition ${
                            settings.jail.jailEscapeRules === esc.id
                              ? 'bg-accent text-white shadow-[4px_4px_0px_0px_rgba(17,24,39,1)]'
                              : 'bg-white text-muted hover:bg-gray-100 shadow-none hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)]'
                          } disabled:opacity-50`}
                        >
                          {esc.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: GAME SPEED */}
          {tab === 'speed' && (
            <div className="space-y-4">
              {[
                {
                  id: 'casual',
                  label: 'Casual (60s timer)',
                  desc: 'Relaxed turn timer, ideal for new players and deep negotiations',
                },
                {
                  id: 'normal',
                  label: 'Normal (30s timer)',
                  desc: 'Standard competitive pace with brisk action transitions',
                },
                {
                  id: 'fast',
                  label: 'Fast Blitz (15s timer)',
                  desc: 'Adrenaline-fueled lightning rounds with minimal hesitation',
                },
              ].map((sp) => (
                <div
                  key={sp.id}
                  onClick={() =>
                    hostMode &&
                    setSettings({ ...settings, speed: sp.id as any })
                  }
                  className={`neo-brutal p-6 transition-all cursor-pointer ${
                    settings.speed === sp.id
                      ? 'bg-primary text-black shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] -translate-y-1'
                      : 'bg-white text-muted hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] hover:-translate-y-[1px]'
                  } ${!hostMode ? 'cursor-default' : ''}`}
                >
                  <span className={`font-display font-black text-xl uppercase block mb-1 ${settings.speed === sp.id ? 'text-black' : 'text-text'}`}>{sp.label}</span>
                  <span className={`text-sm font-bold ${settings.speed === sp.id ? 'text-black/80' : 'text-muted'}`}>{sp.desc}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t-4 border-border bg-surface flex items-center justify-between shrink-0">
          <button
            onClick={() => setActiveModal(null)}
            className="neo-brutal py-3 px-6 bg-white hover:bg-danger hover:text-white font-black text-lg transition-colors uppercase tracking-widest"
          >
            Cancel
          </button>
          {hostMode ? (
            <button
              onClick={handleSave}
              className="neo-brutal py-3 px-8 bg-success hover:bg-green-400 text-black font-black text-xl hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] transition-all uppercase tracking-widest"
            >
              SAVE CONFIG
            </button>
          ) : (
            <button
              onClick={() => setActiveModal(null)}
              className="neo-brutal py-3 px-8 bg-primary hover:bg-yellow-400 text-black font-black text-xl transition-all uppercase tracking-widest"
            >
              CLOSE
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
