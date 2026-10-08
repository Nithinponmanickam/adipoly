import React from 'react';
import { BoardSpaceDefinition } from '@adipoly/game-engine';


interface BoardSpaceProps {
  space: BoardSpaceDefinition;
  orientation: 'top' | 'bottom' | 'left' | 'right' | 'corner';
}

export const BoardSpace: React.FC<BoardSpaceProps> = ({ space, orientation }) => {
  const isCorner = orientation === 'corner';
  const hasColorBar = space.type === 'PROPERTY' && space.groupColor;

  return (
    <div
      className={`relative border border-slate-700/50 bg-slate-900/80 backdrop-blur-sm flex flex-col justify-between overflow-hidden
        ${isCorner ? 'aspect-square p-2' : 'aspect-[2/3] p-1.5'}
        hover:bg-slate-800/90 transition-colors
      `}
      style={{
        transform: orientation === 'left' ? 'rotate(90deg)' : orientation === 'right' ? 'rotate(-90deg)' : orientation === 'top' ? 'rotate(180deg)' : 'none',
      }}
    >
      {/* Color Bar */}
      {hasColorBar && (
        <div
          className="absolute top-0 left-0 right-0 h-4 border-b border-slate-700/50"
          style={{ backgroundColor: space.groupColor }}
        />
      )}

      {/* Content */}
      <div className={`flex-1 flex flex-col items-center justify-between text-center ${hasColorBar ? 'pt-5' : 'pt-1'} pb-1`}>
        <div className="text-[10px] font-bold leading-tight text-slate-300">
          {space.name.toUpperCase()}
        </div>

        {space.price && (
          <div className="text-[9px] font-semibold text-slate-400 mt-1">
            ₹{space.price}
          </div>
        )}

        {/* Players container */}
        <div className="flex gap-0.5 flex-wrap justify-center mt-auto h-4 w-full">
          {/* We'll render player tokens here later */}
        </div>
      </div>
    </div>
  );
};
