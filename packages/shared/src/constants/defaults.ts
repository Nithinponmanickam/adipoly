import type { ChaosModifierMeta, MatchSettings, TeamConfig } from '../types/settings.types.js';

export const ROOM_CODE_LENGTH = 5;
export const ROOM_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No 0, O, 1, I

export const MIN_PLAYERS = 2;
export const MAX_PLAYERS_LIMIT = 8;
export const DEFAULT_MAX_PLAYERS = 4;

export const STARTING_MONEY_PRESETS = [500, 1000, 1500, 2000, 5000] as const;
export const DEFAULT_STARTING_MONEY = 1500;
export const DEFAULT_CURRENCY_SYMBOL = '₹';

export const PLAYER_COLORS = [
  '#3B82F6', // Blue
  '#EF4444', // Red
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#F97316', // Orange
] as const;

export const DEFAULT_TEAMS: TeamConfig[] = [
  { id: 'team_alpha', name: 'Team Alpha', color: '#3B82F6', icon: 'shield' },
  { id: 'team_beta', name: 'Team Beta', color: '#EF4444', icon: 'zap' },
  { id: 'team_gamma', name: 'Team Gamma', color: '#10B981', icon: 'target' },
  { id: 'team_delta', name: 'Team Delta', color: '#F59E0B', icon: 'award' },
];

export const ALL_CHAOS_MODIFIERS: ChaosModifierMeta[] = [
  {
    id: 'DOUBLE_RENT',
    name: 'Double Rent',
    description: 'All property rent demands across the board are doubled.',
    category: 'economic',
  },
  {
    id: 'REVERSE_DIRECTION',
    name: 'Reverse Direction',
    description: 'Players travel counter-clockwise around the board.',
    category: 'movement',
  },
  {
    id: 'RANDOM_PROPERTY_PRICE',
    name: 'Volatile Real Estate',
    description: 'Property acquisition values fluctuate randomly every round.',
    category: 'property',
  },
  {
    id: 'RENT_SPIKE',
    name: 'Rent Spike',
    description: 'Landing on un-mortgaged properties applies surprise multipliers.',
    category: 'economic',
  },
  {
    id: 'BANK_BONUS',
    name: 'Subsidies & Stimulus',
    description: 'Special spaces yield higher payouts and dividend rewards.',
    category: 'economic',
  },
  {
    id: 'RANDOM_TELEPORT',
    name: 'Quantum Warp',
    description: 'Landing on certain spaces warps players to unexpected sectors.',
    category: 'movement',
  },
  {
    id: 'PROPERTY_BOOM',
    name: 'Sector Boom',
    description: 'Random industry sectors experience temporary valuation spikes.',
    category: 'property',
  },
  {
    id: 'MARKET_CRASH',
    name: 'Market Crash',
    description: 'Random industry sectors suffer a 50% rental discount.',
    category: 'property',
  },
  {
    id: 'LUCKY_ROLL',
    name: 'Jackpot Dice',
    description: 'Rolling doubles rewards the roller with cash bonuses.',
    category: 'wildcard',
  },
  {
    id: 'PROPERTY_AUCTION',
    name: 'Forced Auctions',
    description: 'Unbought properties automatically trigger aggressive public auctions.',
    category: 'property',
  },
  {
    id: 'JAIL_BREAK',
    name: 'Bailout Frenzy',
    description: 'Jailed players gain bonus escape avenues and higher payouts.',
    category: 'wildcard',
  },
  {
    id: 'POOR_GET_LUCKY',
    name: 'Underdog Relief',
    description: 'Players below cash safety thresholds receive periodic grants.',
    category: 'economic',
  },
  {
    id: 'RICH_GET_RISKY',
    name: 'Wealth Tax & Audits',
    description: 'High net-worth players trigger targeted audit and risk events.',
    category: 'economic',
  },
];

export const DEFAULT_MATCH_SETTINGS: MatchSettings = {
  players: {
    maxPlayers: DEFAULT_MAX_PLAYERS,
    startingMoney: DEFAULT_STARTING_MONEY,
    currencySymbol: DEFAULT_CURRENCY_SYMBOL,
  },
  rules: {
    tradingEnabled: true,
    auctionsEnabled: true,
    mortgagesEnabled: true,
    mortgageGraceTurns: 5,
    tradeAnalyzerEnabled: true,
    eventsEnabled: true,
    teamsEnabled: false,
    chatEnabled: true,
  },
  chaos: {
    chaosModeEnabled: false,
    selectedModifiers: [],
  },
  jail: {
    jailEnabled: true,
    jailRewardPercent: 10,
    jailEscapeRules: 'doubles_or_fee',
  },
  speed: 'normal',
};
