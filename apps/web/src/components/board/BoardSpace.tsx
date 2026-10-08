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
      className={`relative w-full h-full flex flex-col justify-between overflow-hidden bg-white hover:bg-gray-100 transition-colors cursor-pointer group`}
      style={{
        transform: orientation === 'left' ? 'rotate(90deg)' : orientation === 'right' ? 'rotate(-90deg)' : orientation === 'top' ? 'rotate(180deg)' : 'none',
      }}
    >
      {/* Color Bar */}
      {hasColorBar && (
        <div
          className="absolute top-0 left-0 right-0 h-[25%] border-b-4 border-border shadow-[0px_4px_0px_0px_rgba(17,24,39,1)]"
          style={{ backgroundColor: space.groupColor }}
        />
      )}

      {/* Content */}
      <div className={`flex-1 flex flex-col items-center text-center ${hasColorBar ? 'pt-[35%]' : 'pt-2'} pb-2 px-1 justify-between`}>
        <div className={`font-black leading-[1.1] text-text uppercase ${isCorner ? 'text-sm md:text-xl transform -rotate-45 p-2' : 'text-[8px] md:text-xs'}`}>
          {space.name}
        </div>

        {space.price && (
          <div className="text-[10px] md:text-sm font-black text-black bg-primary px-1 border-2 border-border mt-1 group-hover:scale-110 transition-transform">
            ₹{space.price}
          </div>
        )}

        {/* Players container */}
        <div className="flex gap-1 flex-wrap justify-center mt-auto h-4 w-full">
          {/* We'll render player tokens here later */}
        </div>
      </div>
    </div>
  );
};
