import { axiosInstance } from './axiosInstance'
import type { DmRoom } from '../types/dm'

export const dmApi = {
  getRooms: async () => {
    const { data } = await axiosInstance.get<DmRoom[]>('/dms')
    return data
  },
  createRoom: async (targetUserId: string) => {
    const { data } = await axiosInstance.post<DmRoom>('/dms', { targetUserId })
    return data
  },
}
