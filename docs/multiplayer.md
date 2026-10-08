# ADIPOLY — Real-Time Multiplayer Protocol

## Network Protocol

All real-time communication is handled through Socket.IO with JSON payload validation using Zod schemas defined in `@adipoly/shared`.

## Client-to-Server Events

| Event | Payload | Description |
|---|---|---|
| `room:create` | `{ displayName: string, settings?: MatchSettings }` | Creates a new room with a random 5-character code. Returns `{ roomCode, sessionToken, playerId }`. |
| `room:join` | `{ roomCode: string, displayName: string }` | Joins an existing room. Returns `{ roomCode, sessionToken, playerId }`. |
| `session:reconnect` | `{ roomCode: string, sessionToken: string }` | Reconnects to an active room with stored session token. |
| `player:ready` | `{ ready: boolean }` | Toggles player ready state. |
| `player:setTeam` | `{ teamId: string \| null }` | Assigns player to a team when Team Mode is enabled. |
| `room:updateSettings` | `{ settings: Partial<MatchSettings> }` | Host-only event to update match configuration. |
| `room:kickPlayer` | `{ targetPlayerId: string }` | Host-only event to remove a player from the lobby. |
| `room:leave` | `void` | Gracefully leaves the active room. |
| `game:start` | `void` | Host-only event to start the match (validates min players and ready state). |
| `chat:send` | `{ text: string }` | Dispatches a lobby or in-game chat message (rate-limited to 1 msg / 500ms). |

## Server-to-Client Events

| Event | Payload | Description |
|---|---|---|
| `room:state` | `RoomState` | Full authoritative room snapshot broadcast after every mutation. |
| `chat:message` | `ChatMessage` | Broadcast chat message with sender metadata and timestamps. |
| `player:kicked` | `{ reason: string }` | Direct notification sent to a kicked player. |
| `game:starting` | `{ countdown: number }` | Pre-match countdown trigger. |
| `error:notification` | `{ message: string, code?: string }` | User-friendly error message notification. |

## Room Code Generation

- Room codes are 5 characters long.
- Generated from the alphabet `ABCDEFGHJKLMNPQRSTUVWXYZ23456789`.
- Ambiguous characters (`0`, `O`, `1`, `I`) are omitted to prevent typing errors.
- Case-insensitive on input, normalized to uppercase.
