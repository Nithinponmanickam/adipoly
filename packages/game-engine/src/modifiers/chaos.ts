import type { ChaosModifierId } from '@adipoly/shared';
import type { IChaosModifier, ModifierContext } from './types.js';

export class DoubleRentModifier implements IChaosModifier {
  public readonly id = 'DOUBLE_RENT' as const;
  public readonly name = 'Double Rent';
  public readonly description = 'All property rent demands across the board are doubled.';
  public readonly category = 'economic' as const;

  public onRentCalculation(_context: ModifierContext, baseRent: number): number {
    return baseRent * 2;
  }
}

export class ReverseDirectionModifier implements IChaosModifier {
  public readonly id = 'REVERSE_DIRECTION' as const;
  public readonly name = 'Reverse Direction';
  public readonly description = 'Players travel counter-clockwise around the board.';
  public readonly category = 'movement' as const;
}

export class RentSpikeModifier implements IChaosModifier {
  public readonly id = 'RENT_SPIKE' as const;
  public readonly name = 'Rent Spike';
  public readonly description = 'Landing on un-mortgaged properties applies surprise multipliers.';
  public readonly category = 'economic' as const;

  public onRentCalculation(_context: ModifierContext, baseRent: number): number {
    return Math.round(baseRent * 1.5);
  }
}

export class ChaosModifierRegistry {
  private static modifiers: Map<ChaosModifierId, IChaosModifier> = new Map();

  static {
    ChaosModifierRegistry.register(new DoubleRentModifier());
    ChaosModifierRegistry.register(new ReverseDirectionModifier());
    ChaosModifierRegistry.register(new RentSpikeModifier());
  }

  public static register(modifier: IChaosModifier): void {
    this.modifiers.set(modifier.id, modifier);
  }

  public static get(id: ChaosModifierId): IChaosModifier | undefined {
    return this.modifiers.get(id);
  }

  public static getAll(): IChaosModifier[] {
    return Array.from(this.modifiers.values());
  }
}
