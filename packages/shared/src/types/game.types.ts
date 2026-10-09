export type TurnPhase =
  | 'WAITING'
  | 'ROLLING'
  | 'MOVING'
  | 'RESOLVING'
  | 'ACTION'
  | 'AUCTION'
  | 'TRADE'
  | 'EVENT'
  | 'JAIL'
  | 'END_TURN'
  | 'GAME_OVER';

export type SpaceType =
  | 'START'
  | 'PROPERTY'
  | 'SPECIAL'
  | 'EVENT'
  | 'JAIL'
  | 'AUCTION'
  | 'BONUS'
  | 'OTHER';

export interface BoardSpace {
  id: string;
  index: number;
  name: string;
  type: SpaceType;
  description?: string;
  propertyId?: string;
  color?: string;
}

export interface PropertyData {
  id: string;
  name: string;
  group: string;
  purchasePrice: number;
  baseRent: number;
  rentTiers: number[];
  mortgageValue: number;
  mortgaged: boolean;
  mortgageStartedTurn?: number;
  mortgageExpiryTurn?: number;
  ownerId?: string;
  developmentLevel: number; // 0 to 5
}

export interface GameStateSummary {
  gameId: string;
  phase: TurnPhase;
  turnNumber: number;
  activePlayerIndex: number;
  properties: Record<string, PropertyData>;
  lastDiceRoll?: [number, number];
}
