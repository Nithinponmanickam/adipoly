import type { PartialMatchSettings } from '@adipoly/shared';
import {
  ERROR_MESSAGES,
  ROOM_CODE_ALPHABET,
  ROOM_CODE_LENGTH,
} from '@adipoly/shared';
import { GameRoom } from './GameRoom.js';
import { sessionService } from '../services/session.js';
import { GamePlayer } from '@adipoly/game-engine';
import { CONFIG } from '../config/index.js';

export interface RoomJoinResult {
  room: GameRoom;
  player: GamePlayer;
  sessionToken: string;
}

export class RoomManager {
  private rooms = new Map<string, GameRoom>(); // key: roomCode (UPPERCASE)
  private socketToPlayerMap = new Map<string, { roomCode: string; playerId: string }>();

  public generateRoomCode(): string {
    const chars = ROOM_CODE_ALPHABET;
    let code = '';
    let attempts = 0;

    do {
      code = '';
      for (let i = 0; i < ROOM_CODE_LENGTH; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        code += chars[randomIndex];
      }
      attempts++;
      if (attempts > 1000) {
        throw new Error('Could not generate unique room code. System is saturated.');
      }
    } while (this.rooms.has(code));

    return code;
  }

  public createRoom(
    displayName: string,
    socketId: string,
    initialSettings?: PartialMatchSettings
  ): RoomJoinResult {
    const roomCode = this.generateRoomCode();
    const room = new GameRoom(roomCode, initialSettings);

    const sessionToken = sessionService.createSession('temp', roomCode);
    const player = room.addPlayer(displayName, socketId, sessionToken);

    // Update session with final playerId
    const session = sessionService.getSession(sessionToken);
    if (session) {
      session.playerId = player.id;
    }

    this.rooms.set(roomCode, room);
    this.socketToPlayerMap.set(socketId, { roomCode, playerId: player.id });

    return { room, player, sessionToken };
  }

  public joinRoom(roomCode: string, displayName: string, socketId: string): RoomJoinResult {
    const normalizedCode = roomCode.trim().toUpperCase();
    const room = this.rooms.get(normalizedCode);
    if (!room) {
      throw new Error(ERROR_MESSAGES.ROOM_NOT_FOUND);
    }

    const sessionToken = sessionService.createSession('temp', normalizedCode);
    const player = room.addPlayer(displayName, socketId, sessionToken);

    const session = sessionService.getSession(sessionToken);
    if (session) {
      session.playerId = player.id;
    }

    this.socketToPlayerMap.set(socketId, { roomCode: normalizedCode, playerId: player.id });

    return { room, player, sessionToken };
  }

  public reconnect(roomCode: string, sessionToken: string, newSocketId: string): RoomJoinResult {
    const normalizedCode = roomCode.trim().toUpperCase();
    const room = this.rooms.get(normalizedCode);
    if (!room) {
      throw new Error(ERROR_MESSAGES.ROOM_NOT_FOUND);
    }

    const session = sessionService.getSession(sessionToken);
    if (!session || session.roomCode !== normalizedCode) {
      throw new Error(ERROR_MESSAGES.SESSION_EXPIRED);
    }

    const player = room.reconnectPlayer(sessionToken, newSocketId);
    this.socketToPlayerMap.set(newSocketId, { roomCode: normalizedCode, playerId: player.id });

    return { room, player, sessionToken };
  }

  public getRoom(roomCode: string): GameRoom | undefined {
    return this.rooms.get(roomCode.trim().toUpperCase());
  }

  public getRoomBySocketId(socketId: string): GameRoom | undefined {
    const mapping = this.socketToPlayerMap.get(socketId);
    if (!mapping) return undefined;
    return this.rooms.get(mapping.roomCode);
  }

  public getPlayerBySocketId(socketId: string): GamePlayer | undefined {
    const mapping = this.socketToPlayerMap.get(socketId);
    if (!mapping) return undefined;
    const room = this.rooms.get(mapping.roomCode);
    return room?.getPlayer(mapping.playerId);
  }

  public handleDisconnect(socketId: string): { room?: GameRoom; player?: GamePlayer } {
    const mapping = this.socketToPlayerMap.get(socketId);
    if (!mapping) return {};

    this.socketToPlayerMap.delete(socketId);
    const room = this.rooms.get(mapping.roomCode);
    if (!room) return {};

    const player = room.disconnectPlayer(socketId);
    return { room, player: player ?? undefined };
  }

  public leaveRoom(socketId: string): { room?: GameRoom; removedPlayerId?: string } {
    const mapping = this.socketToPlayerMap.get(socketId);
    if (!mapping) return {};

    this.socketToPlayerMap.delete(socketId);
    const room = this.rooms.get(mapping.roomCode);
    if (!room) return {};

    room.removePlayer(mapping.playerId);

    // If no players remain at all, destroy room
    if (room.getPlayerCount() === 0) {
      this.removeRoom(mapping.roomCode);
      return { removedPlayerId: mapping.playerId };
    }

    return { room, removedPlayerId: mapping.playerId };
  }

  public removeRoom(roomCode: string): void {
    const normalizedCode = roomCode.trim().toUpperCase();
    this.rooms.delete(normalizedCode);
    sessionService.removeSessionsForRoom(normalizedCode);
  }

  public cleanupInactiveRooms(): void {
    const now = Date.now();
    for (const [code, room] of this.rooms.entries()) {
      if (
        room.getConnectedPlayerCount() === 0 &&
        now - room.updatedAt > CONFIG.ROOM_CLEANUP_TIMEOUT_MS
      ) {
        this.removeRoom(code);
      }
    }
  }

  public getActiveRoomCount(): number {
    return this.rooms.size;
  }
}

export const roomManager = new RoomManager();
