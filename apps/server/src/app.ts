import express from 'express';
import cors from 'cors';
import { roomManager } from './rooms/RoomManager.js';
import { CONFIG } from './config/index.js';

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: CONFIG.CORS_ORIGIN === '*' ? true : CONFIG.CORS_ORIGIN,
      credentials: true,
    })
  );

  app.use(express.json());

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'adipoly-server',
      version: '0.1.0',
      activeRooms: roomManager.getActiveRoomCount(),
      timestamp: Date.now(),
    });
  });

  // Query room info
  app.get('/api/rooms/:code', (req, res) => {
    const room = roomManager.getRoom(req.params.code);
    if (!room) {
      res.status(404).json({ error: 'Room not found' });
      return;
    }

    res.json({
      roomCode: room.roomCode,
      status: room.status,
      playerCount: room.getPlayerCount(),
      maxPlayers: room.settings.players.maxPlayers,
    });
  });

  return app;
}
