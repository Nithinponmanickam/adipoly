import React from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { Board } from '../board/Board.js';
import { GameControls } from './GameControls.js';

export const GameScreen: React.FC = () => {
  const { roomState } = useGameStore();

  if (!roomState) return null;

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden max-h-[calc(100vh-80px)] bg-background">
      {/* Sidebar for Players/Logs */}
      <div className="w-full md:w-80 border-r-4 border-border bg-white flex flex-col overflow-y-auto shrink-0 z-10">
        <div className="p-6 border-b-4 border-border bg-primary sticky top-0">
          <h2 className="text-3xl font-display font-black text-black uppercase tracking-widest">
            Roster
          </h2>
        </div>
        <div className="p-4 flex flex-col gap-4">
          {roomState.players.map((p, index) => {
            const isMyTurn = roomState.gameState?.activePlayerIndex === index;
            const color = p.color || '#3B82F6';

            return (
              <div 
                key={p.id} 
                className={`neo-brutal p-4 flex flex-col gap-2 relative overflow-hidden transition-colors ${
                  isMyTurn ? 'bg-primary/10 border-primary' : 'bg-white'
                }`}
              >
                <div 
                  className="absolute top-0 left-0 bottom-0 w-2 border-r-2 border-border" 
                  style={{ backgroundColor: color }}
                />
                <div className="pl-2 flex items-center justify-between">
                  <span className="font-black text-lg truncate uppercase">{p.displayName}</span>
                  {p.isHost && (
                    <span className="text-[10px] font-black bg-black text-white px-2 py-0.5 tracking-widest">HOST</span>
                  )}
                </div>
                <div className="pl-2 flex items-center justify-between mt-2">
                  <span className="font-bold text-sm text-muted uppercase tracking-widest">Net Worth</span>
                  <span className="font-black text-xl text-success flex items-center gap-1">
                    ₹{(p.money ?? roomState.settings.players.startingMoney).toLocaleString()}
                  </span>
                </div>
                {isMyTurn && (
                  <div className="absolute top-2 right-2 flex gap-1">
                    <span className="animate-pulse bg-primary w-2 h-2 rounded-full border border-black" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Board Area */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-auto bg-background relative">
        {/* Subtle grid pattern background */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(#111827 2px, transparent 2px)`,
            backgroundSize: '32px 32px'
          }}
        />
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
          <Board />
          <div className="mt-8">
            <GameControls />
          </div>
        </div>
      </div>
    </div>
  );
};
