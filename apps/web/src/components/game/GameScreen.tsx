import React from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { Board } from '../board/Board.js';

export const GameScreen: React.FC = () => {
  const { roomState } = useGameStore();

  if (!roomState) return null;

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden max-h-[calc(100vh-4rem)]">
      {/* Sidebar for Players/Logs */}
      <div className="w-full md:w-80 border-r border-slate-800 bg-slate-900/50 p-4 flex flex-col gap-4 overflow-y-auto">
        <h2 className="text-xl font-bold text-slate-100">Players</h2>
        <div className="flex flex-col gap-2">
          {roomState.players.map((p) => (
            <div key={p.id} className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/50 flex items-center justify-between">
              <span className="font-medium">{p.displayName}</span>
              <span className="text-emerald-400 font-mono">₹{roomState.settings.players.startingMoney}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Board Area */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
        <Board />
      </div>
    </div>
  );
};
