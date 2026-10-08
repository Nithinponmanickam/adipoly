import { z } from 'zod';
import { DisplayNameSchema } from './player.schema.js';
import { RoomCodeSchema } from './room.schema.js';
import { PartialMatchSettingsSchema } from './settings.schema.js';
import { SendChatPayloadSchema } from './chat.schema.js';

export const CreateRoomPayloadSchema = z.object({
  displayName: DisplayNameSchema,
  settings: PartialMatchSettingsSchema.optional(),
});

export const JoinRoomPayloadSchema = z.object({
  roomCode: RoomCodeSchema,
  displayName: DisplayNameSchema,
});

export const ReconnectPayloadSchema = z.object({
  roomCode: RoomCodeSchema,
  sessionToken: z.string().min(10),
});

export const ReadyPayloadSchema = z.object({
  ready: z.boolean(),
});

export const SetTeamPayloadSchema = z.object({
  teamId: z.string().nullable(),
});

export const UpdateSettingsPayloadSchema = z.object({
  settings: PartialMatchSettingsSchema,
});

export const KickPlayerPayloadSchema = z.object({
  targetPlayerId: z.string(),
});

export { SendChatPayloadSchema };
