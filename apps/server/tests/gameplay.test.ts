import { describe, it, expect, beforeEach } from 'vitest';
import { RoomManager } from '../src/rooms/RoomManager.js';
import { GameLoop } from '@adipoly/game-engine';

describe('Gameplay Loop & Authoritative Engine Tests', () => {
  let roomManager: RoomManager;

  beforeEach(() => {
    roomManager = new RoomManager();
  });

  it('starts game and creates authoritative GameLoop engine', () => {
    const { room, player: host } = roomManager.createRoom('HostPlayer', 'socket_1');
    const { player: player2 } = roomManager.joinRoom(room.roomCode, 'Player2', 'socket_2');

    room.setPlayerReady(player2.id, true);
    room.startGame(host.id);

    expect(room.status).toBe('IN_GAME');
    expect(room.gameEngine).toBeDefined();

    const state = room.getState();
    expect(state.gameState).toBeDefined();
    expect(state.gameState?.phase).toBe('ROLLING');
    expect(state.gameState?.turnNumber).toBe(1);
    expect(state.gameState?.activePlayerIndex).toBe(0);
  });

  it('rolls dice, records lastDiceRoll, and advances position', () => {
    const { room, player: host } = roomManager.createRoom('HostPlayer', 'socket_1');
    const { player: player2 } = roomManager.joinRoom(room.roomCode, 'Player2', 'socket_2');

    room.setPlayerReady(player2.id, true);
    room.startGame(host.id);

    const result = room.gameEngine!.rollDice(host.id);
    expect(result.success).toBe(true);
    expect(result.dice).toBeDefined();
    expect(result.dice![0]).toBeGreaterThanOrEqual(1);
    expect(result.dice![0]).toBeLessThanOrEqual(6);
    expect(result.dice![1]).toBeGreaterThanOrEqual(1);
    expect(result.dice![1]).toBeLessThanOrEqual(6);

    const state = room.getState();
    expect(state.gameState?.lastDiceRoll).toEqual(result.dice);
    expect(host.position).toBeGreaterThan(0);
  });

  it('disallows rolling when it is not the players turn', () => {
    const { room, player: host } = roomManager.createRoom('HostPlayer', 'socket_1');
    const { player: player2 } = roomManager.joinRoom(room.roomCode, 'Player2', 'socket_2');

    room.setPlayerReady(player2.id, true);
    room.startGame(host.id);

    const result = room.gameEngine!.rollDice(player2.id);
    expect(result.success).toBe(false);
    expect(result.message).toContain('Not your turn');
  });

  it('allows buying property when landing on unowned tile', () => {
    const { room, player: host } = roomManager.createRoom('HostPlayer', 'socket_1');
    const { player: player2 } = roomManager.joinRoom(room.roomCode, 'Player2', 'socket_2');

    room.setPlayerReady(player2.id, true);
    room.startGame(host.id);

    // Manually place host on Startup Alley (index 1) in ACTION phase
    host.position = 1;
    room.gameEngine!.state.phase = 'ACTION';

    const initialMoney = host.money;
    const buyResult = room.gameEngine!.buyProperty(host.id);

    expect(buyResult.success).toBe(true);
    expect(host.money).toBe(initialMoney - 60);
    expect(host.ownedPropertyIds).toContain('space_1');

    const state = room.getState();
    expect(state.gameState?.properties['space_1'].ownerId).toBe(host.id);
    expect(state.gameState?.phase).toBe('END_TURN');
  });

  it('charges rent when landing on another players property', () => {
    const { room, player: host } = roomManager.createRoom('HostPlayer', 'socket_1');
    const { player: player2 } = roomManager.joinRoom(room.roomCode, 'Player2', 'socket_2');

    room.setPlayerReady(player2.id, true);
    room.startGame(host.id);

    // Host owns Startup Alley (baseRent 6)
    const property = room.gameEngine!.state.properties['space_1'];
    property.ownerId = host.id;
    host.ownedPropertyIds.push('space_1');

    // Player 2 ends host's turn and takes turn
    room.gameEngine!.state.activePlayerIndex = 1;
    room.gameEngine!.state.phase = 'ROLLING';

    const player2InitialMoney = player2.money;
    const hostInitialMoney = host.money;

    // Player 2 starts at 0, moves 1 space onto space_1
    player2.position = 0;
    // Simulate move of 1 space
    (room.gameEngine as any).movePlayer(player2, 1);

    expect(player2.position).toBe(1);
    expect(player2.money).toBe(player2InitialMoney - 6);
    expect(host.money).toBe(hostInitialMoney + 6);
  });

  it('ends turn and transitions active player index cleanly', () => {
    const { room, player: host } = roomManager.createRoom('HostPlayer', 'socket_1');
    const { player: player2 } = roomManager.joinRoom(room.roomCode, 'Player2', 'socket_2');

    room.setPlayerReady(player2.id, true);
    room.startGame(host.id);

    room.gameEngine!.state.phase = 'END_TURN';
    const endTurnResult = room.gameEngine!.endTurn(host.id);

    expect(endTurnResult.success).toBe(true);
    expect(room.gameEngine!.state.activePlayerIndex).toBe(1);
    expect(room.gameEngine!.state.phase).toBe('ROLLING');
    expect(room.gameEngine!.state.turnNumber).toBe(2);
  });
});
