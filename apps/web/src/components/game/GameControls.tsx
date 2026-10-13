import React from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { ADIPOLY_BOARD_SPACES } from '@adipoly/game-engine';
import { Dices, ShoppingCart, ArrowRightCircle, Award } from 'lucide-react';

export const GameControls: React.FC = () => {
  const { roomState, currentPlayerId, rollDice, buyProperty, endTurn, isLoading } = useGameStore();

  if (!roomState || !roomState.gameState || !currentPlayerId) return null;

  const { gameState } = roomState;
  const activePlayer = roomState.players[gameState.activePlayerIndex] || roomState.players[0];
  const isMyTurn = activePlayer.id === currentPlayerId;

  if (gameState.phase === 'GAME_OVER') {
    const winner = roomState.players.find(p => p.id === gameState.winnerPlayerId) || activePlayer;
    return (
      <div className="neo-brutal bg-primary p-6 text-center shadow-[6px_6px_0px_0px_rgba(17,24,39,1)]">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Award className="w-8 h-8 stroke-[3] text-black" />
          <span className="font-display font-black text-2xl uppercase tracking-widest text-black">
            MATCH CONCLUDED!
          </span>
        </div>
        <p className="font-bold text-lg text-black">
          Champion: <span className="underline uppercase">{winner.displayName}</span>
        </p>
      </div>
    );
  }

  if (!isMyTurn) {
    return (
      <div className="neo-brutal bg-white p-4 text-center shadow-[4px_4px_0px_0px_rgba(17,24,39,1)]">
        <span className="font-bold uppercase tracking-widest text-muted flex items-center justify-center gap-2">
          <span className="w-3 h-3 rounded-full bg-primary animate-ping" />
          Waiting for {activePlayer.displayName}'s turn...
        </span>
      </div>
    );
  }

  const space = ADIPOLY_BOARD_SPACES[activePlayer.position ?? 0];
  const canAfford = space?.price ? (activePlayer.money ?? 0) >= space.price : true;

  return (
    <div className="neo-brutal bg-surface border-4 border-border p-6 flex flex-col md:flex-row gap-4 items-center shadow-[8px_8px_0px_0px_rgba(17,24,39,1)]">
      <div className="flex flex-col text-center md:text-left">
        <span className="font-display font-black text-2xl uppercase tracking-widest text-primary flex items-center gap-2 justify-center md:justify-start">
          <span className="w-3 h-3 rounded-full bg-success" />
          YOUR TURN
        </span>
        <span className="font-bold text-xs uppercase tracking-wider text-muted">
          Current Space: {space?.name || 'Genesis Square'}
        </span>
      </div>

      <div className="flex flex-wrap gap-3 items-center justify-center">
        {gameState.phase === 'ROLLING' && (
          <button
            onClick={rollDice}
            disabled={isLoading}
            className="neo-brutal bg-accent text-white px-8 py-4 text-xl font-black uppercase tracking-wider flex items-center gap-3 hover:bg-sky-500 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] disabled:opacity-50 transition-all cursor-pointer"
          >
            <Dices className="w-6 h-6 stroke-[3]" />
            {isLoading ? 'ROLLING...' : 'ROLL DICE'}
          </button>
        )}

        {gameState.phase === 'ACTION' && space?.type === 'PROPERTY' && (
          <button
            onClick={buyProperty}
            disabled={isLoading || !canAfford}
            className={`neo-brutal px-8 py-4 text-lg font-black uppercase tracking-wider flex items-center gap-3 transition-all ${
              canAfford
                ? 'bg-success text-white hover:bg-green-600 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] cursor-pointer'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed opacity-60'
            }`}
            title={canAfford ? `Acquire ${space.name}` : 'Insufficient cash'}
          >
            <ShoppingCart className="w-5 h-5 stroke-[3]" />
            {isLoading ? 'BUYING...' : canAfford ? `BUY ${space.name} (₹${space.price})` : `CANNOT AFFORD (₹${space.price})`}
          </button>
        )}

        {(gameState.phase === 'ACTION' || gameState.phase === 'END_TURN') && (
          <button
            onClick={endTurn}
            disabled={isLoading}
            className="neo-brutal bg-danger text-white px-8 py-4 text-lg font-black uppercase tracking-wider flex items-center gap-3 hover:bg-red-600 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] disabled:opacity-50 transition-all cursor-pointer"
          >
            <ArrowRightCircle className="w-5 h-5 stroke-[3]" />
            {isLoading ? '...' : gameState.phase === 'ACTION' ? 'PASS / END TURN' : 'END TURN'}
          </button>
        )}
      </div>
    </div>
  );
};
