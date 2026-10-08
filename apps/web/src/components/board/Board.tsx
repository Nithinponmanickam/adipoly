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
    <div className="w-full max-w-4xl aspect-square mx-auto p-4 flex items-center justify-center bg-slate-950">
      <div 
        className="grid w-full h-full gap-1 p-2 bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 relative"
        style={{
          gridTemplateColumns: 'repeat(9, 1fr)',
          gridTemplateRows: 'repeat(9, 1fr)',
        }}
      >
        {/* Center Area (Logo, Dice, Events) */}
        <div 
          className="col-start-2 col-end-9 row-start-2 row-end-9 bg-slate-900/50 rounded-xl m-2 flex flex-col items-center justify-center border border-slate-800/50 gap-8"
        >
          <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 via-cyan-400 to-emerald-400 tracking-tighter shadow-sm mb-4">
            ADIPOLY
          </div>
          <Dice rolling={false} values={[3, 4]} />
        </div>

        {/* Board Spaces */}
        {ADIPOLY_BOARD_SPACES.map((space) => {
          const orientation = getSpaceOrientation(space.index);
          const position = getGridPosition(space.index);
          
          return (
            <div 
              key={space.id} 
              style={{ ...position }}
              className="flex items-stretch justify-stretch"
            >
              <BoardSpace space={space} orientation={orientation} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
