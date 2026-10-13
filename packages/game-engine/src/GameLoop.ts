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
    if (this.state.players.length === 0) {
      throw new Error('No players in game');
    }
    if (this.state.activePlayerIndex >= this.state.players.length) {
      this.state.activePlayerIndex = 0;
    }
    return this.state.players[this.state.activePlayerIndex];
  }

  public getPlayer(playerId: string): GamePlayer | undefined {
    return this.state.players.find((p) => p.id === playerId);
  }

  public rollDice(playerId: string): { success: boolean; dice?: [number, number]; message?: string } {
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

    this.state.lastDiceRoll = [die1, die2];
    const moveResult = this.movePlayer(activePlayer, total);

    return {
      success: true,
      dice: [die1, die2],
      message: `Rolled ${die1} + ${die2} = ${total}. ${moveResult.message}`,
    };
  }

  private movePlayer(player: GamePlayer, spaces: number): { message: string } {
    const previousPosition = player.position;
    const rawNewPosition = previousPosition + spaces;
    const passedGo = rawNewPosition >= ADIPOLY_BOARD_SPACES.length;
    player.position = rawNewPosition % ADIPOLY_BOARD_SPACES.length;

    let passGoMsg = '';
    // Passing or landing on Genesis Square (Go) grants ₹200 bonus
    if (passedGo) {
      player.money += 200;
      passGoMsg = ' Passed Genesis Square (+₹200).';
    }

    const landingResult = this.resolveLanding(player);
    return {
      message: `${passGoMsg} ${landingResult.message}`.trim(),
    };
  }

  private resolveLanding(player: GamePlayer): { message: string } {
    const space = ADIPOLY_BOARD_SPACES[player.position];
    this.state.updatedAt = Date.now();

    if (space.type === 'PROPERTY') {
      const property = this.state.properties[space.id];
      if (!property) {
        this.state.phase = 'END_TURN';
        return { message: `Landed on ${space.name}.` };
      }

      if (!property.isOwned()) {
        this.state.phase = 'ACTION'; // Waiting for buy decision or end turn
        return {
          message: `Landed on unowned ${property.name} (Purchase: ₹${property.purchasePrice}).`,
        };
      } else if (!property.isOwnedBy(player.id) && !property.mortgaged) {
        // Calculate rent (apply chaos modifiers if active)
        let rent = property.baseRent;
        const chaos = this.state.settings.chaos;
        if (chaos?.chaosModeEnabled && chaos.selectedModifiers) {
          if (chaos.selectedModifiers.includes('DOUBLE_RENT')) {
            rent *= 2;
          } else if (chaos.selectedModifiers.includes('RENT_SPIKE')) {
            rent = Math.round(rent * 1.5);
          }
        }

        const owner = this.getPlayer(property.ownerId!);
        const rentPaid = Math.min(player.money, rent);
        player.money -= rentPaid;
        if (owner) {
          owner.money += rentPaid;
        }

        this.state.phase = 'END_TURN';
        return {
          message: `Landed on ${property.name} and paid ₹${rentPaid} rent to ${owner?.displayName || 'owner'}.`,
        };
      } else {
        this.state.phase = 'END_TURN';
        return { message: `Landed on ${property.name} (Owned).` };
      }
    }

    // Special Spaces
    if (space.index === 24) {
      // Regulatory Raid -> Move to Regulatory Detention (index 8)
      player.position = 8;
      let dividendMsg = '';
      if (this.state.settings.jail.jailEnabled) {
        const dividend = Math.round(
          player.money * (this.state.settings.jail.jailRewardPercent / 100)
        );
        player.money += dividend;
        dividendMsg = ` Received ₹${dividend} detention dividend.`;
      }
      this.state.phase = 'END_TURN';
      return { message: `Regulatory Raid! Transferred to Regulatory Detention.${dividendMsg}` };
    }

    if (space.index === 4) {
      // Tax Audit Bureau
      const tax = 100;
      player.money = Math.max(0, player.money - tax);
      this.state.phase = 'END_TURN';
      return { message: `Tax Audit! Paid ₹${tax} regulatory fee.` };
    }

    if (space.index === 30) {
      // High Risk Hedge
      const hedgeRoll = Math.floor(Math.random() * 6) + 1;
      if (hedgeRoll >= 4) {
        player.money += 200;
        this.state.phase = 'END_TURN';
        return { message: `High Risk Hedge rolled ${hedgeRoll}: Gained ₹200!` };
      } else {
        player.money = Math.max(0, player.money - 100);
        this.state.phase = 'END_TURN';
        return { message: `High Risk Hedge rolled ${hedgeRoll}: Lost ₹100.` };
      }
    }

    if (space.type === 'EVENT') {
      // Market Pulse
      const isDividend = Math.random() > 0.4;
      if (isDividend) {
        player.money += 75;
        this.state.phase = 'END_TURN';
        return { message: `Market Pulse: Received quarterly innovation dividend of ₹75!` };
      } else {
        player.money = Math.max(0, player.money - 50);
        this.state.phase = 'END_TURN';
        return { message: `Market Pulse: Paid ₹50 market infrastructure fee.` };
      }
    }

    if (space.type === 'START') {
      this.state.phase = 'END_TURN';
      return { message: `Landed directly on Genesis Square!` };
    }

    this.state.phase = 'END_TURN';
    return { message: `Landed on ${space.name}.` };
  }

  public buyProperty(playerId: string): { success: boolean; message?: string } {
    if (this.state.phase !== 'ACTION') return { success: false, message: 'Cannot buy right now.' };

    const player = this.getPlayer(playerId);
    if (!player || this.getActivePlayer().id !== playerId) return { success: false, message: 'Not your turn.' };

    const space = ADIPOLY_BOARD_SPACES[player.position];
    if (space.type !== 'PROPERTY') return { success: false, message: 'Not a property.' };

    const property = this.state.properties[space.id];
    if (!property) return { success: false, message: 'Property not found.' };
    if (property.isOwned()) return { success: false, message: 'Already owned.' };

    if (player.money < property.purchasePrice) return { success: false, message: 'Not enough money.' };

    player.money -= property.purchasePrice;
    property.ownerId = player.id;
    if (!player.ownedPropertyIds.includes(property.id)) {
      player.ownedPropertyIds.push(property.id);
    }

    this.state.phase = 'END_TURN';
    this.state.updatedAt = Date.now();
    return { success: true, message: `Purchased ${property.name} for ₹${property.purchasePrice}!` };
  }

  public endTurn(playerId: string): { success: boolean; message?: string } {
    if (this.state.phase !== 'END_TURN' && this.state.phase !== 'ACTION') {
      return { success: false, message: 'Cannot end turn yet.' };
    }

    const activePlayer = this.getActivePlayer();
    if (activePlayer.id !== playerId) {
      return { success: false, message: 'Not your turn.' };
    }

    // Check for game over condition (all but 1 eliminated)
    const solventPlayers = this.state.players.filter((p) => p.money > 0 || p.ownedPropertyIds.length > 0);
    if (this.state.players.length > 1 && solventPlayers.length === 1) {
      this.state.winnerPlayerId = solventPlayers[0].id;
      this.state.phase = 'GAME_OVER';
      this.state.updatedAt = Date.now();
      return { success: true, message: `${solventPlayers[0].displayName} has won the match!` };
    }

    // Skip eliminated players with no cash and no properties
    let nextIndex = (this.state.activePlayerIndex + 1) % this.state.players.length;
    let attempts = 0;
    while (
      attempts < this.state.players.length &&
      this.state.players[nextIndex].money <= 0 &&
      this.state.players[nextIndex].ownedPropertyIds.length === 0
    ) {
      nextIndex = (nextIndex + 1) % this.state.players.length;
      attempts++;
    }
    this.state.activePlayerIndex = nextIndex;
    this.state.phase = 'ROLLING';
    this.state.turnNumber++;
    this.state.updatedAt = Date.now();

    const nextPlayer = this.getActivePlayer();
    return { success: true, message: `Turn handed over to ${nextPlayer.displayName}.` };
  }
}
