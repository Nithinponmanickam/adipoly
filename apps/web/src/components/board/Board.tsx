import React from 'react';
import { ADIPOLY_BOARD_SPACES } from '@adipoly/game-engine';
import { BoardSpace } from './BoardSpace.js';
import { Dice } from './Dice.js';
import { useGameStore } from '../../store/gameStore.js';
import { Dices, ShoppingCart, ArrowRightCircle, Award } from 'lucide-react';

const getSpaceOrientation = (index: number): 'top' | 'bottom' | 'left' | 'right' | 'corner' => {
  if (index === 0 || index === 8 || index === 16 || index === 24) return 'corner';
  if (index > 0 && index < 8) return 'bottom';
  if (index > 8 && index < 16) return 'left';
  if (index > 16 && index < 24) return 'top';
  return 'right';
};

const getGridPosition = (index: number) => {
  // 9x9 Grid (1-indexed)
  if (index >= 0 && index <= 8) {
    return { gridRow: 9, gridColumn: 9 - index };
  }
  if (index >= 9 && index <= 16) {
    return { gridRow: 9 - (index - 8), gridColumn: 1 };
  }
  if (index >= 17 && index <= 24) {
    return { gridRow: 1, gridColumn: 1 + (index - 16) };
  }
  if (index >= 25 && index <= 31) {
    return { gridRow: 1 + (index - 24), gridColumn: 9 };
  }
  return { gridRow: 5, gridColumn: 5 };
};

export const Board: React.FC = () => {
  const { roomState, currentPlayerId, isRollingDice, rollDice, buyProperty, endTurn, leaveRoom, isLoading } = useGameStore();
  const dice = roomState?.gameState?.lastDiceRoll || [3, 4];
  const isRolling = Boolean(isRollingDice);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const [boardSize, setBoardSize] = React.useState<number>(0);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateSize = () => {
      const { clientWidth, clientHeight } = el;
      if (clientWidth > 0 && clientHeight > 0) {
        // Neo-brutal shadow allowance
        const padding = window.innerWidth < 640 ? 10 : 20;
        const available = Math.min(clientWidth - padding, clientHeight - padding);
        setBoardSize(Math.max(Math.floor(available), 240));
      }
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(el);
    window.addEventListener('resize', updateSize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  const gameState = roomState?.gameState;
  const activePlayer = gameState && roomState?.players ? (roomState.players[gameState.activePlayerIndex] || roomState.players[0]) : undefined;
  const isMyTurn = activePlayer?.id === currentPlayerId;
  const currentSpace = activePlayer ? ADIPOLY_BOARD_SPACES[activePlayer.position ?? 0] : undefined;
  const canAfford = currentSpace?.price ? (activePlayer?.money ?? 0) >= currentSpace.price : true;

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center p-1 sm:p-2 select-none overflow-hidden">
      <div 
        className="grid bg-surface border-3 sm:border-4 border-border shadow-[5px_5px_0px_0px_rgba(17,24,39,1)] sm:shadow-[8px_8px_0px_0px_rgba(17,24,39,1)] relative aspect-square transition-all duration-75"
        style={{
          width: boardSize ? `${boardSize}px` : 'min(96vw, 85vh)',
          height: boardSize ? `${boardSize}px` : 'min(96vw, 85vh)',
          maxWidth: '100%',
          maxHeight: '100%',
          gridTemplateColumns: 'repeat(9, 1fr)',
          gridTemplateRows: 'repeat(9, 1fr)',
        }}
      >
        {/* Center Area (Logo, Dice, Center Action HUD) */}
        <div 
          className="col-start-2 col-end-9 row-start-2 row-end-9 bg-background flex flex-col items-center justify-center relative border-2 sm:border-3 border-border m-0.5 p-1 sm:p-2 overflow-hidden"
        >
          {/* Subtle dot pattern */}
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#111827 2px, transparent 2px)',
              backgroundSize: '16px 16px'
            }}
          />

          {/* Logo Badge */}
          <div className="z-10 bg-white border-2 border-border px-2.5 py-0.5 sm:px-4 sm:py-1 shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] transform -rotate-1 mb-1">
            <h1 className="text-base sm:text-2xl md:text-3xl font-display font-black text-black tracking-tighter uppercase leading-none">
              ADI<span className="text-accent">POLY</span>
            </h1>
          </div>

          {/* Turn / Round info pill */}
          {gameState && (
            <div className="z-10 mb-1 sm:mb-2 flex items-center gap-1">
              <span className="text-[7px] sm:text-[9px] font-black uppercase tracking-wider bg-black text-white px-1.5 py-0.5 border border-black shadow-xs">
                Turn {gameState.turnNumber}
              </span>
              <span className="text-[7px] sm:text-[9px] font-bold uppercase tracking-wider bg-white text-black px-1.5 py-0.5 border border-black">
                {gameState.phase}
              </span>
            </div>
          )}

          {/* 3D Dice Display */}
          <div className="z-10 mb-1 sm:mb-2 scale-90 sm:scale-100 transition-transform">
            <Dice rolling={isRolling} values={dice as [number, number]} />
          </div>

          {/* Interactive Center Action HUD */}
          <div className="z-10 w-full max-w-xs flex flex-col items-center justify-center px-1">
            {gameState?.phase === 'GAME_OVER' ? (
              <div className="neo-brutal bg-primary p-2 text-center w-full shadow-[2px_2px_0px_0px_rgba(17,24,39,1)]">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Award className="w-4 h-4 stroke-[3] text-black" />
                  <span className="font-display font-black text-xs sm:text-sm uppercase text-black">
                    MATCH CONCLUDED!
                  </span>
                </div>
                <button
                  onClick={leaveRoom}
                  className="neo-brutal bg-black text-white px-3 py-1 text-[9px] sm:text-xs font-black uppercase hover:bg-gray-800 transition cursor-pointer"
                >
                  Return to Home
                </button>
              </div>
            ) : isMyTurn ? (
              <div className="flex flex-col items-center gap-1 sm:gap-1.5 w-full">
                {gameState?.phase === 'ROLLING' && (
                  <button
                    onClick={rollDice}
                    disabled={isLoading}
                    className="neo-brutal bg-accent text-white px-3.5 py-1.5 sm:px-5 sm:py-2 font-black text-xs sm:text-base uppercase tracking-wider flex items-center gap-1.5 hover:bg-sky-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                  >
                    <Dices className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 stroke-[3]" />
                    <span>{isLoading ? 'ROLLING...' : 'ROLL DICE'}</span>
                  </button>
                )}

                {gameState?.phase === 'ACTION' && currentSpace?.type === 'PROPERTY' && (
                  <div className="flex items-center gap-1 sm:gap-2 w-full justify-center flex-wrap">
                    <button
                      onClick={buyProperty}
                      disabled={isLoading || !canAfford}
                      className={`neo-brutal px-2.5 py-1 sm:px-3.5 sm:py-1.5 font-black text-[9px] sm:text-xs uppercase tracking-wider flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all ${
                        canAfford
                          ? 'bg-success text-white hover:bg-green-600 cursor-pointer'
                          : 'bg-gray-300 text-gray-500 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" />
                      <span className="truncate max-w-[130px]">{canAfford ? `BUY (₹${currentSpace.price})` : `CANNOT AFFORD`}</span>
                    </button>
                    <button
                      onClick={endTurn}
                      disabled={isLoading}
                      className="neo-brutal bg-danger text-white px-2.5 py-1 sm:px-3.5 sm:py-1.5 font-black text-[9px] sm:text-xs uppercase tracking-wider flex items-center gap-1 hover:bg-red-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
                    >
                      <ArrowRightCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" />
                      <span>PASS</span>
                    </button>
                  </div>
                )}

                {gameState?.phase === 'END_TURN' && (
                  <button
                    onClick={endTurn}
                    disabled={isLoading}
                    className="neo-brutal bg-danger text-white px-3.5 py-1.5 sm:px-5 sm:py-2 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center gap-1.5 hover:bg-red-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                  >
                    <ArrowRightCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                    <span>END TURN</span>
                  </button>
                )}
              </div>
            ) : activePlayer ? (
              <div className="neo-brutal bg-white px-2 py-0.5 sm:px-3 sm:py-1 border-2 border-border shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] text-[8px] sm:text-[9.5px] font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                <span className="truncate max-w-[120px] sm:max-w-none">{activePlayer.displayName}'s turn</span>
              </div>
            ) : null}
          </div>
        </div>

        {/* Board Spaces (32 perimeter tiles) */}
        {ADIPOLY_BOARD_SPACES.map((space) => {
          const orientation = getSpaceOrientation(space.index);
          const position = getGridPosition(space.index);

          return (
            <div 
              key={space.id} 
              style={{ ...position }}
              className="flex items-stretch justify-stretch border border-border sm:border-2 bg-white overflow-hidden"
            >
              <BoardSpace space={space} orientation={orientation} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
