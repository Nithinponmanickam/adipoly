import React from 'react';
import { BoardSpaceDefinition } from '@adipoly/game-engine';
import { useGameStore } from '../../store/gameStore.js';
import { Flag, ShieldAlert, Sparkles, AlertTriangle } from 'lucide-react';

interface BoardSpaceProps {
  space: BoardSpaceDefinition;
  orientation: 'top' | 'bottom' | 'left' | 'right' | 'corner';
}

export const BoardSpace: React.FC<BoardSpaceProps> = ({ space, orientation }) => {
  const { roomState, setSelectedSpaceIndex } = useGameStore();
  const isCorner = orientation === 'corner';
  const hasColorBar = space.type === 'PROPERTY' && Boolean(space.groupColor);

  const playersOnSpace = roomState?.players.filter((p) => p.position === space.index) || [];
  const property = space.type === 'PROPERTY' ? roomState?.gameState?.properties[space.id] : undefined;
  const owner = property?.ownerId ? roomState?.players.find((p) => p.id === property.ownerId) : undefined;
  const activePlayerIndex = roomState?.gameState?.activePlayerIndex;
  const activePlayer = activePlayerIndex !== undefined && roomState?.players ? roomState.players[activePlayerIndex] : undefined;
  const hasActivePlayer = playersOnSpace.some((p) => p.id === activePlayer?.id);

  // Render player tokens on space
  const renderTokens = () => {
    if (playersOnSpace.length === 0) return <div className="h-1.5 sm:h-2" />;
    return (
      <div className="flex gap-0.5 flex-wrap justify-center items-center z-20 min-h-[9px] sm:min-h-[12px] w-full pb-0.5">
        {playersOnSpace.map((p) => {
          const isCurrentActive = p.id === activePlayer?.id;
          return (
            <div
              key={p.id}
              className={`w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3.5 md:h-3.5 rounded-full border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] z-30 transition-transform ${
                isCurrentActive
                  ? 'ring-2 ring-primary scale-125 animate-bounce'
                  : 'hover:scale-125'
              }`}
              style={{ backgroundColor: p.color || '#3B82F6' }}
              title={`${p.displayName}${isCurrentActive ? ' (Current Turn)' : ''}`}
            />
          );
        })}
      </div>
    );
  };

  // Render corner content
  const renderCornerContent = () => {
    if (space.index === 0) {
      return (
        <div className="flex flex-col items-center justify-between text-center h-full w-full p-1 bg-emerald-50">
          <div className="flex flex-col items-center justify-center flex-1">
            <Flag className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-success stroke-[3] mb-0.5" />
            <span className="font-display font-black text-[7.5px] sm:text-[10px] md:text-xs uppercase text-success leading-tight">
              GENESIS
            </span>
            <span className="text-[5.5px] sm:text-[7.5px] font-black bg-success text-white px-1 mt-0.5 rounded-xs">
              +₹200
            </span>
          </div>
          {renderTokens()}
        </div>
      );
    }
    if (space.index === 8) {
      return (
        <div className="flex flex-col items-center justify-between text-center h-full w-full p-1 bg-amber-50">
          <div className="flex flex-col items-center justify-center flex-1">
            <ShieldAlert className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-amber-600 stroke-[3] mb-0.5" />
            <span className="font-display font-black text-[7px] sm:text-[9.5px] md:text-[11px] uppercase text-amber-700 leading-tight">
              DETENTION
            </span>
            <span className="text-[5.5px] sm:text-[7px] font-bold text-amber-900 mt-0.5">
              VISITING
            </span>
          </div>
          {renderTokens()}
        </div>
      );
    }
    if (space.index === 16) {
      return (
        <div className="flex flex-col items-center justify-between text-center h-full w-full p-1 bg-cyan-50">
          <div className="flex flex-col items-center justify-center flex-1">
            <Sparkles className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-cyan-600 stroke-[3] mb-0.5" />
            <span className="font-display font-black text-[7px] sm:text-[9.5px] md:text-[11px] uppercase text-cyan-700 leading-tight">
              INNOVATION
            </span>
            <span className="text-[5.5px] sm:text-[7px] font-bold text-cyan-900 mt-0.5">
              HUB
            </span>
          </div>
          {renderTokens()}
        </div>
      );
    }
    if (space.index === 24) {
      return (
        <div className="flex flex-col items-center justify-between text-center h-full w-full p-1 bg-rose-50">
          <div className="flex flex-col items-center justify-center flex-1">
            <AlertTriangle className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-danger stroke-[3] mb-0.5" />
            <span className="font-display font-black text-[7px] sm:text-[9.5px] md:text-[11px] uppercase text-danger leading-tight">
              REGULATORY
            </span>
            <span className="text-[5.5px] sm:text-[7.5px] font-black bg-danger text-white px-1 mt-0.5 rounded-xs">
              RAID
            </span>
          </div>
          {renderTokens()}
        </div>
      );
    }
    return null;
  };

  // Color bar styling based on orientation facing the center of the board
  const getColorBarStyle = () => {
    if (!hasColorBar) return null;
    switch (orientation) {
      case 'bottom':
        return 'top-0 left-0 right-0 h-1.5 sm:h-2 md:h-2.5 border-b border-border';
      case 'top':
        return 'bottom-0 left-0 right-0 h-1.5 sm:h-2 md:h-2.5 border-t border-border';
      case 'left':
        return 'top-0 bottom-0 right-0 w-1.5 sm:w-2 md:w-2.5 border-l border-border';
      case 'right':
        return 'top-0 bottom-0 left-0 w-1.5 sm:w-2 md:w-2.5 border-r border-border';
      default:
        return 'top-0 left-0 right-0 h-1.5';
    }
  };

  // Content padding to keep text clear of the color bar
  const getContentPadding = () => {
    if (isCorner) return 'p-0.5';
    if (!hasColorBar) return 'p-1';
    switch (orientation) {
      case 'bottom':
        return 'pt-2 sm:pt-2.5 pb-0.5 px-0.5';
      case 'top':
        return 'pb-2 sm:pb-2.5 pt-0.5 px-0.5';
      case 'left':
        return 'pr-2 sm:pr-2.5 pl-0.5 py-0.5';
      case 'right':
        return 'pl-2 sm:pl-2.5 pr-0.5 py-0.5';
      default:
        return 'p-1';
    }
  };

  // Owner badge position
  const getOwnerBadgePosition = () => {
    switch (orientation) {
      case 'bottom':
        return 'bottom-0.5 right-0.5';
      case 'left':
        return 'top-0.5 left-0.5';
      default:
        return 'top-0.5 right-0.5';
    }
  };

  return (
    <div
      onClick={() => setSelectedSpaceIndex(space.index)}
      className={`relative w-full h-full flex flex-col justify-between overflow-hidden bg-white hover:bg-yellow-50/80 active:bg-yellow-100 transition-colors cursor-pointer select-none group ${
        hasActivePlayer ? 'ring-2 ring-primary ring-inset bg-amber-50/40' : ''
      }`}
      title={`${space.name}${owner ? ` (Owned by ${owner.displayName})` : space.price ? ` (₹${space.price})` : ''} - Click to inspect`}
    >
      {/* Group Color Bar (Inward facing) */}
      {hasColorBar && (
        <div
          className={`absolute ${getColorBarStyle()}`}
          style={{ backgroundColor: space.groupColor }}
        />
      )}

      {/* Owner Badge */}
      {owner && (
        <div
          className={`absolute ${getOwnerBadgePosition()} z-20 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-[6px] sm:text-[7.5px] font-black text-white`}
          style={{ backgroundColor: owner.color }}
          title={`Owned by ${owner.displayName}`}
        >
          {owner.displayName.charAt(0).toUpperCase()}
        </div>
      )}

      {/* Main Cell Content */}
      {isCorner ? (
        renderCornerContent()
      ) : (
        <div className={`flex-1 flex flex-col items-center justify-between text-center ${getContentPadding()} w-full h-full`}>
          {/* Space Name */}
          <div className="font-black text-[6.5px] sm:text-[8px] md:text-[9.5px] leading-[1.05] text-text uppercase line-clamp-2 px-0.5 w-full">
            {space.name}
          </div>

          {/* Price / Type Badge */}
          {space.price ? (
            <div
              className={`text-[5.5px] sm:text-[7px] md:text-[8.5px] font-black px-1 py-0.2 border border-border my-0.5 transition-transform group-hover:scale-105 ${
                owner ? 'bg-muted/20 text-muted' : 'bg-primary text-black'
              }`}
            >
              {owner ? 'OWNED' : `₹${space.price}`}
            </div>
          ) : space.type === 'EVENT' ? (
            <span className="text-[5.5px] sm:text-[7px] font-bold text-accent px-0.5 uppercase tracking-tighter">
              PULSE
            </span>
          ) : space.type === 'SPECIAL' ? (
            <span className="text-[5px] sm:text-[6.5px] font-bold text-amber-600 px-0.5 uppercase tracking-tighter">
              SPECIAL
            </span>
          ) : null}

          {/* Player tokens */}
          {renderTokens()}
        </div>
      )}
    </div>
  );
};
