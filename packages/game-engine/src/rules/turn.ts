import type { TurnPhase } from '@adipoly/shared';

export class TurnStateMachine {
  private static readonly VALID_TRANSITIONS: Record<TurnPhase, TurnPhase[]> = {
    WAITING: ['ROLLING'],
    ROLLING: ['MOVING', 'JAIL'],
    MOVING: ['RESOLVING'],
    RESOLVING: ['ACTION', 'EVENT', 'AUCTION', 'JAIL', 'END_TURN'],
    ACTION: ['AUCTION', 'TRADE', 'END_TURN', 'GAME_OVER'],
    AUCTION: ['ACTION', 'END_TURN'],
    TRADE: ['ACTION', 'END_TURN'],
    EVENT: ['RESOLVING', 'ACTION', 'JAIL', 'END_TURN'],
    JAIL: ['END_TURN', 'ROLLING'],
    END_TURN: ['WAITING', 'ROLLING', 'GAME_OVER'],
    GAME_OVER: [],
  };

  public static canTransition(from: TurnPhase, to: TurnPhase): boolean {
    const allowed = this.VALID_TRANSITIONS[from];
    return allowed ? allowed.includes(to) : false;
  }
}
