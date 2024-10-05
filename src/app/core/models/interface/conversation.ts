
export interface ChatMessage {
  user: string;
  senderImage: string;
  message: string;
  time: string;
  isUnread: boolean;
  isReceived: boolean;
  emojis: string[];
  attachments: string[];
  tags: string[];
}


export interface Chat {
  user: string;
  userImage: string;
  channel: string;
  time: string;
  badgeCount: number;
  type: string;
  chatData: ChatMessage[];
}
