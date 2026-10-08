import type { MatchSettings, TurnPhase } from '@adipoly/shared';
import { GamePlayer } from './Player.js';
import { Property } from './Property.js';

export interface AuthoritativeGameState {
  gameId: string;
  roomCode: string;
  phase: TurnPhase;
  turnNumber: number;
  roundNumber: number;
  activePlayerIndex: number;
  players: GamePlayer[];
  properties: Record<string, Property>;
  settings: MatchSettings;
  winnerPlayerId?: string;
  createdAt: number;
  updatedAt: number;
}
