import { axiosInstance } from './axiosInstance'
import type { BackendUser, Device, User } from '../types/user'

const mapBackendUser = (user: BackendUser): User => ({
  id: user.id,
  email: user.email,
  name: user.nickname,
  status: user.online ? 'online' : 'offline',
})

export const userApi = {
  getProfile: async () => {
    const { data } = await axiosInstance.get<BackendUser>('/users/me')
    return mapBackendUser(data)
  },
  updateProfile: async (payload: Partial<Pick<User, 'name' | 'avatarUrl'>>) => {
    const requestPayload: { avatarUrl?: string; nickname?: string } = {}
    if (payload.name !== undefined) requestPayload.nickname = payload.name
    if (payload.avatarUrl !== undefined) requestPayload.avatarUrl = payload.avatarUrl

    const { data } = await axiosInstance.patch<BackendUser>('/users/me', requestPayload)
    return mapBackendUser(data)
  },
  getDevices: async () => {
    const { data } = await axiosInstance.get<Device[]>('/users/me/devices')
    return data
  },
}
