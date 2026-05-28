import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { mockDmMessagesByRoomId } from '../mocks/mockDmMessages'
import { mockMessagesByRoomId } from '../mocks/mockMessages'
import type { Message } from '../types/message'

interface MessageState {
  channelMessagesByRoomId: Record<string, Message[]>
  dmMessagesByRoomId: Record<string, Message[]>
  updateChannelMessages: (roomId: string, updater: (messages: Message[]) => Message[]) => void
  updateDmMessages: (roomId: string, updater: (messages: Message[]) => Message[]) => void
}

export const useMessageStore = create<MessageState>()(
  persist(
    (set) => ({
      channelMessagesByRoomId: mockMessagesByRoomId,
      dmMessagesByRoomId: mockDmMessagesByRoomId,
      updateChannelMessages: (roomId, updater) =>
        set((state) => ({
          channelMessagesByRoomId: {
            ...state.channelMessagesByRoomId,
            [roomId]: updater(state.channelMessagesByRoomId[roomId] ?? []),
          },
        })),
      updateDmMessages: (roomId, updater) =>
        set((state) => ({
          dmMessagesByRoomId: {
            ...state.dmMessagesByRoomId,
            [roomId]: updater(state.dmMessagesByRoomId[roomId] ?? []),
          },
        })),
    }),
    {
      name: 'chattr-message-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        channelMessagesByRoomId: state.channelMessagesByRoomId,
        dmMessagesByRoomId: state.dmMessagesByRoomId,
      }),
    },
  ),
)
