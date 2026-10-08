import { z } from 'zod';

export const DisplayNameSchema = z
  .string()
  .trim()
  .min(2, { message: 'Display name must be at least 2 characters.' })
  .max(20, { message: 'Display name must be at most 20 characters.' })
  .regex(/^[a-zA-Z0-9_\- ]+$/, { message: 'Name can only contain letters, numbers, spaces, underscores, and hyphens.' });

export const PlayerSummarySchema = z.object({
  id: z.string().uuid(),
  displayName: DisplayNameSchema,
  isHost: z.boolean(),
  ready: z.boolean(),
  connected: z.boolean(),
  color: z.string(),
  teamId: z.string().nullable().optional(),
});
