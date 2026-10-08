import { createServer } from 'http';
import { Server } from 'socket.io';
import type { ClientToServerEvents, ServerToClientEvents } from '@adipoly/shared';
import { createApp } from './app.js';
import { CONFIG } from './config/index.js';
import { setupSocketHandlers } from './socket/handler.js';
import { roomManager } from './rooms/RoomManager.js';

const app = createApp();
const httpServer = createServer(app);

const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: CONFIG.CORS_ORIGIN === '*' ? true : CONFIG.CORS_ORIGIN,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

setupSocketHandlers(io);

// Periodically clean up inactive rooms
setInterval(() => {
  roomManager.cleanupInactiveRooms();
}, 60 * 1000);

httpServer.listen(CONFIG.PORT, () => {
  console.log(`🚀 [ADIPOLY SERVER] Authoritative game server listening on port ${CONFIG.PORT}`);
  console.log(`📡 WebSocket ready on port ${CONFIG.PORT}`);
});
