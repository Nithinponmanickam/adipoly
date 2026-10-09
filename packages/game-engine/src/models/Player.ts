import type { Player as IPlayer, PlayerJailState, PlayerSummary } from '@adipoly/shared';

export class GamePlayer {
  public id: string;
  public displayName: string;
  public socketId: string;
  public sessionToken: string;
  public isHost: boolean;
  public ready: boolean;
  public connected: boolean;
  public color: string;
  public teamId?: string | null;
  public money: number;
  public position: number;
  public ownedPropertyIds: string[];
  public mortgagedPropertyIds: string[];
  public jailState: PlayerJailState;
  public temporaryEffects: Array<{
    id: string;
    type: string;
    remainingTurns: number;
    value: number;
  }>;
  public createdAt: number;
  public lastActiveAt: number;

  constructor(data: Partial<IPlayer> & { id: string; displayName: string; sessionToken: string; socketId: string }) {
    this.id = data.id;
    this.displayName = data.displayName;
    this.socketId = data.socketId;
    this.sessionToken = data.sessionToken;
    this.isHost = data.isHost ?? false;
    this.ready = data.ready ?? false;
    this.connected = data.connected ?? true;
    this.color = data.color ?? '#3B82F6';
    this.teamId = data.teamId ?? null;
    this.money = data.money ?? 1500;
    this.position = data.position ?? 0;
    this.ownedPropertyIds = data.ownedPropertyIds ?? [];
    this.mortgagedPropertyIds = data.mortgagedPropertyIds ?? [];
    this.jailState = data.jailState ?? {
      isJailed: false,
      turnsInJail: 0,
      enteredTurn: 0,
    };
    this.temporaryEffects = data.temporaryEffects ?? [];
    this.createdAt = data.createdAt ?? Date.now();
    this.lastActiveAt = data.lastActiveAt ?? Date.now();
  }

  public toSummary(): PlayerSummary {
    return {
      id: this.id,
      displayName: this.displayName,
      isHost: this.isHost,
      ready: this.ready,
      connected: this.connected,
      color: this.color,
      teamId: this.teamId,
      money: this.money,
      position: this.position,
      ownedPropertyIds: this.ownedPropertyIds,
    };
  }
}
