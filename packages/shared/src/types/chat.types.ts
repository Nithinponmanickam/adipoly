export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderColor?: string;
  text: string;
  timestamp: number;
  isSystem?: boolean;
}
