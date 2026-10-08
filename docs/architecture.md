# ADIPOLY — System Architecture

## Overview

ADIPOLY is an original browser-based multiplayer business and property strategy game. The architecture is engineered around the principle of **Authoritative Server Governance**: the client never decides authoritative game state (money, dice rolls, positions, ownership, auctions, trades, bankruptcy). The client sends intent actions, and the server validates and dispatches state updates via WebSockets.

```
+-------------------------------------------------------------+
|                      Client Layer                           |
|       React 19 + TypeScript + Zustand + Tailwind CSS        |
+-------------------------------------------------------------+
                              ▲
                              │ Socket.IO / WebSocket Actions
                              ▼
+-------------------------------------------------------------+
|                      Server Layer                           |
|            Node.js + Express + Socket.IO Server             |
|   - SessionService (Reconnect Tokens)                       |
|   - RoomManager (5-Char Random Rooms)                       |
|   - Authoritative GameRoom (State & Perms)                  |
+-------------------------------------------------------------+
                              │
                              ▼
+-------------------------------------------------------------+
|                  authoritative Core Engine                  |
|                   @adipoly/game-engine                      |
|   - Board & Space Models (Original 32 sectors)              |
|   - Player & Property Models                                |
|   - Turn State Machine                                      |
|   - Chaos Modifier Registry                                 |
|   - Team Balancer                                           |
+-------------------------------------------------------------+
```

## Monorepo Layout

- `packages/shared`:
  - Strong contracts shared between client and server.
  - Zod schemas for room actions, display names, match settings, and chat.
  - TypeScript interfaces for all network messages and game state.
  - Constants (starting capital presets, room code alphabet, error codes).
- `packages/game-engine`:
  - Authoritative game logic, independent of any UI framework.
  - Original 32-space board definition: tech hubs, incubator spaces, regulatory detention, venture dividends, and public auctions.
  - Chaos Modifier registry and extensible modifier classes.
  - Turn transition state machine.
- `apps/server`:
  - Express HTTP server + Socket.IO real-time server.
  - In-memory `RoomManager` managing active rooms and socket mappings.
  - `SessionService` providing stateless reconnection security via `sessionToken`.
  - Rate limiting on messages and action guards.
- `apps/web`:
  - Vite + React 19 application.
  - Zustand game store with `localStorage` session caching.
  - Responsive, high-contrast UI tailored for desktop, tablet, and mobile browsers.

## Reconnection Design

1. When a player creates or joins a room, the server issues a unique `sessionToken` (e.g. `ses_uuid`).
2. The browser stores `{ roomCode, sessionToken, playerId, displayName }` in `localStorage`.
3. If the browser refreshes, disconnects, or closes temporarily:
   - On reconnect, the socket emits `session:reconnect` with the stored token.
   - The server validates the session token against the room's registered players.
   - The server re-links the player to the new `socket.id`, sets `connected = true`, and emits fresh `room:state`.
   - No duplicate player is created; game continuity is maintained.
