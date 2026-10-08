import { z } from 'zod';
import { ROOM_CODE_LENGTH } from '../constants/defaults.js';
import { MatchSettingsSchema } from './settings.schema.js';
import { PlayerSummarySchema } from './player.schema.js';

export const RoomCodeSchema = z
  .string()
  .trim()
  .transform((val) => val.toUpperCase())
  .refine((val) => val.length === ROOM_CODE_LENGTH, {
    message: `Room code must be exactly ${ROOM_CODE_LENGTH} characters.`,
  })
  .refine((val) => /^[A-Z0-9]+$/.test(val), {
    message: 'Room code must consist of uppercase letters and digits.',
  });

export const RoomStateSchema = z.object({
  roomCode: RoomCodeSchema,
  hostId: z.string().uuid(),
  status: z.enum(['LOBBY', 'IN_GAME', 'FINISHED']),
  players: z.array(PlayerSummarySchema),
  settings: MatchSettingsSchema,
  createdAt: z.number(),
  updatedAt: z.number(),
});
