export interface PlayerSummary {
  id: string;
  displayName: string;
  isHost: boolean;
  ready: boolean;
  connected: boolean;
  color: string;
  teamId?: string | null;
  money?: number;
  position?: number;
  ownedPropertyIds?: string[];
}

export interface PlayerJailState {
  isJailed: boolean;
  turnsInJail: number;
  enteredTurn: number;
}

export interface Player extends PlayerSummary {
  socketId: string;
  sessionToken: string;
  money: number;
  position: number;
  ownedPropertyIds: string[];
  mortgagedPropertyIds: string[];
  jailState: PlayerJailState;
  temporaryEffects: Array<{
    id: string;
    type: string;
    remainingTurns: number;
    value: number;
  }>;
  createdAt: number;
  lastActiveAt: number;
}
