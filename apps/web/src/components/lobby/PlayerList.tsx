import React from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { Crown, CheckCircle2, Clock, UserX, WifiOff, UserPlus, Check } from 'lucide-react';
import { DEFAULT_TEAMS } from '@adipoly/shared';

export const PlayerList: React.FC = () => {
  const { roomState, currentPlayerId, isHost, kickPlayer, setTeam } = useGameStore();

  if (!roomState) return null;

  const currentHost = isHost();
  const maxPlayers = roomState.settings.players.maxPlayers;
  const teamsEnabled = roomState.settings.rules.teamsEnabled;
  const availableTeams = DEFAULT_TEAMS.slice(0, maxPlayers <= 4 ? 2 : 4);

  // Create an array of size maxPlayers to represent the "seats"
  const seats = Array.from({ length: maxPlayers }).map((_, index) => {
    return roomState.players[index] || null;
  });

  return (
    <div className="flex flex-col gap-8">
      <h3 className="font-display font-black text-3xl uppercase tracking-widest text-center mb-4">
        The Roster
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {seats.map((player, index) => {
          if (!player) {
            return (
              <button 
                key={`empty-${index}`} 
                onClick={() => {
                  navigator.clipboard.writeText(roomState.roomCode);
                  alert(`Copied room code: ${roomState.roomCode}`);
                }}
                className="neo-brutal bg-background border-dashed border-muted text-muted flex flex-col items-center justify-center p-8 h-48 hover:bg-white hover:text-text transition-colors hover:border-solid hover:border-border cursor-pointer group"
              >
                <UserPlus className="w-12 h-12 stroke-[2] mb-4 group-hover:scale-110 transition-transform" />
                <span className="font-bold tracking-widest uppercase">Invite Player</span>
              </button>
            );
          }

          const isCurrent = player.id === currentPlayerId;

          return (
            <div
              key={player.id}
              className={`neo-brutal flex flex-col relative h-48 overflow-hidden bg-card`}
            >
              {/* Top Color Banner */}
              <div 
                className="h-4 w-full border-b-[3px] border-border"
                style={{ backgroundColor: player.color }}
              />
              
              {player.isHost && (
                <div className="absolute top-2 right-2 bg-primary p-1.5 border-[3px] border-border rounded-full shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] z-10">
                  <Crown className="w-4 h-4 stroke-[3]" />
                </div>
              )}

              <div className="flex-1 p-4 flex flex-col items-center justify-center relative">
                {/* Big Avatar */}
                <div 
                  className="w-16 h-16 rounded-full border-[3px] border-border shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] flex items-center justify-center font-display font-black text-3xl text-white mb-3"
                  style={{ backgroundColor: player.color }}
                >
                  {player.displayName.charAt(0).toUpperCase()}
                </div>

                <div className="font-bold text-lg text-center leading-tight">
                  {player.displayName}
                  {isCurrent && <span className="text-xs text-primary ml-2">(YOU)</span>}
                </div>

                {/* Status Indicator */}
                <div className="mt-2 font-bold text-xs uppercase tracking-wider flex items-center gap-1">
                  {!player.connected ? (
                     <span className="text-danger flex items-center gap-1"><WifiOff className="w-3 h-3 stroke-[3]" /> LOST</span>
                  ) : player.ready ? (
                     <span className="text-success flex items-center gap-1"><CheckCircle2 className="w-3 h-3 stroke-[3]" /> READY</span>
                  ) : (
                     <span className="text-muted flex items-center gap-1"><Clock className="w-3 h-3 stroke-[3]" /> WAITING</span>
                  )}
                </div>
              </div>

              {/* Host Kick Action */}
              {currentHost && !player.isHost && (
                <button
                  onClick={() => kickPlayer(player.id)}
                  className="absolute bottom-2 right-2 p-2 bg-danger text-white border-2 border-border shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] hover:bg-red-600 hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all"
                  title="Kick player"
                >
                  <UserX className="w-4 h-4 stroke-[3]" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {teamsEnabled && (
        <div className="neo-brutal bg-surface p-6 mt-4">
          <h4 className="font-display font-black text-xl mb-4">TEAM SELECTION</h4>
          <div className="flex flex-wrap gap-4">
            {availableTeams.map((team) => {
              const myPlayer = roomState.players.find((p) => p.id === currentPlayerId);
              const isSelected = myPlayer?.teamId === team.id;

              return (
                <button
                  type="button"
                  key={team.id}
                  onClick={() => setTeam(isSelected ? null : team.id)}
                  className={`neo-brutal flex-1 min-w-[150px] py-3 px-4 font-bold uppercase tracking-wider transition-colors flex items-center justify-between ${
                    isSelected ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 border-2 border-border"
                      style={{ backgroundColor: team.color }}
                    />
                    {team.name}
                  </div>
                  {isSelected && <Check className="w-5 h-5 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
