import { describe, it, expect, beforeEach } from 'vitest';
import { RoomManager } from '../src/rooms/RoomManager.js';
import { ERROR_MESSAGES, ROOM_CODE_LENGTH } from '@adipoly/shared';

describe('RoomManager & GameRoom Foundation Tests', () => {
  let roomManager: RoomManager;

  beforeEach(() => {
    roomManager = new RoomManager();
  });

  it('generates random uppercase room code of valid length and format', () => {
    const code = roomManager.generateRoomCode();
    expect(code).toHaveLength(ROOM_CODE_LENGTH);
    expect(code).toMatch(/^[A-Z0-9]+$/);
  });

  it('creates room and designates first player as host with ready state', () => {
    const { room, player, sessionToken } = roomManager.createRoom('HostPlayer', 'socket_1');

    expect(room.roomCode).toBeDefined();
    expect(room.hostId).toBe(player.id);
    expect(player.isHost).toBe(true);
    expect(player.ready).toBe(true);
    expect(player.displayName).toBe('HostPlayer');
    expect(sessionToken).toBeDefined();
    expect(room.getPlayerCount()).toBe(1);
  });

  it('allows second player to join existing room by code', () => {
    const { room } = roomManager.createRoom('HostPlayer', 'socket_1');
    const { player: joiner } = roomManager.joinRoom(room.roomCode, 'SecondPlayer', 'socket_2');

    expect(room.getPlayerCount()).toBe(2);
    expect(joiner.displayName).toBe('SecondPlayer');
    expect(joiner.isHost).toBe(false);
    expect(joiner.ready).toBe(false);
  });

  it('rejects joining a non-existent room', () => {
    expect(() => {
      roomManager.joinRoom('XXXXX', 'GhostPlayer', 'socket_3');
    }).toThrow(ERROR_MESSAGES.ROOM_NOT_FOUND);
  });

  it('enforces maximum player limit configured on the room', () => {
    const { room } = roomManager.createRoom('HostPlayer', 'socket_1', {
      players: { maxPlayers: 2, startingMoney: 1500, currencySymbol: '₹' },
    });

    roomManager.joinRoom(room.roomCode, 'Player2', 'socket_2');

    expect(() => {
      roomManager.joinRoom(room.roomCode, 'Player3', 'socket_3');
    }).toThrow(ERROR_MESSAGES.ROOM_FULL);
  });
});
