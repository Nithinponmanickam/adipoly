import React from 'react';
import { useGameStore } from '../../store/gameStore.js';

export const GameControls: React.FC = () => {
  const { roomState, currentPlayerId, rollDice, buyProperty, endTurn, isLoading } = useGameStore();

  if (!roomState || !roomState.gameState || !currentPlayerId) return null;

  const { gameState } = roomState;
  const activePlayer = roomState.players[gameState.activePlayerIndex];
  const isMyTurn = activePlayer.id === currentPlayerId;

  if (!isMyTurn) {
    return (
      <div className="neo-brutal bg-white p-4 text-center">
        <span className="font-bold uppercase tracking-widest text-muted">
          Waiting for {activePlayer.displayName}...
        </span>
      </div>
    );
  }

  return (
    <div className="neo-brutal bg-primary/20 border-primary p-6 flex gap-4 items-center">
      <div className="flex flex-col">
        <span className="font-black text-xl uppercase tracking-widest text-primary">Your Turn</span>
        <span className="font-bold text-sm text-muted">Phase: {gameState.phase}</span>
      </div>

      <div className="flex gap-2 ml-4">
        {gameState.phase === 'ROLLING' && (
          <button
            onClick={rollDice}
            disabled={isLoading}
            className="btn-neo bg-accent text-white px-8 py-3 text-lg"
          >
            {isLoading ? '...' : 'Roll Dice'}
          </button>
        )}

        {gameState.phase === 'ACTION' && (
          <button
            onClick={buyProperty}
            disabled={isLoading}
            className="btn-neo bg-success text-white px-8 py-3 text-lg"
          >
            {isLoading ? '...' : 'Buy Property'}
          </button>
        )}

        {(gameState.phase === 'ACTION' || gameState.phase === 'END_TURN') && (
          <button
            onClick={endTurn}
            disabled={isLoading}
            className="btn-neo bg-danger text-white px-8 py-3 text-lg"
          >
            {isLoading ? '...' : 'End Turn'}
          </button>
        )}
      </div>
    </div>
  );
};
