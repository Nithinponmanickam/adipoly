import React from 'react';
import { BoardSpaceDefinition } from '@adipoly/game-engine';
import { useGameStore } from '../../store/gameStore.js';

interface BoardSpaceProps {
  space: BoardSpaceDefinition;
  orientation: 'top' | 'bottom' | 'left' | 'right' | 'corner';
}

export const BoardSpace: React.FC<BoardSpaceProps> = ({ space, orientation }) => {
  const { roomState, setSelectedSpaceIndex } = useGameStore();
  const isCorner = orientation === 'corner';
  const hasColorBar = space.type === 'PROPERTY' && space.groupColor;
  
  const playersOnSpace = roomState?.players.filter(p => p.position === space.index) || [];
  const property = space.type === 'PROPERTY' ? roomState?.gameState?.properties[space.id] : undefined;
  const owner = property?.ownerId ? roomState?.players.find(p => p.id === property.ownerId) : undefined;

  return (
    <div
      onClick={() => setSelectedSpaceIndex(space.index)}
      className={`relative w-full h-full flex flex-col justify-between overflow-hidden bg-white hover:bg-yellow-50 transition-colors cursor-pointer group`}
      style={{
        transform: orientation === 'left' ? 'rotate(90deg)' : orientation === 'right' ? 'rotate(-90deg)' : orientation === 'top' ? 'rotate(180deg)' : 'none',
      }}
      title={`${space.name}${owner ? ` (Owned by ${owner.displayName})` : space.price ? ` (₹${space.price})` : ''} - Click to inspect`}
    >
      {/* Color Bar */}
      {hasColorBar && (
        <div
          className="absolute top-0 left-0 right-0 h-[25%] border-b-4 border-border shadow-[0px_4px_0px_0px_rgba(17,24,39,1)]"
          style={{ backgroundColor: space.groupColor }}
        />
      )}

      {/* Owner Badge */}
      {owner && (
        <div 
          className="absolute top-1 right-1 z-20 w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-border shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-[8px] font-black text-white"
          style={{ backgroundColor: owner.color }}
          title={`Owned by ${owner.displayName}`}
        >
          {owner.displayName.charAt(0).toUpperCase()}
        </div>
      )}

      {/* Content */}
      <div className={`flex-1 flex flex-col items-center text-center ${hasColorBar ? 'pt-[35%]' : 'pt-2'} pb-2 px-1 justify-between`}>
        <div className={`font-black leading-[1.1] text-text uppercase ${isCorner ? 'text-sm md:text-xl transform -rotate-45 p-2' : 'text-[8px] md:text-xs'}`}>
          {space.name}
        </div>

        {space.price && (
          <div className={`text-[10px] md:text-sm font-black px-1 border-2 border-border mt-1 group-hover:scale-110 transition-transform ${owner ? 'bg-muted/20 text-text' : 'bg-primary text-black'}`}>
            {owner ? 'OWNED' : `₹${space.price}`}
          </div>
        )}

        {/* Players container */}
        <div className="flex gap-1 flex-wrap justify-center mt-auto h-4 w-full">
          {playersOnSpace.map(p => (
            <div 
              key={p.id} 
              className="w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-border shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] z-30"
              style={{ backgroundColor: p.color || '#3B82F6' }}
              title={p.displayName}
            />
          ))}
        </div>
      </div>

      {/* Owner Bottom Stripe */}
      {owner && (
        <div 
          className="absolute bottom-0 left-0 right-0 h-1.5 md:h-2 z-10"
          style={{ backgroundColor: owner.color }}
        />
      )}
    </div>
  );
};
