import type { PartialMatchSettings } from './settings.types.js';
import type { PlayerSummary } from './player.types.js';
import type { RoomState } from './room.types.js';
import type { ChatMessage } from './chat.types.js';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface ClientToServerEvents {
  'room:create': (
    data: { displayName: string; settings?: PartialMatchSettings },
    callback: (response: ApiResponse<{ roomCode: string; sessionToken: string; playerId: string }>) => void
  ) => void;

  'room:join': (
    data: { roomCode: string; displayName: string },
    callback: (response: ApiResponse<{ roomCode: string; sessionToken: string; playerId: string }>) => void
  ) => void;

  'session:reconnect': (
    data: { roomCode: string; sessionToken: string },
    callback: (response: ApiResponse<{ player: PlayerSummary; room: RoomState }>) => void
  ) => void;

  'player:ready': (data: { ready: boolean }) => void;

  'player:setTeam': (data: { teamId: string | null }) => void;

  'room:updateSettings': (data: { settings: PartialMatchSettings }) => void;

  'room:kickPlayer': (data: { targetPlayerId: string }) => void;

  'room:leave': () => void;

  'game:start': () => void;

  'chat:send': (data: { text: string }) => void;
  
  // Game Actions
  'game:rollDice': (callback: (response: ApiResponse<{ dice: [number, number] }>) => void) => void;
  'game:buyProperty': (callback: (response: ApiResponse<{}>) => void) => void;
  'game:endTurn': (callback: (response: ApiResponse<{}>) => void) => void;
}

export interface ServerToClientEvents {
  'room:state': (state: RoomState) => void;
  'chat:message': (message: ChatMessage) => void;
  'player:kicked': (data: { reason: string }) => void;
  'game:starting': (data: { countdown: number }) => void;
  'error:notification': (data: { message: string; code?: string }) => void;
}
