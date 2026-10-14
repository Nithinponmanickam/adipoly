import React from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { ADIPOLY_BOARD_SPACES } from '@adipoly/game-engine';
import { Dices, ShoppingCart, ArrowRightCircle, Award } from 'lucide-react';

interface GameControlsProps {
  variant?: 'sidebar' | 'dock';
}

export const GameControls: React.FC<GameControlsProps> = ({ variant = 'sidebar' }) => {
  const { roomState, currentPlayerId, rollDice, buyProperty, endTurn, leaveRoom, isLoading } = useGameStore();

  if (!roomState || !roomState.gameState || !currentPlayerId) return null;

  const { gameState } = roomState;
  const activePlayer = roomState.players[gameState.activePlayerIndex] || roomState.players[0];
  const isMyTurn = activePlayer.id === currentPlayerId;

  if (gameState.phase === 'GAME_OVER') {
    const winner = roomState.players.find(p => p.id === gameState.winnerPlayerId) || activePlayer;
    return (
      <div className="neo-brutal bg-primary p-3 sm:p-4 text-center shadow-[4px_4px_0px_0px_rgba(17,24,39,1)]">
        <div className="flex items-center justify-center gap-1.5 mb-1.5">
          <Award className="w-5 h-5 stroke-[3] text-black" />
          <span className="font-display font-black text-sm sm:text-lg uppercase tracking-wider text-black">
            MATCH CONCLUDED!
          </span>
        </div>
        <p className="font-bold text-xs sm:text-sm text-black mb-2">
          Champion: <span className="underline uppercase">{winner.displayName}</span>
        </p>
        <button
          onClick={leaveRoom}
          className="neo-brutal bg-black text-white px-4 py-1.5 font-black uppercase text-xs hover:bg-gray-800 transition cursor-pointer w-full"
        >
          RETURN TO HOME
        </button>
      </div>
    );
  }

  // Mobile Bottom Dock Variant
  if (variant === 'dock') {
    if (!isMyTurn) {
      return (
        <div className="flex items-center justify-between gap-2 px-1 py-0.5">
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full border border-black animate-pulse"
              style={{ backgroundColor: activePlayer.color || '#3B82F6' }}
            />
            <span className="text-xs font-black uppercase tracking-wider text-text truncate max-w-[200px]">
              Waiting for {activePlayer.displayName}...
            </span>
          </div>
          <span className="text-[10px] font-bold text-muted uppercase">
            Turn {gameState.turnNumber}
          </span>
        </div>
      );
    }

    const space = ADIPOLY_BOARD_SPACES[activePlayer.position ?? 0];
    const canAfford = space?.price ? (activePlayer.money ?? 0) >= space.price : true;

    return (
      <div className="flex items-center justify-between gap-2 w-full">
        <div className="flex flex-col min-w-0 pr-1">
          <span className="font-display font-black text-xs uppercase tracking-wider text-success flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-success animate-ping" />
            YOUR TURN
          </span>
          <span className="text-[10px] font-bold text-muted truncate max-w-[130px]">
            {space?.name || 'Genesis Square'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {gameState.phase === 'ROLLING' && (
            <button
              onClick={rollDice}
              disabled={isLoading}
              className="neo-brutal bg-accent text-white px-4 py-2 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 hover:bg-sky-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 transition-all cursor-pointer"
            >
              <Dices className="w-4 h-4 stroke-[3]" />
              <span>{isLoading ? 'ROLLING...' : 'ROLL DICE'}</span>
            </button>
          )}

          {gameState.phase === 'ACTION' && space?.type === 'PROPERTY' && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={buyProperty}
                disabled={isLoading || !canAfford}
                className={`neo-brutal px-2.5 py-1.5 text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all ${
                  canAfford
                    ? 'bg-success text-white hover:bg-green-600 cursor-pointer'
                    : 'bg-gray-300 text-gray-500 opacity-60 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="w-3.5 h-3.5 stroke-[3]" />
                <span>{canAfford ? `BUY (₹${space.price})` : `CANNOT AFFORD`}</span>
              </button>
              <button
                onClick={endTurn}
                disabled={isLoading}
                className="neo-brutal bg-danger text-white px-2.5 py-1.5 text-xs font-black uppercase tracking-wider flex items-center gap-1 hover:bg-red-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
              >
                <ArrowRightCircle className="w-3.5 h-3.5 stroke-[3]" />
                <span>PASS</span>
              </button>
            </div>
          )}

          {(gameState.phase === 'ACTION' && space?.type !== 'PROPERTY') || gameState.phase === 'END_TURN' ? (
            <button
              onClick={endTurn}
              disabled={isLoading}
              className="neo-brutal bg-danger text-white px-4 py-2 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 hover:bg-red-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 transition-all cursor-pointer"
            >
              <ArrowRightCircle className="w-4 h-4 stroke-[3]" />
              <span>END TURN</span>
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  // Desktop Sidebar Variant
  if (!isMyTurn) {
    return (
      <div className="neo-brutal bg-white p-3 text-center shadow-[3px_3px_0px_0px_rgba(17,24,39,1)]">
        <span className="font-bold text-xs uppercase tracking-wider text-muted flex items-center justify-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
          Waiting for {activePlayer.displayName}'s turn...
        </span>
      </div>
    );
  }

  const space = ADIPOLY_BOARD_SPACES[activePlayer.position ?? 0];
  const canAfford = space?.price ? (activePlayer.money ?? 0) >= space.price : true;

  return (
    <div className="neo-brutal bg-surface border-3 border-border p-3.5 flex flex-col gap-3 shadow-[4px_4px_0px_0px_rgba(17,24,39,1)]">
      <div className="flex flex-col">
        <span className="font-display font-black text-lg uppercase tracking-wider text-primary flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse" />
          YOUR TURN
        </span>
        <span className="font-bold text-xs uppercase tracking-wider text-muted truncate">
          Space: {space?.name || 'Genesis Square'}{space?.price ? ` (₹${space.price})` : ''}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {gameState.phase === 'ROLLING' && (
          <button
            onClick={rollDice}
            disabled={isLoading}
            className="neo-brutal bg-accent text-white w-full py-2.5 px-4 text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-sky-500 shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 transition-all cursor-pointer"
          >
            <Dices className="w-4 h-4 stroke-[3]" />
            <span>{isLoading ? 'ROLLING...' : 'ROLL DICE'}</span>
          </button>
        )}

        {gameState.phase === 'ACTION' && space?.type === 'PROPERTY' && (
          <div className="grid grid-cols-2 gap-2 w-full">
            <button
              onClick={buyProperty}
              disabled={isLoading || !canAfford}
              className={`neo-brutal py-2 px-2 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1 shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] transition-all ${
                canAfford
                  ? 'bg-success text-white hover:bg-green-600 cursor-pointer'
                  : 'bg-gray-300 text-gray-500 opacity-60 cursor-not-allowed'
              }`}
              title={canAfford ? `Acquire ${space.name}` : 'Insufficient funds'}
            >
              <ShoppingCart className="w-3.5 h-3.5 stroke-[3]" />
              <span className="truncate">{canAfford ? `BUY (₹${space.price})` : `CAN'T BUY`}</span>
            </button>
            <button
              onClick={endTurn}
              disabled={isLoading}
              className="neo-brutal bg-danger text-white py-2 px-2 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1 hover:bg-red-600 shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] transition-all cursor-pointer"
            >
              <ArrowRightCircle className="w-3.5 h-3.5 stroke-[3]" />
              <span>PASS</span>
            </button>
          </div>
        )}

        {((gameState.phase === 'ACTION' && space?.type !== 'PROPERTY') || gameState.phase === 'END_TURN') && (
          <button
            onClick={endTurn}
            disabled={isLoading}
            className="neo-brutal bg-danger text-white w-full py-2.5 px-4 text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-red-600 shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 transition-all cursor-pointer"
          >
            <ArrowRightCircle className="w-4 h-4 stroke-[3]" />
            <span>END TURN</span>
          </button>
        )}
      </div>
    </div>
  );
};
