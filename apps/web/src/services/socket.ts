import { io, Socket } from 'socket.io-client';
import type { ClientToServerEvents, ServerToClientEvents } from '@adipoly/shared';

const SERVER_URL =
  import.meta.env.VITE_SERVER_URL ||
  (window.location.port === '5173' ? 'http://localhost:4000' : window.location.origin);

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(SERVER_URL, {
  autoConnect: true,
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
});
