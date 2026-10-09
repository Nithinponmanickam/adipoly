import type { MatchSettings } from './settings.types.js';
import type { PlayerSummary } from './player.types.js';

export type RoomStatus = 'LOBBY' | 'IN_GAME' | 'FINISHED';

export interface RoomState {
  roomCode: string;
  hostId: string;
  status: RoomStatus;
  players: PlayerSummary[];
  settings: MatchSettings;
  gameState?: import('./game.types.js').GameStateSummary;
  createdAt: number;
  updatedAt: number;
}
