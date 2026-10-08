import type { PropertyData } from '@adipoly/shared';

export class Property {
  public id: string;
  public name: string;
  public group: string;
  public purchasePrice: number;
  public baseRent: number;
  public rentTiers: number[];
  public mortgageValue: number;
  public mortgaged: boolean;
  public mortgageStartedTurn?: number;
  public mortgageExpiryTurn?: number;
  public ownerId?: string;
  public developmentLevel: number;

  constructor(data: PropertyData) {
    this.id = data.id;
    this.name = data.name;
    this.group = data.group;
    this.purchasePrice = data.purchasePrice;
    this.baseRent = data.baseRent;
    this.rentTiers = data.rentTiers;
    this.mortgageValue = data.mortgageValue;
    this.mortgaged = data.mortgaged;
    this.mortgageStartedTurn = data.mortgageStartedTurn;
    this.mortgageExpiryTurn = data.mortgageExpiryTurn;
    this.ownerId = data.ownerId;
    this.developmentLevel = data.developmentLevel;
  }

  public isOwned(): boolean {
    return Boolean(this.ownerId);
  }

  public isOwnedBy(playerId: string): boolean {
    return this.ownerId === playerId;
  }

  public toJSON(): PropertyData {
    return {
      id: this.id,
      name: this.name,
      group: this.group,
      purchasePrice: this.purchasePrice,
      baseRent: this.baseRent,
      rentTiers: [...this.rentTiers],
      mortgageValue: this.mortgageValue,
      mortgaged: this.mortgaged,
      mortgageStartedTurn: this.mortgageStartedTurn,
      mortgageExpiryTurn: this.mortgageExpiryTurn,
      ownerId: this.ownerId,
      developmentLevel: this.developmentLevel,
    };
  }
}
