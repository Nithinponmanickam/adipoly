export const ERROR_CODES = {
  ROOM_NOT_FOUND: 'ROOM_NOT_FOUND',
  ROOM_FULL: 'ROOM_FULL',
  GAME_ALREADY_STARTED: 'GAME_ALREADY_STARTED',
  INVALID_DISPLAY_NAME: 'INVALID_DISPLAY_NAME',
  NOT_AUTHORIZED: 'NOT_AUTHORIZED',
  NOT_YOUR_TURN: 'NOT_YOUR_TURN',
  INSUFFICIENT_PLAYERS: 'INSUFFICIENT_PLAYERS',
  PLAYERS_NOT_READY: 'PLAYERS_NOT_READY',
  INVALID_SETTINGS: 'INVALID_SETTINGS',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  ACTION_FAILED: 'ACTION_FAILED',
  RATE_LIMITED: 'RATE_LIMITED',
} as const;

export const ERROR_MESSAGES: Record<keyof typeof ERROR_CODES, string> = {
  ROOM_NOT_FOUND: 'Room not found. Please check the room code and try again.',
  ROOM_FULL: 'This room is currently full.',
  GAME_ALREADY_STARTED: 'Game has already started in this room.',
  INVALID_DISPLAY_NAME: 'Display name must be between 2 and 20 characters.',
  NOT_AUTHORIZED: 'You are not authorized to perform this host action.',
  NOT_YOUR_TURN: "It's not your turn.",
  INSUFFICIENT_PLAYERS: 'At least 2 players are required to start the game.',
  PLAYERS_NOT_READY: 'All players must be ready before the match can begin.',
  INVALID_SETTINGS: 'The provided match configuration is invalid.',
  SESSION_EXPIRED: 'Session expired or invalid. Please join the room again.',
  ACTION_FAILED: 'Unable to process your request at this time.',
  RATE_LIMITED: 'Please wait a moment before sending another message.',
};
