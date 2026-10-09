import type { Server, Socket } from 'socket.io';
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from '@adipoly/shared';
import {
  CreateRoomPayloadSchema,
  ERROR_CODES,
  ERROR_MESSAGES,
  JoinRoomPayloadSchema,
  KickPlayerPayloadSchema,
  ReadyPayloadSchema,
  ReconnectPayloadSchema,
  SendChatPayloadSchema,
  SetTeamPayloadSchema,
  UpdateSettingsPayloadSchema,
} from '@adipoly/shared';
import { roomManager } from '../rooms/RoomManager.js';

export function setupSocketHandlers(io: Server<ClientToServerEvents, ServerToClientEvents>): void {
  io.on('connection', (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
    // 1. Create Room
    socket.on('room:create', (payload, callback) => {
      try {
        const parsed = CreateRoomPayloadSchema.safeParse(payload);
        if (!parsed.success) {
          callback({
            success: false,
            error: {
              code: ERROR_CODES.INVALID_DISPLAY_NAME,
              message: parsed.error.issues[0]?.message || ERROR_MESSAGES.INVALID_DISPLAY_NAME,
            },
          });
          return;
        }

        const { room, player, sessionToken } = roomManager.createRoom(
          parsed.data.displayName,
          socket.id,
          parsed.data.settings
        );

        socket.join(room.roomCode);

        callback({
          success: true,
          data: {
            roomCode: room.roomCode,
            sessionToken,
            playerId: player.id,
          },
        });

        // Broadcast initial state & chat history to room
        io.to(room.roomCode).emit('room:state', room.getState());
        for (const msg of room.getChatHistory()) {
          socket.emit('chat:message', msg);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : ERROR_MESSAGES.ACTION_FAILED;
        callback({
          success: false,
          error: { code: ERROR_CODES.ACTION_FAILED, message: msg },
        });
      }
    });

    // 2. Join Room
    socket.on('room:join', (payload, callback) => {
      try {
        const parsed = JoinRoomPayloadSchema.safeParse(payload);
        if (!parsed.success) {
          callback({
            success: false,
            error: {
              code: ERROR_CODES.INVALID_DISPLAY_NAME,
              message: parsed.error.issues[0]?.message || 'Invalid join parameters.',
            },
          });
          return;
        }

        const { room, player, sessionToken } = roomManager.joinRoom(
          parsed.data.roomCode,
          parsed.data.displayName,
          socket.id
        );

        socket.join(room.roomCode);

        callback({
          success: true,
          data: {
            roomCode: room.roomCode,
            sessionToken,
            playerId: player.id,
          },
        });

        // Broadcast updated room state to all players
        io.to(room.roomCode).emit('room:state', room.getState());

        // Send existing chat history to newly joined player
        for (const msg of room.getChatHistory()) {
          socket.emit('chat:message', msg);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : ERROR_MESSAGES.ACTION_FAILED;
        callback({
          success: false,
          error: { code: ERROR_CODES.ACTION_FAILED, message: msg },
        });
      }
    });

    // 3. Reconnect Session
    socket.on('session:reconnect', (payload, callback) => {
      try {
        const parsed = ReconnectPayloadSchema.safeParse(payload);
        if (!parsed.success) {
          callback({
            success: false,
            error: {
              code: ERROR_CODES.SESSION_EXPIRED,
              message: 'Invalid reconnection payload.',
            },
          });
          return;
        }

        const { room, player } = roomManager.reconnect(
          parsed.data.roomCode,
          parsed.data.sessionToken,
          socket.id
        );

        socket.join(room.roomCode);

        callback({
          success: true,
          data: {
            player: player.toSummary(),
            room: room.getState(),
          },
        });

        // Broadcast updated state to room
        io.to(room.roomCode).emit('room:state', room.getState());

        // Send chat history
        for (const msg of room.getChatHistory()) {
          socket.emit('chat:message', msg);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : ERROR_MESSAGES.SESSION_EXPIRED;
        callback({
          success: false,
          error: { code: ERROR_CODES.SESSION_EXPIRED, message: msg },
        });
      }
    });

    // 4. Ready / Unready
    socket.on('player:ready', (payload) => {
      const parsed = ReadyPayloadSchema.safeParse(payload);
      if (!parsed.success) return;

      const room = roomManager.getRoomBySocketId(socket.id);
      const player = roomManager.getPlayerBySocketId(socket.id);
      if (!room || !player) return;

      room.setPlayerReady(player.id, parsed.data.ready);
      io.to(room.roomCode).emit('room:state', room.getState());
    });

    // 5. Set Team
    socket.on('player:setTeam', (payload) => {
      const parsed = SetTeamPayloadSchema.safeParse(payload);
      if (!parsed.success) return;

      const room = roomManager.getRoomBySocketId(socket.id);
      const player = roomManager.getPlayerBySocketId(socket.id);
      if (!room || !player) return;

      try {
        room.setPlayerTeam(player.id, parsed.data.teamId);
        io.to(room.roomCode).emit('room:state', room.getState());
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to update team.';
        socket.emit('error:notification', { message: msg });
      }
    });

    // 6. Update Settings (Host Only)
    socket.on('room:updateSettings', (payload) => {
      const parsed = UpdateSettingsPayloadSchema.safeParse(payload);
      if (!parsed.success) {
        socket.emit('error:notification', {
          message: parsed.error.issues[0]?.message || ERROR_MESSAGES.INVALID_SETTINGS,
        });
        return;
      }

      const room = roomManager.getRoomBySocketId(socket.id);
      const player = roomManager.getPlayerBySocketId(socket.id);
      if (!room || !player) return;

      try {
        room.updateSettings(player.id, parsed.data.settings);
        io.to(room.roomCode).emit('room:state', room.getState());
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to update settings.';
        socket.emit('error:notification', { message: msg });
      }
    });

    // 7. Kick Player (Host Only)
    socket.on('room:kickPlayer', (payload) => {
      const parsed = KickPlayerPayloadSchema.safeParse(payload);
      if (!parsed.success) return;

      const room = roomManager.getRoomBySocketId(socket.id);
      const host = roomManager.getPlayerBySocketId(socket.id);
      if (!room || !host) return;

      try {
        const kicked = room.kickPlayer(host.id, parsed.data.targetPlayerId);

        // Notify kicked player if still connected
        io.to(kicked.socketId).emit('player:kicked', {
          reason: 'You were kicked from the room by the host.',
        });

        // Broadcast updated state
        io.to(room.roomCode).emit('room:state', room.getState());
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to kick player.';
        socket.emit('error:notification', { message: msg });
      }
    });

    // 8. Start Game (Host Only)
    socket.on('game:start', () => {
      const room = roomManager.getRoomBySocketId(socket.id);
      const host = roomManager.getPlayerBySocketId(socket.id);
      if (!room || !host) return;

      try {
        room.startGame(host.id);
        io.to(room.roomCode).emit('room:state', room.getState());
        io.to(room.roomCode).emit('game:starting', { countdown: 3 });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Could not start game.';
        socket.emit('error:notification', { message: msg });
      }
    });

    // 9. Send Chat Message
    socket.on('chat:send', (payload) => {
      const parsed = SendChatPayloadSchema.safeParse(payload);
      if (!parsed.success) return;

      const room = roomManager.getRoomBySocketId(socket.id);
      const player = roomManager.getPlayerBySocketId(socket.id);
      if (!room || !player) return;

      try {
        const chatMsg = room.addChatMessage(player.id, parsed.data.text);
        io.to(room.roomCode).emit('chat:message', chatMsg);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Could not send message.';
        socket.emit('error:notification', { message: msg });
      }
    });

    // 10. Game Actions
    socket.on('game:rollDice', (callback) => {
      const room = roomManager.getRoomBySocketId(socket.id);
      const player = roomManager.getPlayerBySocketId(socket.id);
      if (!room || !player || !room.gameEngine) return;
      
      const result = room.gameEngine.rollDice(player.id);
      if (result.success && result.dice) {
        callback({ success: true, data: { dice: result.dice } });
        io.to(room.roomCode).emit('room:state', room.getState());
        if (result.message) {
          room.addSystemChatMessage(`${player.displayName} ${result.message}`);
          io.to(room.roomCode).emit('chat:message', room.getChatHistory()[room.getChatHistory().length - 1]);
        }
      } else {
        callback({ success: false, error: { code: 'ROLL_FAILED', message: result.message || 'Failed to roll' } });
      }
    });

    socket.on('game:buyProperty', (callback) => {
      const room = roomManager.getRoomBySocketId(socket.id);
      const player = roomManager.getPlayerBySocketId(socket.id);
      if (!room || !player || !room.gameEngine) return;
      
      const result = room.gameEngine.buyProperty(player.id);
      if (result.success) {
        callback({ success: true, data: {} });
        io.to(room.roomCode).emit('room:state', room.getState());
        if (result.message) {
          room.addSystemChatMessage(`${player.displayName} ${result.message}`);
          io.to(room.roomCode).emit('chat:message', room.getChatHistory()[room.getChatHistory().length - 1]);
        }
      } else {
        callback({ success: false, error: { code: 'BUY_FAILED', message: result.message || 'Failed to buy' } });
      }
    });

    socket.on('game:endTurn', (callback) => {
      const room = roomManager.getRoomBySocketId(socket.id);
      const player = roomManager.getPlayerBySocketId(socket.id);
      if (!room || !player || !room.gameEngine) return;
      
      const result = room.gameEngine.endTurn(player.id);
      if (result.success) {
        callback({ success: true, data: {} });
        io.to(room.roomCode).emit('room:state', room.getState());
      } else {
        callback({ success: false, error: { code: 'END_TURN_FAILED', message: result.message || 'Failed to end turn' } });
      }
    });

    // 11. Leave Room
    socket.on('room:leave', () => {
      const { room } = roomManager.leaveRoom(socket.id);
      if (room) {
        socket.leave(room.roomCode);
        io.to(room.roomCode).emit('room:state', room.getState());
      }
    });

    // 11. Disconnect
    socket.on('disconnect', () => {
      const { room } = roomManager.handleDisconnect(socket.id);
      if (room) {
        io.to(room.roomCode).emit('room:state', room.getState());
      }
    });
  });
}
