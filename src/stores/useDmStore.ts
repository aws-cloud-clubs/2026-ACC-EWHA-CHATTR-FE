import { create } from 'zustand'
import { dmApi } from '../api/dmApi'
import type { DmRoom } from '../types/dm'

interface DmState {
  rooms: DmRoom[]
  activeRoomId?: string
  unreadCounts: Record<string, number>
  openedUnreadCounts: Record<string, number>
  clearOpenedUnreadCount: (roomId: string) => void
  deleteRoom: (roomId: string) => void
  markRoomOpened: (roomId: string) => void
  setRooms: (rooms: DmRoom[]) => void
  setActiveRoomId: (roomId: string) => void
  setUnreadCounts: (unreadCounts: Record<string, number>) => void
  fetchDmRooms: () => Promise<void>
  replaceDmState: (state: {
    activeRoomId?: string
    openedUnreadCounts: Record<string, number>
    rooms: DmRoom[]
    unreadCounts: Record<string, number>
  }) => void
}

export const useDmStore = create<DmState>()((set) => ({
  rooms: [],
  activeRoomId: undefined,
  unreadCounts: {},
  openedUnreadCounts: {},
  clearOpenedUnreadCount: (roomId) =>
    set((state) => {
      const nextOpenedCounts = { ...state.openedUnreadCounts }
      delete nextOpenedCounts[roomId]
      return { openedUnreadCounts: nextOpenedCounts }
    }),
  deleteRoom: (roomId) =>
    set((state) => {
      const nextRooms = state.rooms.filter((room) => room.id !== roomId)
      const nextOpenedCounts = { ...state.openedUnreadCounts }
      const nextUnreadCounts = { ...state.unreadCounts }
      delete nextOpenedCounts[roomId]
      delete nextUnreadCounts[roomId]

      return {
        activeRoomId: state.activeRoomId === roomId ? nextRooms[0]?.id : state.activeRoomId,
        openedUnreadCounts: nextOpenedCounts,
        rooms: nextRooms,
        unreadCounts: nextUnreadCounts,
      }
    }),
  markRoomOpened: (roomId) =>
    set((state) => {
      const unreadCount = state.unreadCounts[roomId] ?? 0
      const nextUnreadCounts = { ...state.unreadCounts }
      const nextOpenedCounts = { ...state.openedUnreadCounts }
      delete nextUnreadCounts[roomId]
      if (unreadCount > 0) {
        nextOpenedCounts[roomId] = unreadCount
      }

      return {
        activeRoomId: roomId,
        openedUnreadCounts: nextOpenedCounts,
        unreadCounts: nextUnreadCounts,
      }
    }),
  setRooms: (rooms) => set({ rooms }),
  setActiveRoomId: (activeRoomId) => set({ activeRoomId }),
  setUnreadCounts: (unreadCounts) => set({ unreadCounts }),
  fetchDmRooms: async () => {
    const rooms = await dmApi.getRooms()
    set({ rooms })
  },
  replaceDmState: (nextState) => set(nextState),
}))
