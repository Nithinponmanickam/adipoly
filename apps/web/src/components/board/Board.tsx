import React from 'react';
import { ADIPOLY_BOARD_SPACES } from '@adipoly/game-engine';
import { BoardSpace } from './BoardSpace.js';
import { Dice } from './Dice.js';

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
  return { gridRow: 5, gridColumn: 5 }; // Fallback
};

export const Board: React.FC = () => {
  return (
    <div className="w-full max-w-5xl aspect-square mx-auto flex items-center justify-center p-4">
      <div 
        className="grid w-full h-full bg-surface border-4 border-border shadow-[12px_12px_0px_0px_rgba(17,24,39,1)] relative"
        style={{
          gridTemplateColumns: 'repeat(9, 1fr)',
          gridTemplateRows: 'repeat(9, 1fr)',
        }}
      >
        {/* Center Area (Logo, Dice, Events) */}
        <div 
          className="col-start-2 col-end-9 row-start-2 row-end-9 bg-background flex flex-col items-center justify-center relative border-4 border-border m-1"
        >
          {/* Decorative Pattern in center */}
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#111827 2px, transparent 2px)',
              backgroundSize: '24px 24px'
            }}
          />
          
          <div className="z-10 bg-white border-4 border-border px-8 py-4 shadow-[6px_6px_0px_0px_rgba(17,24,39,1)] transform -rotate-2 mb-12">
            <h1 className="text-5xl md:text-7xl font-display font-black text-black tracking-tighter uppercase">
              ADI<span className="text-accent">POLY</span>
            </h1>
          </div>
          
          <div className="z-10">
            <Dice rolling={false} values={[3, 4]} />
          </div>
        </div>

        {/* Board Spaces */}
        {ADIPOLY_BOARD_SPACES.map((space) => {
          const orientation = getSpaceOrientation(space.index);
          const position = getGridPosition(space.index);
          
          return (
            <div 
              key={space.id} 
              style={{ ...position }}
              className="flex items-stretch justify-stretch border-border outline outline-2 outline-border z-20 bg-white"
            >
              <BoardSpace space={space} orientation={orientation} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
