import { describe, it, expect, beforeEach } from 'vitest';
import { RoomManager } from '../src/rooms/RoomManager.js';
import { ERROR_MESSAGES } from '@adipoly/shared';

describe('Lobby Operations & Host Permissions Tests', () => {
  let roomManager: RoomManager;

  beforeEach(() => {
    roomManager = new RoomManager();
  });

  it('allows players to toggle ready and unready', () => {
    const { room } = roomManager.createRoom('HostPlayer', 'socket_1');
    const { player: joiner } = roomManager.joinRoom(room.roomCode, 'Player2', 'socket_2');

    expect(joiner.ready).toBe(false);

    room.setPlayerReady(joiner.id, true);
    expect(joiner.ready).toBe(true);

    room.setPlayerReady(joiner.id, false);
    expect(joiner.ready).toBe(false);
  });

  it('validates start game readiness: blocked if player is not ready', () => {
    const { room, player: host } = roomManager.createRoom('HostPlayer', 'socket_1');
    const { player: p2 } = roomManager.joinRoom(room.roomCode, 'Player2', 'socket_2');

    expect(room.canStartGame().allowed).toBe(false);

    room.setPlayerReady(p2.id, true);
    expect(room.canStartGame().allowed).toBe(true);

    expect(() => room.startGame(host.id)).not.toThrow();
    expect(room.status).toBe('IN_GAME');
  });

  it('blocks non-hosts from starting game or modifying settings', () => {
    const { room } = roomManager.createRoom('HostPlayer', 'socket_1');
    const { player: nonHost } = roomManager.joinRoom(room.roomCode, 'Player2', 'socket_2');

    expect(() => {
      room.updateSettings(nonHost.id, { speed: 'fast' });
    }).toThrow(ERROR_MESSAGES.NOT_AUTHORIZED);

    expect(() => {
      room.startGame(nonHost.id);
    }).toThrow(ERROR_MESSAGES.NOT_AUTHORIZED);
  });

  it('allows host to kick player, but not kick themselves', () => {
    const { room, player: host } = roomManager.createRoom('HostPlayer', 'socket_1');
    const { player: p2 } = roomManager.joinRoom(room.roomCode, 'Player2', 'socket_2');

    expect(() => {
      room.kickPlayer(host.id, host.id);
    }).toThrow('You cannot kick yourself.');

    const kicked = room.kickPlayer(host.id, p2.id);
    expect(kicked.id).toBe(p2.id);
    expect(room.getPlayerCount()).toBe(1);
  });

  it('migrates host role when host leaves lobby', () => {
    const { room, player: host } = roomManager.createRoom('HostPlayer', 'socket_1');
    const { player: p2 } = roomManager.joinRoom(room.roomCode, 'Player2', 'socket_2');

    expect(room.hostId).toBe(host.id);

    room.removePlayer(host.id);
    expect(room.hostId).toBe(p2.id);
    expect(p2.isHost).toBe(true);
  });

  it('adds and retains chat messages in room history', () => {
    const { room, player: host } = roomManager.createRoom('HostPlayer', 'socket_1');

    const msg = room.addChatMessage(host.id, 'Hello everyone!');
    expect(msg.text).toBe('Hello everyone!');
    expect(msg.senderName).toBe('HostPlayer');
    expect(room.getChatHistory().some((m) => m.text === 'Hello everyone!')).toBe(true);
  });
});
