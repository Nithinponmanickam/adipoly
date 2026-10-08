# ADIPOLY — Development Roadmap

## Phase 1: Foundation (COMPLETED)
- [x] Monorepo architecture (`apps/web`, `apps/server`, `packages/shared`, `packages/game-engine`)
- [x] Authoritative server foundation with Socket.IO & Express
- [x] Unambiguous 5-character random room codes (e.g. `A7K9Q`)
- [x] Zero-login multiplayer joining and hosting
- [x] Reconnection engine with local session caching (`sessionToken`)
- [x] Lobby roster, ready/unready system, and host migration
- [x] Real-time lobby chat with rate-limiting
- [x] Configurable Match Settings (Economy, Rupee presets, Rules, Detention, Chaos, Teams, Speed)
- [x] Responsive dark modern UI for Desktop, Tablet, and Mobile
- [x] Vitest automated test suite & strict TypeScript

## Phase 2: Core Game (NEXT)
- [ ] Visual Interactive Board Component with original 32-space layout
- [ ] Server-authoritative 2d6 dice engine
- [ ] Smooth token movement animations around board
- [ ] Landing resolution & turn phase state machine (WAITING -> ROLLING -> MOVING -> RESOLVING -> ACTION)
- [ ] Property acquisition UI and server-side balance deductions
- [ ] Automatic rent assessment & property cluster calculation

## Phase 3: Economy
- [ ] Mortgage management panel with turn counter
- [ ] Auto-expiration daemon for mortgages
- [ ] Real-time public auction room with live bidding clock
- [ ] Bankruptcy handling, asset liquidation, and elimination

## Phase 4: Social Strategy
- [ ] Bilateral asset & cash trading interface
- [ ] Advisory Trade Fairness Analyzer (0-100 equity rating)
- [ ] Active team mode features (shared objectives, 2v2/3v3 synergies)

## Phase 5: Events & Chaos
- [ ] Original ADIPOLY Market Pulse card events deck
- [ ] 13 Chaos Modifiers runtime activation
- [ ] Regulatory Detention interactive bailout and escape rolls

## Phase 6: Polish & Mobile Optimization
- [ ] Sound architecture & audio feedback
- [ ] Micro-animations for dice rolls and acquisitions
- [ ] Match statistics, leaderboard, and victory celebration screen
