export interface MessageSendRequest {
  roomId: string
  roomType: 'CHANNEL' | 'DM'
  content: string
  parentMessageId?: string
  attachments?: { url: string; name: string; size: number; contentType: string }[]
}
