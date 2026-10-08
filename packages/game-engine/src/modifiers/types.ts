import type { ChaosModifierId } from '@adipoly/shared';
import type { AuthoritativeGameState } from '../models/GameState.js';

export interface ModifierContext {
  state: AuthoritativeGameState;
  targetPlayerId?: string;
  payload?: Record<string, unknown>;
}

export interface IChaosModifier {
  readonly id: ChaosModifierId;
  readonly name: string;
  readonly description: string;
  readonly category: 'economic' | 'movement' | 'property' | 'wildcard';

  onTurnStart?(context: ModifierContext): void;
  onDiceRoll?(context: ModifierContext, roll: [number, number]): [number, number];
  onRentCalculation?(context: ModifierContext, baseRent: number): number;
}
