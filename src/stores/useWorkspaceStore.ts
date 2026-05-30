import { create } from 'zustand'
import { workspaceApi } from '../api/workspaceApi'
import type { User } from '../types/user'
import type { Workspace, WorkspaceMember, WorkspaceRole } from '../types/workspace'

interface WorkspaceState {
  workspaces: Workspace[]
  workspaceMembers: WorkspaceMember[]
  workspaceMembersByWorkspaceId: Record<string, WorkspaceMember[]>
  activeWorkspaceId?: string
  addWorkspace: (workspace: Workspace, members?: WorkspaceMember[]) => void
  addWorkspaceMember: (nickname: string) => WorkspaceMember
  deleteWorkspace: (workspaceId: string) => void
  updateCurrentUserProfile: (profile: { avatarUrl?: string; email: string; name: string; userId: string }) => void
  updateWorkspaceMemberRole: (memberId: string, role: WorkspaceRole) => void
  setWorkspaces: (workspaces: Workspace[]) => void
  setWorkspaceMembers: (members: WorkspaceMember[]) => void
  setActiveWorkspaceId: (workspaceId: string) => void
  fetchWorkspaces: () => Promise<void>
  fetchMembers: (workspaceId: string) => Promise<void>
  replaceWorkspaceState: (state: {
    activeWorkspaceId?: string
    workspaceMembers: WorkspaceMember[]
    workspaceMembersByWorkspaceId: Record<string, WorkspaceMember[]>
    workspaces: Workspace[]
  }) => void
}

export const useWorkspaceStore = create<WorkspaceState>()((set) => ({
  workspaces: [],
  workspaceMembers: [],
  workspaceMembersByWorkspaceId: {},
  activeWorkspaceId: undefined,
  addWorkspace: (workspace, members) =>
    set((state) => ({
      workspaces: state.workspaces.some((item) => item.id === workspace.id)
        ? state.workspaces
        : [...state.workspaces, workspace],
      workspaceMembersByWorkspaceId: state.workspaceMembersByWorkspaceId[workspace.id]
        ? state.workspaceMembersByWorkspaceId
        : {
            ...state.workspaceMembersByWorkspaceId,
            [workspace.id]: members ?? [],
          },
    })),
  addWorkspaceMember: (nickname) => {
    const now = Date.now()
    const member: WorkspaceMember = {
      id: `workspace-member-${now}`,
      joinedAt: new Date(now).toISOString(),
      role: 'member',
      user: {
        id: `workspace-user-${now}`,
        email: `${now}@example.com`,
        name: nickname,
        status: 'offline',
      },
    }

    set((state) => {
      const workspaceId = state.activeWorkspaceId ?? ''
      if (!workspaceId) return {}
      const nextMembers = [...(state.workspaceMembersByWorkspaceId[workspaceId] ?? []), member]
      return {
        workspaceMembers: nextMembers,
        workspaceMembersByWorkspaceId: {
          ...state.workspaceMembersByWorkspaceId,
          [workspaceId]: nextMembers,
        },
      }
    })
    return member
  },
  deleteWorkspace: (workspaceId) =>
    set((state) => {
      const nextWorkspaces = state.workspaces.filter((workspace) => workspace.id !== workspaceId)
      const nextMembersByWorkspaceId = { ...state.workspaceMembersByWorkspaceId }
      delete nextMembersByWorkspaceId[workspaceId]
      const nextActiveWorkspaceId =
        state.activeWorkspaceId === workspaceId ? nextWorkspaces[0]?.id : state.activeWorkspaceId

      return {
        activeWorkspaceId: nextActiveWorkspaceId,
        workspaceMembers: nextActiveWorkspaceId ? (nextMembersByWorkspaceId[nextActiveWorkspaceId] ?? []) : [],
        workspaceMembersByWorkspaceId: nextMembersByWorkspaceId,
        workspaces: nextWorkspaces,
      }
    }),
  updateCurrentUserProfile: (profile) =>
    set((state) => {
      const updateMembers = (members: WorkspaceMember[]) =>
        members.map((member) =>
          member.user.id === profile.userId
            ? {
                ...member,
                user: {
                  ...member.user,
                  avatarUrl: profile.avatarUrl,
                  email: profile.email,
                  name: profile.name,
                } as User,
              }
            : member,
        )

      const workspaceMembersByWorkspaceId = Object.fromEntries(
        Object.entries(state.workspaceMembersByWorkspaceId).map(([workspaceId, members]) => [
          workspaceId,
          updateMembers(members),
        ]),
      )
      const workspaceId = state.activeWorkspaceId ?? ''

      return {
        workspaceMembers: workspaceId
          ? (workspaceMembersByWorkspaceId[workspaceId] ?? updateMembers(state.workspaceMembers))
          : updateMembers(state.workspaceMembers),
        workspaceMembersByWorkspaceId,
      }
    }),
  updateWorkspaceMemberRole: (memberId, role) =>
    set((state) => {
      const workspaceId = state.activeWorkspaceId ?? ''
      if (!workspaceId) return {}
      const nextMembers = (state.workspaceMembersByWorkspaceId[workspaceId] ?? state.workspaceMembers).map(
        (member) => (member.id === memberId ? { ...member, role } : member),
      )

      return {
        workspaceMembers: nextMembers,
        workspaceMembersByWorkspaceId: {
          ...state.workspaceMembersByWorkspaceId,
          [workspaceId]: nextMembers,
        },
      }
    }),
  setWorkspaces: (workspaces) => set({ workspaces }),
  setWorkspaceMembers: (workspaceMembers) =>
    set((state) => {
      const workspaceId = state.activeWorkspaceId ?? ''
      if (!workspaceId) return { workspaceMembers }
      return {
        workspaceMembers,
        workspaceMembersByWorkspaceId: {
          ...state.workspaceMembersByWorkspaceId,
          [workspaceId]: workspaceMembers,
        },
      }
    }),
  setActiveWorkspaceId: (activeWorkspaceId) =>
    set((state) => ({
      activeWorkspaceId,
      workspaceMembers: state.workspaceMembersByWorkspaceId[activeWorkspaceId] ?? [],
    })),
  fetchWorkspaces: async () => {
    const workspaces = await workspaceApi.getWorkspaces()
    set((state) => ({
      workspaces,
      activeWorkspaceId: state.activeWorkspaceId ?? workspaces[0]?.id,
    }))
  },
  fetchMembers: async (workspaceId) => {
    const members = await workspaceApi.getMembers(workspaceId)
    set((state) => ({
      workspaceMembers: state.activeWorkspaceId === workspaceId ? members : state.workspaceMembers,
      workspaceMembersByWorkspaceId: {
        ...state.workspaceMembersByWorkspaceId,
        [workspaceId]: members,
      },
    }))
  },
  replaceWorkspaceState: (nextState) => set(nextState),
}))
