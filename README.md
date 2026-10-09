# ADIPOLY

**ADIPOLY** is an original browser-based multiplayer business and property strategy game. Inspired by the general concept of property-trading board games, ADIPOLY features its own original mechanics, visual identity, tech-industry sectors, live public auctions, mortgage expiration rules, trade fairness analyzer, and an optional 13-modifier Chaos Mode.

---

## 🛠️ Technology Stack

- **Monorepo:** npm workspaces
- **Frontend (`apps/web`):** React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, Zustand, Lucide Icons
- **Backend (`apps/server`):** Node.js, TypeScript, Express, Socket.IO
- **Game Engine (`packages/game-engine`):** Authoritative rules, board definitions, turn state machine, modifier registry (Zero UI dependencies)
- **Shared (`packages/shared`):** Shared types, Zod schemas, constants, error codes
- **Testing:** Vitest

---

## 📁 Project Structure

```
adipoly/
├── apps/
│   ├── web/                     # React 19 + Vite frontend
│   │   ├── src/
│   │   │   ├── components/      # UI components (Home, Lobby, Settings, Chat)
│   │   │   ├── services/        # Socket.IO client singleton
│   │   │   ├── store/           # Zustand state store with session persistence
│   │   │   ├── App.tsx
│   │   │   └── main.tsx
│   │   └── package.json
│   └── server/                  # Authoritative Node.js + Express + Socket.IO server
│       ├── src/
│       │   ├── rooms/           # RoomManager, GameRoom state & host controls
│       │   ├── services/        # SessionService for seamless reconnection
│       │   ├── socket/          # Socket.IO payload validation & dispatch
│       │   └── app.ts
│       ├── tests/               # Vitest suite (rooms, lobby, reconnection)
│       └── package.json
├── packages/
│   ├── shared/                  # Contracts, Zod schemas, error codes, defaults
│   └── game-engine/             # Board layout, property & player models, turn machine
├── docs/
│   ├── architecture.md          # Full architectural specification
│   ├── game-rules.md            # Original 32-space layout & gameplay rules
│   ├── multiplayer.md           # Socket protocol & event catalog
│   └── roadmap.md               # 6-phase roadmap
├── package.json                 # Monorepo workspaces config
└── tsconfig.base.json           # Root TypeScript configuration
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js**: v18.0.0 or later (v20+ / v22+ / v24+ recommended)
- **npm**: v9.0.0 or later

### Install Dependencies
From the repository root:
```bash
npm install
```

---

## 💻 Development Commands

### Run Everything Concurrently (Server + Web)
```bash
npm run dev
```
- **Backend server:** `http://localhost:4000` (WebSocket active)
- **Frontend web app:** `http://localhost:5173` (Vite dev server)

### Run Individually
```bash
# Start backend server only
npm run dev:server

# Start frontend web app only
npm run dev:web
```

### Build All Workspaces
```bash
npm run build
```

### Run Automated Tests
```bash
npm run test
```

### Run Type Checking
```bash
npm run typecheck
```

---

## 🧪 Local Multiplayer Testing Walkthrough

Follow these simple steps to verify multiplayer synchronization on your local machine:

1. **Launch the dev servers:**
   ```bash
   npm run dev
   ```
2. **Open Window 1 (Host Player):**
   - Navigate to `http://localhost:5173`.
   - Click **CREATE GAME**.
   - Enter your name: `Riya`.
   - Customize starting money (e.g. ₹1,500) or toggle Chaos Mode.
   - Click **CREATE ROOM**.
   - You will enter the lobby. Notice the generated 5-character room code (e.g. `A7K9Q`).
   - Click the **Copy Code** button.

3. **Open Window 2 (Second Player):**
   - Open a private/incognito window or a second browser tab at `http://localhost:5173`.
   - Click **JOIN GAME**.
   - Paste the room code `A7K9Q`.
   - Enter your name: `Arun`.
   - Click **ENTER LOBBY**.

4. **Verify Real-Time Synchronization:**
   - Both windows will immediately show both `Riya (HOST)` and `Arun`.
   - In Window 2, click **SET READY**. Both windows update instantaneously to show Arun is `READY`.
   - Type a message in the Lobby Chat from either window; watch it instantly appear in both windows with timestamps and player avatars.
   - Host controls: In Window 1, click **Edit Settings**, adjust options, and save. The lobby badges update on both screens.
   - Disconnect / Reconnect test: Refresh Window 2. The player re-attaches to the room without duplicate entries using the secure session token stored in browser storage.

---

## ⚙️ Environment Variables

The application runs with zero configuration out of the box. Optional environment variables:

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `4000` | HTTP & WebSocket server port |
| `CORS_ORIGIN` | `*` | Allowed CORS origins for the Socket server |
| `VITE_SERVER_URL` | Auto-detect / proxy | Target backend URL for client Socket connection |

---

## 🗺️ What's Next: Phase 2

Phase 1 established the complete monorepo foundation, authoritative room management, zero-login identity, reconnection tokens, match settings, and lobby chat.

**Phase 2** will introduce the interactive graphical board, 2d6 dice physics, player tokens, property purchases, and rent calculation.

# Trigger deployment
