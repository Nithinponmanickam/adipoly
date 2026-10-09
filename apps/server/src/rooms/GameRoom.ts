import { v4 as uuidv4 } from 'uuid';
import type {
  ChatMessage,
  MatchSettings,
  PartialMatchSettings,
  PlayerSummary,
  RoomState,
  RoomStatus,
} from '@adipoly/shared';
import {
  DEFAULT_MATCH_SETTINGS,
  ERROR_MESSAGES,
  MIN_PLAYERS,
  PLAYER_COLORS,
} from '@adipoly/shared';
import { GamePlayer, TeamManager, GameLoop } from '@adipoly/game-engine';
import { CONFIG } from '../config/index.js';

export class GameRoom {
  public readonly roomCode: string;
  public hostId: string;
  public status: RoomStatus = 'LOBBY';
  public settings: MatchSettings;
  public createdAt: number;
  public updatedAt: number;
  
  public gameEngine?: GameLoop;

  private players = new Map<string, GamePlayer>(); // playerId -> GamePlayer
  private chatMessages: ChatMessage[] = [];
  private lastMessageTimestamps = new Map<string, number>(); // playerId -> lastSentMs (rate-limiting)

  constructor(roomCode: string, initialSettings?: PartialMatchSettings) {
    this.roomCode = roomCode;
    this.hostId = '';
    this.createdAt = Date.now();
    this.updatedAt = Date.now();
    this.settings = {
      players: { ...DEFAULT_MATCH_SETTINGS.players, ...(initialSettings?.players || {}) },
      rules: { ...DEFAULT_MATCH_SETTINGS.rules, ...(initialSettings?.rules || {}) },
      chaos: { ...DEFAULT_MATCH_SETTINGS.chaos, ...(initialSettings?.chaos || {}) },
      jail: { ...DEFAULT_MATCH_SETTINGS.jail, ...(initialSettings?.jail || {}) },
      speed: initialSettings?.speed || DEFAULT_MATCH_SETTINGS.speed,
    };
  }

  public getPlayerCount(): number {
    return this.players.size;
  }

  public getConnectedPlayerCount(): number {
    let count = 0;
    for (const p of this.players.values()) {
      if (p.connected) count++;
    }
    return count;
  }

  public getPlayer(playerId: string): GamePlayer | undefined {
    return this.players.get(playerId);
  }

  public getPlayerBySocketId(socketId: string): GamePlayer | undefined {
    for (const player of this.players.values()) {
      if (player.socketId === socketId) return player;
    }
    return undefined;
  }

  public getPlayerBySession(sessionToken: string): GamePlayer | undefined {
    for (const player of this.players.values()) {
      if (player.sessionToken === sessionToken) return player;
    }
    return undefined;
  }

  public addPlayer(displayName: string, socketId: string, sessionToken: string): GamePlayer {
    if (this.players.size >= this.settings.players.maxPlayers) {
      throw new Error(ERROR_MESSAGES.ROOM_FULL);
    }
    if (this.status !== 'LOBBY') {
      throw new Error(ERROR_MESSAGES.GAME_ALREADY_STARTED);
    }

    const playerId = uuidv4();
    const isFirstPlayer = this.players.size === 0;

    // Pick color not yet taken
    const usedColors = new Set(Array.from(this.players.values()).map((p) => p.color));
    const assignedColor =
      PLAYER_COLORS.find((c) => !usedColors.has(c)) ||
      PLAYER_COLORS[this.players.size % PLAYER_COLORS.length];

    const player = new GamePlayer({
      id: playerId,
      displayName: displayName.trim(),
      socketId,
      sessionToken,
      isHost: isFirstPlayer,
      ready: isFirstPlayer, // Host is ready by default
      connected: true,
      color: assignedColor,
      money: this.settings.players.startingMoney,
    });

    if (isFirstPlayer) {
      this.hostId = playerId;
    }

    this.players.set(playerId, player);
    this.updatedAt = Date.now();

    this.addSystemChatMessage(`${player.displayName} joined the lobby.`);

    return player;
  }

  public reconnectPlayer(sessionToken: string, newSocketId: string): GamePlayer {
    const player = this.getPlayerBySession(sessionToken);
    if (!player) {
      throw new Error(ERROR_MESSAGES.SESSION_EXPIRED);
    }

    if (player.connected && player.socketId === newSocketId) {
      // Avoid duplicate spam during React StrictMode double mounts
      return player;
    }

    player.socketId = newSocketId;
    player.connected = true;
    player.lastActiveAt = Date.now();
    this.updatedAt = Date.now();

    this.addSystemChatMessage(`${player.displayName} reconnected.`);

    return player;
  }

  public disconnectPlayer(socketId: string): GamePlayer | null {
    const player = this.getPlayerBySocketId(socketId);
    if (!player) return null;

    player.connected = false;
    player.lastActiveAt = Date.now();
    this.updatedAt = Date.now();

    this.addSystemChatMessage(`${player.displayName} disconnected.`);

    return player;
  }

  public removePlayer(playerId: string): boolean {
    const player = this.players.get(playerId);
    if (!player) return false;

    const displayName = player.displayName;
    this.players.delete(playerId);
    this.updatedAt = Date.now();

    // Reassign host if host left
    if (this.hostId === playerId && this.players.size > 0) {
      const remainingPlayers = Array.from(this.players.values());
      const connectedRemaining = remainingPlayers.find((p) => p.connected);
      const nextHost = connectedRemaining || remainingPlayers[0];
      nextHost.isHost = true;
      nextHost.ready = true;
      this.hostId = nextHost.id;
      this.addSystemChatMessage(`${displayName} left. ${nextHost.displayName} is now the host.`);
    } else {
      this.addSystemChatMessage(`${displayName} left the lobby.`);
    }

    return true;
  }

  public setPlayerReady(playerId: string, ready: boolean): void {
    const player = this.players.get(playerId);
    if (!player) return;
    if (this.status !== 'LOBBY') return;

    player.ready = ready;
    this.updatedAt = Date.now();
  }

  public setPlayerTeam(playerId: string, teamId: string | null): void {
    if (!this.settings.rules.teamsEnabled) {
      throw new Error('Team mode is not currently enabled for this room.');
    }
    const player = this.players.get(playerId);
    if (!player) return;

    player.teamId = teamId;
    this.updatedAt = Date.now();
  }

  public updateSettings(requesterId: string, newSettings: PartialMatchSettings): void {
    if (this.hostId !== requesterId) {
      throw new Error(ERROR_MESSAGES.NOT_AUTHORIZED);
    }
    if (this.status !== 'LOBBY') {
      throw new Error('Match settings cannot be modified after the game has started.');
    }

    if (newSettings.players) {
      const requestedMax = newSettings.players.maxPlayers ?? this.settings.players.maxPlayers;
      if (requestedMax < this.players.size) {
        throw new Error(`Cannot set player limit below the current player count (${this.players.size}).`);
      }
      this.settings.players = { ...this.settings.players, ...newSettings.players };
    }

    if (newSettings.rules) {
      this.settings.rules = { ...this.settings.rules, ...newSettings.rules };
    }

    if (newSettings.chaos) {
      this.settings.chaos = { ...this.settings.chaos, ...newSettings.chaos };
    }

    if (newSettings.jail) {
      this.settings.jail = { ...this.settings.jail, ...newSettings.jail };
    }

    if (newSettings.speed) {
      this.settings.speed = newSettings.speed;
    }

    this.updatedAt = Date.now();
    this.addSystemChatMessage('Host updated the match settings.');
  }

  public kickPlayer(requesterId: string, targetPlayerId: string): GamePlayer {
    if (this.hostId !== requesterId) {
      throw new Error(ERROR_MESSAGES.NOT_AUTHORIZED);
    }
    if (targetPlayerId === requesterId) {
      throw new Error('You cannot kick yourself.');
    }

    const target = this.players.get(targetPlayerId);
    if (!target) {
      throw new Error('Target player not found in room.');
    }

    this.players.delete(targetPlayerId);
    this.updatedAt = Date.now();

    this.addSystemChatMessage(`${target.displayName} was removed by the host.`);
    return target;
  }

  public canStartGame(): { allowed: boolean; reason?: string } {
    if (this.status !== 'LOBBY') {
      return { allowed: false, reason: ERROR_MESSAGES.GAME_ALREADY_STARTED };
    }

    if (this.players.size < MIN_PLAYERS) {
      return { allowed: false, reason: ERROR_MESSAGES.INSUFFICIENT_PLAYERS };
    }

    // Check all ready
    for (const player of this.players.values()) {
      if (!player.ready) {
        return {
          allowed: false,
          reason: `${player.displayName} is not ready yet. All players must be ready.`,
        };
      }
    }

    // If teams enabled, check team distribution
    if (this.settings.rules.teamsEnabled) {
      const teamMap: Record<string, string | null | undefined> = {};
      for (const [id, p] of this.players.entries()) {
        teamMap[id] = p.teamId;
      }
      const teamCheck = TeamManager.validateTeamAssignments(teamMap, this.players.size);
      if (!teamCheck.valid) {
        return { allowed: false, reason: teamCheck.message || 'Team assignments are invalid.' };
      }
    }

    return { allowed: true };
  }

  public startGame(requesterId: string): void {
    if (this.hostId !== requesterId) {
      throw new Error(ERROR_MESSAGES.NOT_AUTHORIZED);
    }

    const check = this.canStartGame();
    if (!check.allowed) {
      throw new Error(check.reason || 'Cannot start game.');
    }

    this.status = 'IN_GAME';
    
    // Initialize Game Engine
    const playersArray = Array.from(this.players.values());
    this.gameEngine = new GameLoop(this.roomCode, playersArray, this.settings);
    
    this.updatedAt = Date.now();
    this.addSystemChatMessage('Match started! Loading board...');
  }

  public addChatMessage(senderId: string, text: string): ChatMessage {
    if (!this.settings.rules.chatEnabled) {
      throw new Error('Chat is disabled in this room.');
    }

    const player = this.players.get(senderId);
    if (!player) {
      throw new Error('Player not found in room.');
    }

    // Rate limiting: 1 message per 500ms
    const now = Date.now();
    const lastTime = this.lastMessageTimestamps.get(senderId) || 0;
    if (now - lastTime < 500) {
      throw new Error(ERROR_MESSAGES.RATE_LIMITED);
    }
    this.lastMessageTimestamps.set(senderId, now);

    const message: ChatMessage = {
      id: uuidv4(),
      senderId: player.id,
      senderName: player.displayName,
      senderColor: player.color,
      text: text.trim(),
      timestamp: now,
      isSystem: false,
    };

    this.chatMessages.push(message);
    if (this.chatMessages.length > CONFIG.MAX_CHAT_HISTORY) {
      this.chatMessages.shift();
    }

    return message;
  }

  public addSystemChatMessage(text: string): ChatMessage {
    const message: ChatMessage = {
      id: uuidv4(),
      senderId: 'system',
      senderName: 'ADIPOLY',
      text,
      timestamp: Date.now(),
      isSystem: true,
    };

    this.chatMessages.push(message);
    if (this.chatMessages.length > CONFIG.MAX_CHAT_HISTORY) {
      this.chatMessages.shift();
    }

    return message;
  }

  public getChatHistory(): ChatMessage[] {
    return [...this.chatMessages];
  }

  public getState(): RoomState {
    const playersList: PlayerSummary[] = Array.from(this.players.values()).map((p) =>
      p.toSummary()
    );

    return {
      roomCode: this.roomCode,
      hostId: this.hostId,
      status: this.status,
      players: playersList,
      settings: JSON.parse(JSON.stringify(this.settings)),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      gameState: this.gameEngine ? {
        gameId: this.gameEngine.state.gameId,
        phase: this.gameEngine.state.phase,
        turnNumber: this.gameEngine.state.turnNumber,
        activePlayerIndex: this.gameEngine.state.activePlayerIndex,
        properties: Object.fromEntries(
          Object.entries(this.gameEngine.state.properties).map(([k, v]) => [k, v.toJSON()])
        ),
      } : undefined,
    };
  }
}
