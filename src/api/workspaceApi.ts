import { axiosInstance } from './axiosInstance'
import type { Workspace, WorkspaceMember, WorkspaceRole } from '../types/workspace'

export const workspaceApi = {
  getWorkspaces: async () => {
    const { data } = await axiosInstance.get<Workspace[]>('/workspaces')
    return data
  },
  getWorkspace: async (workspaceId: string) => {
    const { data } = await axiosInstance.get<Workspace>(`/workspaces/${workspaceId}`)
    return data
  },
  createWorkspace: async (payload: Pick<Workspace, 'name'>) => {
    const { data } = await axiosInstance.post<Workspace>('/workspaces', payload)
    return data
  },
  updateWorkspace: async (workspaceId: string, payload: Partial<Pick<Workspace, 'name'>>) => {
    const { data } = await axiosInstance.patch<Workspace>(`/workspaces/${workspaceId}`, payload)
    return data
  },
  deleteWorkspace: async (workspaceId: string) => {
    await axiosInstance.delete(`/workspaces/${workspaceId}`)
  },
  getMembers: async (workspaceId: string) => {
    const { data } = await axiosInstance.get<WorkspaceMember[]>(`/workspaces/${workspaceId}/members`)
    return data
  },
  inviteMember: async (workspaceId: string, email: string) => {
    await axiosInstance.post(`/workspaces/${workspaceId}/invitations`, { email })
  },
  acceptInvitation: async (workspaceId: string) => {
    await axiosInstance.post(`/workspaces/${workspaceId}/members`)
  },
  changeMemberRole: async (workspaceId: string, memberId: string, role: WorkspaceRole) => {
    await axiosInstance.patch(`/workspaces/${workspaceId}/members`, { memberId, role })
  },
}
