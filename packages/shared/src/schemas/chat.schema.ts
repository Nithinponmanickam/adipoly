import { z } from 'zod';

export const ChatMessageSchema = z.object({
  id: z.string(),
  senderId: z.string(),
  senderName: z.string(),
  senderColor: z.string().optional(),
  text: z.string().trim().min(1).max(200),
  timestamp: z.number(),
  isSystem: z.boolean().optional(),
});

export const SendChatPayloadSchema = z.object({
  text: z.string().trim().min(1, 'Message cannot be empty.').max(200, 'Message cannot exceed 200 characters.'),
});
