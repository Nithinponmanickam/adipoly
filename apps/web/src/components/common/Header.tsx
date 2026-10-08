import React from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { Wifi, WifiOff, Copy, Check, Users } from 'lucide-react';

export const Header: React.FC = () => {
  const { connected, roomState, showToast } = useGameStore();
  const [copied, setCopied] = React.useState(false);

  const copyCode = () => {
    if (!roomState?.roomCode) return;
    navigator.clipboard.writeText(roomState.roomCode);
    setCopied(true);
    showToast(`Room code ${roomState.roomCode} copied to clipboard!`, 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="border-b-4 border-border bg-surface sticky top-0 z-40 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border-4 border-border bg-primary flex items-center justify-center font-display font-black text-black text-xl shadow-[2px_2px_0px_0px_rgba(17,24,39,1)]">
            A
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black tracking-widest text-2xl text-text">ADIPOLY</span>
              <span className="text-[10px] uppercase tracking-widest font-black px-1.5 py-0.5 border-2 border-border bg-accent text-white">
                Phase 1
              </span>
            </div>
            <p className="text-xs font-bold text-muted hidden sm:block">
              Multiplayer Property & Business Strategy
            </p>
          </div>
        </div>

        {/* Status / Room Info */}
        <div className="flex items-center gap-4">
          {roomState && (
            <div className="flex items-center gap-3 bg-white px-3 py-1.5 border-4 border-border shadow-[2px_2px_0px_0px_rgba(17,24,39,1)]">
              <div className="flex items-center gap-1.5 text-text font-bold text-sm">
                <Users className="w-4 h-4 stroke-[3]" />
                <span>
                  {roomState.players.length}/{roomState.settings.players.maxPlayers}
                </span>
              </div>
              <div className="h-5 w-1 bg-border" />
              <button
                onClick={copyCode}
                className="flex items-center gap-2 font-display font-black text-primary hover:text-black text-base transition uppercase tracking-widest"
                title="Click to copy room code"
              >
                <span>{roomState.roomCode}</span>
                {copied ? <Check className="w-4 h-4 stroke-[3] text-success" /> : <Copy className="w-4 h-4 stroke-[3]" />}
              </button>
            </div>
          )}

          {/* Connection status pill */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 font-bold uppercase tracking-widest text-xs border-4 shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] ${
              connected
                ? 'bg-success text-white border-border'
                : 'bg-danger text-white border-border animate-pulse'
            }`}
          >
            {connected ? (
              <>
                <Wifi className="w-4 h-4 stroke-[3]" />
                <span className="hidden md:inline">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 stroke-[3]" />
                <span>Lost...</span>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
