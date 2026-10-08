import { describe, it, expect, beforeEach } from 'vitest';
import { RoomManager } from '../src/rooms/RoomManager.js';
import { ERROR_MESSAGES } from '@adipoly/shared';

describe('Player Session & Reconnection Tests', () => {
  let roomManager: RoomManager;

  beforeEach(() => {
    roomManager = new RoomManager();
  });

  it('marks player as disconnected on socket drop without removing from room', () => {
    const { room, player } = roomManager.createRoom('HostPlayer', 'socket_alpha');

    expect(player.connected).toBe(true);

    const { player: disconnectedPlayer } = roomManager.handleDisconnect('socket_alpha');
    expect(disconnectedPlayer?.id).toBe(player.id);
    expect(player.connected).toBe(false);
    expect(room.getPlayerCount()).toBe(1);
  });

  it('reattaches socket and restores connection on valid session reconnect', () => {
    const { room, player, sessionToken } = roomManager.createRoom('HostPlayer', 'socket_alpha');

    // Simulate disconnect
    roomManager.handleDisconnect('socket_alpha');
    expect(player.connected).toBe(false);

    // Simulate reconnect from new socket
    const { player: reconnectedPlayer } = roomManager.reconnect(
      room.roomCode,
      sessionToken,
      'socket_beta'
    );

    expect(reconnectedPlayer.id).toBe(player.id);
    expect(reconnectedPlayer.connected).toBe(true);
    expect(reconnectedPlayer.socketId).toBe('socket_beta');
    // Player was not duplicated
    expect(room.getPlayerCount()).toBe(1);
  });

  it('rejects reconnection with invalid session token', () => {
    const { room } = roomManager.createRoom('HostPlayer', 'socket_alpha');

    expect(() => {
      roomManager.reconnect(room.roomCode, 'invalid_fake_token', 'socket_beta');
    }).toThrow(ERROR_MESSAGES.SESSION_EXPIRED);
  });
});
