export interface ChatMessage {
  fromRole: 'client' | 'agent';
  conversationId: string;
  content: string;
  timestamp?: string;
}
