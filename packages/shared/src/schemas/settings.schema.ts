import { z } from 'zod';
import { MAX_PLAYERS_LIMIT, MIN_PLAYERS } from '../constants/defaults.js';

export const ChaosModifierIdSchema = z.enum([
  'DOUBLE_RENT',
  'REVERSE_DIRECTION',
  'RANDOM_PROPERTY_PRICE',
  'RENT_SPIKE',
  'BANK_BONUS',
  'RANDOM_TELEPORT',
  'PROPERTY_BOOM',
  'MARKET_CRASH',
  'LUCKY_ROLL',
  'PROPERTY_AUCTION',
  'JAIL_BREAK',
  'POOR_GET_LUCKY',
  'RICH_GET_RISKY',
]);

export const PlayerSettingsSchema = z.object({
  maxPlayers: z.number().int().min(MIN_PLAYERS).max(MAX_PLAYERS_LIMIT),
  startingMoney: z.number().int().min(100).max(100000),
  currencySymbol: z.string().min(1).max(5),
});

export const GameRulesSettingsSchema = z.object({
  tradingEnabled: z.boolean(),
  auctionsEnabled: z.boolean(),
  mortgagesEnabled: z.boolean(),
  mortgageGraceTurns: z.number().int().min(-1).max(20),
  tradeAnalyzerEnabled: z.boolean(),
  eventsEnabled: z.boolean(),
  teamsEnabled: z.boolean(),
  chatEnabled: z.boolean(),
});

export const ChaosSettingsSchema = z.object({
  chaosModeEnabled: z.boolean(),
  selectedModifiers: z.array(ChaosModifierIdSchema),
});

export const JailSettingsSchema = z.object({
  jailEnabled: z.boolean(),
  jailRewardPercent: z.number().min(0).max(100),
  jailEscapeRules: z.enum(['doubles_or_fee', 'event_only', 'fee_only']),
});

export const GameSpeedSchema = z.enum(['casual', 'normal', 'fast']);

export const MatchSettingsSchema = z.object({
  players: PlayerSettingsSchema,
  rules: GameRulesSettingsSchema,
  chaos: ChaosSettingsSchema,
  jail: JailSettingsSchema,
  speed: GameSpeedSchema,
});

export const PartialMatchSettingsSchema = MatchSettingsSchema.deepPartial();
