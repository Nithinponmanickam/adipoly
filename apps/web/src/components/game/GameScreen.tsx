import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { Board } from '../board/Board.js';
import { GameControls } from './GameControls.js';
import { ChatPanel } from '../lobby/ChatPanel.js';
import { SpaceInspectModal } from '../board/SpaceInspectModal.js';
import { MessageSquare, Users, X } from 'lucide-react';

export const GameScreen: React.FC = () => {
  const { roomState, currentPlayerId } = useGameStore();
  const [chatOpen, setChatOpen] = useState(false);
  const [rosterOpen, setRosterOpen] = useState(false);

  if (!roomState) return null;

  const activePlayer = roomState.gameState && roomState.players
    ? roomState.players[roomState.gameState.activePlayerIndex] || roomState.players[0]
    : undefined;
  const isMyTurn = activePlayer?.id === currentPlayerId;
  const myPlayer = roomState.players.find((p) => p.id === currentPlayerId);

  const renderRosterCards = () => (
    <div className="flex flex-col gap-2.5 p-3">
      {roomState.players.map((p, index) => {
        const isCurrentTurn = roomState.gameState?.activePlayerIndex === index;
        const color = p.color || '#3B82F6';
        const ownedCount = Object.values(roomState.gameState?.properties || {}).filter(
          (prop) => prop.ownerId === p.id
        ).length;

        return (
          <div
            key={p.id}
            className={`neo-brutal p-2.5 flex flex-col gap-1 relative overflow-hidden transition-all ${
              isCurrentTurn
                ? 'bg-primary/10 border-primary shadow-[3px_3px_0px_0px_rgba(17,24,39,1)]'
                : 'bg-white shadow-[2px_2px_0px_0px_rgba(17,24,39,1)]'
            }`}
          >
            <div
              className="absolute top-0 left-0 bottom-0 w-2 border-r border-border"
              style={{ backgroundColor: color }}
            />
            <div className="pl-2 flex items-center justify-between">
              <span className="font-black text-sm truncate uppercase">{p.displayName}</span>
              {p.isHost && (
                <span className="text-[8px] font-black bg-black text-white px-1.5 py-0.2 tracking-wider">
                  HOST
                </span>
              )}
            </div>
            <div className="pl-2 flex items-center justify-between">
              <span className="font-bold text-[11px] text-muted uppercase tracking-wider">Net Worth</span>
              <span className="font-black text-base text-success flex items-center gap-0.5">
                ₹{(p.money ?? roomState.settings.players.startingMoney).toLocaleString()}
              </span>
            </div>
            <div className="pl-2 flex items-center justify-between text-[10px] text-muted font-bold">
              <span>PROPERTIES</span>
              <span className="font-black text-black bg-gray-100 px-1.5 py-0.2 border border-border">
                {ownedCount}
              </span>
            </div>
            {isCurrentTurn && (
              <div className="absolute top-2 right-2 flex items-center gap-1">
                <span className="text-[8px] font-black text-primary uppercase bg-white border border-border px-1 py-0.2">
                  TURN
                </span>
                <span className="animate-ping bg-primary w-2 h-2 rounded-full border border-black" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="flex-1 h-full flex flex-col md:flex-row overflow-hidden bg-background relative">
      {/* Mobile Top Status & Drawer Toggles */}
      <div className="md:hidden border-b-3 border-border bg-surface px-2.5 py-1.5 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1">
            <span
              className={`w-2 h-2 rounded-full border border-black ${
                isMyTurn ? 'bg-success animate-pulse' : 'bg-primary'
              }`}
            />
            {isMyTurn ? 'YOUR TURN' : `${activePlayer?.displayName || 'Player'}'s turn`}
          </span>
          {myPlayer && (
            <span className="font-black text-xs text-success bg-white px-1.5 py-0.5 border border-border shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
              ₹{(myPlayer.money ?? 1500).toLocaleString()}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setRosterOpen(!rosterOpen);
              if (chatOpen) setChatOpen(false);
            }}
            className="neo-brutal bg-white px-2 py-0.5 text-xs font-black uppercase flex items-center gap-1 hover:bg-gray-100 cursor-pointer"
          >
            <Users className="w-3.5 h-3.5 stroke-[3]" />
            <span>Roster</span>
          </button>
          <button
            onClick={() => {
              setChatOpen(!chatOpen);
              if (rosterOpen) setRosterOpen(false);
            }}
            className="neo-brutal bg-primary px-2 py-0.5 text-xs font-black uppercase flex items-center gap-1 hover:bg-yellow-400 cursor-pointer text-black"
          >
            <MessageSquare className="w-3.5 h-3.5 stroke-[3]" />
            <span>Chat</span>
          </button>
        </div>
      </div>

      {/* Desktop Left Sidebar: Roster + Controls + Chat Toggle */}
      <div className="hidden md:flex w-72 lg:w-80 border-r-4 border-border bg-white flex-col overflow-hidden shrink-0 z-10">
        <div className="p-3.5 border-b-4 border-border bg-primary flex items-center justify-between shrink-0">
          <h2 className="text-xl font-display font-black text-black uppercase tracking-widest">
            Roster
          </h2>
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className="neo-brutal bg-white px-2.5 py-1 hover:bg-black hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            title="Toggle Live Chat & Feed"
          >
            <MessageSquare className="w-3.5 h-3.5 stroke-[3]" />
            <span>Chat</span>
          </button>
        </div>

        {/* Player Roster List */}
        <div className="flex-1 overflow-y-auto">
          {renderRosterCards()}
        </div>

        {/* Sidebar Controls Dock */}
        <div className="border-t-4 border-border bg-surface p-2.5 shrink-0">
          <GameControls variant="sidebar" />
        </div>
      </div>

      {/* Main Board Arena (100% viewport fitted, zero cutoff) */}
      <div className="flex-1 min-h-0 flex items-center justify-center p-1 sm:p-2 md:p-3 overflow-hidden bg-background relative">
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#111827 2px, transparent 2px)`,
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <Board />
        </div>
      </div>

      {/* Mobile Dedicated Bottom Action Dock */}
      <div className="md:hidden shrink-0 z-20 border-t-3 border-border bg-surface px-3 py-2 shadow-[0_-3px_0_0_rgba(17,24,39,1)]">
        <GameControls variant="dock" />
      </div>

      {/* Mobile Roster Slide-Over Drawer */}
      <div
        className={`fixed inset-y-0 left-0 w-[300px] bg-white border-r-4 border-border transform transition-transform duration-300 z-50 flex flex-col shadow-[8px_0_0_0_rgba(17,24,39,0.1)] md:hidden ${
          rosterOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b-4 border-border bg-primary flex justify-between items-center shrink-0">
          <span className="font-display font-black text-xl uppercase tracking-wider text-black">
            Match Roster
          </span>
          <button
            onClick={() => setRosterOpen(false)}
            className="neo-brutal bg-white p-1 hover:bg-danger hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[3]" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {renderRosterCards()}
        </div>
      </div>

      {/* Live Chat & Game Feed Slide-Over Drawer (Mobile & Desktop) */}
      <div
        className={`fixed inset-y-0 right-0 w-[340px] sm:w-[380px] bg-card border-l-4 border-border transform transition-transform duration-300 z-50 flex flex-col shadow-[-8px_0_0_0_rgba(17,24,39,0.1)] ${
          chatOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 border-b-4 border-border bg-primary flex justify-between items-center shrink-0">
          <span className="font-display font-black text-xl uppercase tracking-wider text-black">
            Game Feed & Chat
          </span>
          <button
            onClick={() => setChatOpen(false)}
            className="neo-brutal bg-white p-1 hover:bg-danger hover:text-white transition-colors cursor-pointer"
            title="Close feed"
          >
            <X className="w-5 h-5 stroke-[3]" />
          </button>
        </div>
        <div className="flex-1 overflow-hidden relative p-3">
          <ChatPanel />
        </div>
      </div>

      {/* Property Details Inspection Modal */}
      <SpaceInspectModal />
    </div>
  );
};
