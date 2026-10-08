import { create } from 'zustand';
import type { ChatMessage, MatchSettings, PlayerSummary, RoomState } from '@adipoly/shared';
import { socket } from '../services/socket.js';

const STORAGE_KEY = 'adipoly_session_v1';

interface StoredSession {
  roomCode: string;
  sessionToken: string;
  playerId: string;
  displayName: string;
}

export interface ToastState {
  id: string;
  message: string;
  type: 'info' | 'error' | 'success';
}

interface GameStore {
  // Connection & Room
  connected: boolean;
  roomState: RoomState | null;
  currentPlayerId: string | null;
  sessionToken: string | null;
  displayName: string;
  chatMessages: ChatMessage[];

  // UI state
  activeModal: 'CREATE' | 'JOIN' | 'SETTINGS' | 'HOW_TO_PLAY' | null;
  toast: ToastState | null;
  isLoading: boolean;
  isStarting: boolean;

  // Actions
  setConnected: (connected: boolean) => void;
  setRoomState: (state: RoomState | null) => void;
  addChatMessage: (message: ChatMessage) => void;
  setActiveModal: (modal: 'CREATE' | 'JOIN' | 'SETTINGS' | 'HOW_TO_PLAY' | null) => void;
  showToast: (message: string, type?: 'info' | 'error' | 'success') => void;
  clearToast: () => void;
  setLoading: (loading: boolean) => void;
  setIsStarting: (starting: boolean) => void;

  // Session & Multiplayer Actions
  saveSession: (data: StoredSession) => void;
  clearSession: () => void;
  initSession: () => void;

  createRoom: (displayName: string, settings?: Partial<MatchSettings>) => Promise<boolean>;
  joinRoom: (roomCode: string, displayName: string) => Promise<boolean>;
  reconnect: (roomCode: string, sessionToken: string) => Promise<boolean>;
  toggleReady: (ready: boolean) => void;
  setTeam: (teamId: string | null) => void;
  updateSettings: (settings: Partial<MatchSettings>) => void;
  kickPlayer: (targetPlayerId: string) => void;
  startGame: () => void;
  sendChatMessage: (text: string) => void;
  leaveRoom: () => void;

  // Computed helper
  getCurrentPlayer: () => PlayerSummary | undefined;
  isHost: () => boolean;
}

export const useGameStore = create<GameStore>((set, get) => ({
  connected: false,
  roomState: null,
  currentPlayerId: null,
  sessionToken: null,
  displayName: '',
  chatMessages: [],

  activeModal: null,
  toast: null,
  isLoading: false,
  isStarting: false,

  setConnected: (connected) => set({ connected }),
  setRoomState: (roomState) => set({ roomState }),
  addChatMessage: (message) =>
    set((state) => {
      // Avoid duplicates
      if (state.chatMessages.some((m) => m.id === message.id)) {
        return state;
      }
      return { chatMessages: [...state.chatMessages, message] };
    }),

  setActiveModal: (activeModal) => set({ activeModal }),

  showToast: (message, type = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    set({ toast: { id, message, type } });
  },

  clearToast: () => set({ toast: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setIsStarting: (isStarting) => set({ isStarting }),

  saveSession: (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    set({
      sessionToken: data.sessionToken,
      currentPlayerId: data.playerId,
      displayName: data.displayName,
    });
  },

  clearSession: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({
      roomState: null,
      sessionToken: null,
      currentPlayerId: null,
      chatMessages: [],
    });
  },

  initSession: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data: StoredSession = JSON.parse(stored);
        if (data.roomCode && data.sessionToken) {
          get().reconnect(data.roomCode, data.sessionToken);
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  },

  createRoom: (displayName, settings) => {
    return new Promise((resolve) => {
      set({ isLoading: true });
      socket.emit('room:create', { displayName, settings }, (response) => {
        set({ isLoading: false });
        if (response.success && response.data) {
          const { roomCode, sessionToken, playerId } = response.data;
          get().saveSession({ roomCode, sessionToken, playerId, displayName });
          set({ activeModal: null });
          get().showToast(`Room ${roomCode} created!`, 'success');
          resolve(true);
        } else {
          get().showToast(response.error?.message || 'Failed to create room', 'error');
          resolve(false);
        }
      });
    });
  },

  joinRoom: (roomCode, displayName) => {
    return new Promise((resolve) => {
      set({ isLoading: true });
      socket.emit('room:join', { roomCode, displayName }, (response) => {
        set({ isLoading: false });
        if (response.success && response.data) {
          const { roomCode: code, sessionToken, playerId } = response.data;
          get().saveSession({ roomCode: code, sessionToken, playerId, displayName });
          set({ activeModal: null });
          get().showToast(`Joined room ${code}`, 'success');
          resolve(true);
        } else {
          get().showToast(response.error?.message || 'Failed to join room', 'error');
          resolve(false);
        }
      });
    });
  },

  reconnect: (roomCode, sessionToken) => {
    return new Promise((resolve) => {
      socket.emit('session:reconnect', { roomCode, sessionToken }, (response) => {
        if (response.success && response.data) {
          const { player, room } = response.data;
          set({
            roomState: room,
            currentPlayerId: player.id,
            displayName: player.displayName,
            sessionToken,
          });
          get().showToast(`Reconnected to room ${roomCode}`, 'success');
          resolve(true);
        } else {
          get().clearSession();
          resolve(false);
        }
      });
    });
  },

  toggleReady: (ready) => {
    socket.emit('player:ready', { ready });
  },

  setTeam: (teamId) => {
    socket.emit('player:setTeam', { teamId });
  },

  updateSettings: (settings) => {
    socket.emit('room:updateSettings', { settings });
  },

  kickPlayer: (targetPlayerId) => {
    socket.emit('room:kickPlayer', { targetPlayerId });
  },

  startGame: () => {
    socket.emit('game:start');
  },

  sendChatMessage: (text) => {
    socket.emit('chat:send', { text });
  },

  leaveRoom: () => {
    socket.emit('room:leave');
    get().clearSession();
    get().showToast('Left the room', 'info');
  },

  getCurrentPlayer: () => {
    const { roomState, currentPlayerId } = get();
    if (!roomState || !currentPlayerId) return undefined;
    return roomState.players.find((p) => p.id === currentPlayerId);
  },

  isHost: () => {
    const player = get().getCurrentPlayer();
    return Boolean(player?.isHost);
  },
}));
