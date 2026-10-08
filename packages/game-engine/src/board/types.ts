import type { SpaceType } from '@adipoly/shared';

export interface BoardSpaceDefinition {
  id: string;
  index: number;
  name: string;
  type: SpaceType;
  group?: string;
  groupColor?: string;
  price?: number;
  baseRent?: number;
  description?: string;
}

export interface BoardLayout {
  totalSpaces: number;
  spaces: BoardSpaceDefinition[];
}
