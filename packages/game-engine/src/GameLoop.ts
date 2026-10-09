import { v4 as uuidv4 } from 'uuid';
import { GamePlayer } from './models/Player.js';
import { Property } from './models/Property.js';
import { AuthoritativeGameState } from './models/GameState.js';
import { ADIPOLY_BOARD_SPACES } from './board/spaces.js';
import type { MatchSettings } from '@adipoly/shared';

export class GameLoop {
  public state: AuthoritativeGameState;
  
  constructor(roomCode: string, players: GamePlayer[], settings: MatchSettings) {
    const properties: Record<string, Property> = {};
    
    ADIPOLY_BOARD_SPACES.forEach((space) => {
      if (space.type === 'PROPERTY' && space.price && space.baseRent) {
        properties[space.id] = new Property({
          id: space.id,
          name: space.name,
          group: space.group || 'Unknown',
          purchasePrice: space.price,
          baseRent: space.baseRent,
          rentTiers: [space.baseRent * 2, space.baseRent * 3, space.baseRent * 5],
          mortgageValue: Math.floor(space.price / 2),
          mortgaged: false,
          developmentLevel: 0
        });
      }
    });

    this.state = {
      gameId: uuidv4(),
      roomCode,
      phase: 'ROLLING',
      turnNumber: 1,
      roundNumber: 1,
      activePlayerIndex: 0,
      players: players,
      properties,
      settings,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
  }

  public getActivePlayer(): GamePlayer {
    return this.state.players[this.state.activePlayerIndex];
  }

  public getPlayer(playerId: string): GamePlayer | undefined {
    return this.state.players.find(p => p.id === playerId);
  }

  public rollDice(playerId: string): { success: boolean, dice?: [number, number], message?: string } {
    if (this.state.phase !== 'ROLLING') {
      return { success: false, message: 'Not in rolling phase.' };
    }
    const activePlayer = this.getActivePlayer();
    if (activePlayer.id !== playerId) {
      return { success: false, message: 'Not your turn.' };
    }

    const die1 = Math.floor(Math.random() * 6) + 1;
    const die2 = Math.floor(Math.random() * 6) + 1;
    const total = die1 + die2;

    this.movePlayer(activePlayer, total);
    
    return { success: true, dice: [die1, die2], message: `Rolled a ${total}` };
  }

  private movePlayer(player: GamePlayer, spaces: number) {
    const previousPosition = player.position;
    player.position = (player.position + spaces) % ADIPOLY_BOARD_SPACES.length;

    // Pass Go
    if (player.position < previousPosition) {
      player.money += 200;
    }

    this.resolveLanding(player);
  }

  private resolveLanding(player: GamePlayer) {
    const space = ADIPOLY_BOARD_SPACES[player.position];
    
    if (space.type === 'PROPERTY') {
      const property = this.state.properties[space.id];
      if (!property.isOwned()) {
        this.state.phase = 'ACTION'; // Waiting for buy decision
        return;
      } else if (!property.isOwnedBy(player.id) && !property.mortgaged) {
        // Pay rent
        const owner = this.getPlayer(property.ownerId!);
        if (owner) {
          const rent = property.baseRent;
          player.money -= rent;
          owner.money += rent;
        }
      }
    }
    
    this.state.phase = 'END_TURN';
  }

  public buyProperty(playerId: string): { success: boolean, message?: string } {
    if (this.state.phase !== 'ACTION') return { success: false, message: 'Cannot buy right now.' };
    
    const player = this.getPlayer(playerId);
    if (!player || this.getActivePlayer().id !== playerId) return { success: false, message: 'Not your turn.' };
    
    const space = ADIPOLY_BOARD_SPACES[player.position];
    if (space.type !== 'PROPERTY') return { success: false, message: 'Not a property.' };
    
    const property = this.state.properties[space.id];
    if (property.isOwned()) return { success: false, message: 'Already owned.' };
    
    if (player.money < property.purchasePrice) return { success: false, message: 'Not enough money.' };
    
    player.money -= property.purchasePrice;
    property.ownerId = player.id;
    player.ownedPropertyIds.push(property.id);
    
    this.state.phase = 'END_TURN';
    return { success: true, message: `Bought ${property.name}!` };
  }

  public endTurn(playerId: string): { success: boolean, message?: string } {
    if (this.state.phase !== 'END_TURN' && this.state.phase !== 'ACTION') {
      return { success: false, message: 'Cannot end turn yet.' };
    }
    
    const activePlayer = this.getActivePlayer();
    if (activePlayer.id !== playerId) {
      return { success: false, message: 'Not your turn.' };
    }

    this.state.activePlayerIndex = (this.state.activePlayerIndex + 1) % this.state.players.length;
    this.state.phase = 'ROLLING';
    this.state.turnNumber++;
    this.state.updatedAt = Date.now();
    
    return { success: true, message: 'Turn ended.' };
  }
}
