import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { PlayerList } from './PlayerList.js';
import { ChatPanel } from './ChatPanel.js';
import {
  Copy,
  Check,
  Share2,
  Play,
  CheckCircle,
  Sliders,
  LogOut,
  Flame,
  Shield,
  IndianRupee,
  MessageSquare
} from 'lucide-react';
import { MIN_PLAYERS } from '@adipoly/shared';

export const LobbyScreen: React.FC = () => {
  const {
    roomState,
    currentPlayerId,
    isHost,
    toggleReady,
    startGame,
    leaveRoom,
    setActiveModal,
    showToast,
  } = useGameStore();

  const [copied, setCopied] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  if (!roomState) return null;

  const currentPlayer = roomState.players.find((p) => p.id === currentPlayerId);
  const host = isHost();

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomState.roomCode);
    setCopied(true);
    showToast(`Room code ${roomState.roomCode} copied!`, 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareRoom = async () => {
    const shareText = `Join my ADIPOLY game! Room Code: ${roomState.roomCode}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ADIPOLY Multiplayer Game',
          text: shareText,
          url: window.location.href,
        });
      } catch {
        // User cancelled share
      }
    } else {
      copyRoomCode();
    }
  };

  const notReadyPlayers = roomState.players.filter((p) => !p.ready);
  const hasMinPlayers = roomState.players.length >= MIN_PLAYERS;
  const allReady = notReadyPlayers.length === 0;
  const canStart = hasMinPlayers && allReady;

  return (
    <div className="flex-1 w-full flex flex-col md:flex-row relative">
      {/* Main Content Area */}
      <div className={`flex-1 p-6 md:p-12 transition-all duration-300 ${chatOpen ? 'md:pr-[400px]' : ''} overflow-y-auto`}>
        
        {/* Header / Room Code */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
          <div className="neo-brutal bg-card p-6 flex items-center gap-6">
            <div className="flex flex-col">
              <span className="font-display font-black text-4xl tracking-widest text-primary">
                {roomState.roomCode}
              </span>
              <span className="text-sm font-bold uppercase tracking-widest text-muted mt-1">
                Room Code
              </span>
            </div>
            <div className="flex gap-2 border-l-2 border-border pl-6">
              <button
                onClick={copyRoomCode}
                className="neo-brutal bg-surface p-3 hover:bg-primary hover:text-black transition-colors"
                title="Copy Room Code"
              >
                {copied ? <Check className="w-5 h-5 stroke-[3]" /> : <Copy className="w-5 h-5 stroke-[3]" />}
              </button>
              <button
                onClick={shareRoom}
                className="neo-brutal bg-surface p-3 hover:bg-accent hover:text-white transition-colors"
                title="Share Invite"
              >
                <Share2 className="w-5 h-5 stroke-[3]" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveModal('SETTINGS')}
              className="neo-brutal bg-surface px-6 py-3 font-bold flex items-center gap-2 hover:bg-success hover:text-white transition-colors"
            >
              <Sliders className="w-5 h-5 stroke-[3]" />
              {host ? 'SETTINGS' : 'VIEW RULES'}
            </button>
            <button
              onClick={leaveRoom}
              className="neo-brutal bg-danger text-white px-6 py-3 font-bold flex items-center gap-2 hover:bg-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5 stroke-[3]" />
              LEAVE
            </button>
            <button
              onClick={() => setChatOpen(!chatOpen)}
              className="neo-brutal bg-primary text-black px-4 py-3 font-bold flex items-center gap-2 md:hidden"
            >
              <MessageSquare className="w-5 h-5 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Quick Settings Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <div className="neo-brutal bg-white px-4 py-2 font-bold flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-success stroke-[3]" />
            ₹{roomState.settings.players.startingMoney.toLocaleString()}
          </div>
          {roomState.settings.chaos.chaosModeEnabled && (
            <div className="neo-brutal bg-primary text-black px-4 py-2 font-bold flex items-center gap-2">
              <Flame className="w-5 h-5 stroke-[3]" />
              CHAOS MODE
            </div>
          )}
          {roomState.settings.rules.teamsEnabled && (
            <div className="neo-brutal bg-accent text-white px-4 py-2 font-bold flex items-center gap-2">
              <Shield className="w-5 h-5 stroke-[3]" />
              TEAMS
            </div>
          )}
        </div>

        {/* Seats Grid */}
        <PlayerList />

        {/* Action Bar Bottom */}
        <div className="mt-16 flex flex-col items-center">
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => toggleReady(!currentPlayer?.ready)}
              className={`neo-brutal px-8 py-4 font-black text-xl flex items-center gap-3 transition-colors ${
                currentPlayer?.ready ? 'bg-success text-white' : 'bg-surface text-text hover:bg-primary'
              }`}
            >
              <CheckCircle className="w-6 h-6 stroke-[3]" />
              {currentPlayer?.ready ? 'READY' : 'SET READY'}
            </button>

            {host && (
              <button
                type="button"
                disabled={!canStart}
                onClick={startGame}
                className="neo-brutal bg-primary text-black px-12 py-4 font-black text-2xl flex items-center gap-3 hover:bg-yellow-400 disabled:opacity-50 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Play className="w-7 h-7 stroke-[3] fill-black" />
                START MATCH
              </button>
            )}
          </div>
          <div className="mt-4 text-center font-bold text-muted">
            {!hasMinPlayers
              ? `Waiting for at least ${MIN_PLAYERS} players...`
              : !allReady
              ? `Waiting for ${notReadyPlayers.map((p) => p.displayName).join(', ')}...`
              : 'All set! Host can start the game.'}
          </div>
        </div>
      </div>

      {/* Chat Sidebar */}
      <div 
        className={`fixed inset-y-0 right-0 w-[400px] bg-card border-l-4 border-border transform transition-transform duration-300 z-50 flex flex-col shadow-[-8px_0_0_0_rgba(17,24,39,0.1)] ${
          chatOpen ? 'translate-x-0' : 'translate-x-full'
        } md:translate-x-0`}
      >
        {/* Mobile close chat button */}
        <div className="md:hidden p-4 border-b-4 border-border bg-surface flex justify-between items-center">
          <span className="font-display font-black text-xl">LOBBY CHAT</span>
          <button onClick={() => setChatOpen(false)} className="font-bold text-danger">CLOSE</button>
        </div>
        <div className="flex-1 overflow-hidden relative p-4">
           <ChatPanel />
        </div>
      </div>

    </div>
  );
};
