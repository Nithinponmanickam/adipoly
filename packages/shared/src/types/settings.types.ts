export type GameSpeed = 'casual' | 'normal' | 'fast';

export type JailEscapeRule = 'doubles_or_fee' | 'event_only' | 'fee_only';

export type ChaosModifierId =
  | 'DOUBLE_RENT'
  | 'REVERSE_DIRECTION'
  | 'RANDOM_PROPERTY_PRICE'
  | 'RENT_SPIKE'
  | 'BANK_BONUS'
  | 'RANDOM_TELEPORT'
  | 'PROPERTY_BOOM'
  | 'MARKET_CRASH'
  | 'LUCKY_ROLL'
  | 'PROPERTY_AUCTION'
  | 'JAIL_BREAK'
  | 'POOR_GET_LUCKY'
  | 'RICH_GET_RISKY';

export interface ChaosModifierMeta {
  id: ChaosModifierId;
  name: string;
  description: string;
  category: 'economic' | 'movement' | 'property' | 'wildcard';
}

export interface PlayerSettings {
  maxPlayers: number; // 2 to 8
  startingMoney: number;
  currencySymbol: string;
}

export interface GameRulesSettings {
  tradingEnabled: boolean;
  auctionsEnabled: boolean;
  mortgagesEnabled: boolean;
  mortgageGraceTurns: number; // e.g. 3, 4, 5, 6 turns; -1 for never expires
  tradeAnalyzerEnabled: boolean;
  eventsEnabled: boolean;
  teamsEnabled: boolean;
  chatEnabled: boolean;
}

export interface TeamConfig {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface ChaosSettings {
  chaosModeEnabled: boolean;
  selectedModifiers: ChaosModifierId[];
}

export interface JailSettings {
  jailEnabled: boolean;
  jailRewardPercent: number; // default 10%
  jailEscapeRules: JailEscapeRule;
}

export interface MatchSettings {
  players: PlayerSettings;
  rules: GameRulesSettings;
  chaos: ChaosSettings;
  jail: JailSettings;
  speed: GameSpeed;
}

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? U[]
    : T[P] extends object
    ? DeepPartial<T[P]>
    : T[P];
};

export type PartialMatchSettings = DeepPartial<MatchSettings>;
