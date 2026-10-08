export const CONFIG = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 4000,
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  MAX_CHAT_HISTORY: 100,
  ROOM_CLEANUP_TIMEOUT_MS: 30 * 60 * 1000, // 30 minutes for inactive rooms
  DISCONNECT_GRACE_PERIOD_MS: 60 * 1000, // 1 minute before removing non-reconnected players in lobby
};
