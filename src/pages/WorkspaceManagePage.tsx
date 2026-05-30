import { useState, type MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, MessageSquare, Trash2, Users, X } from 'lucide-react'
import { workspaceApi } from '../api/workspaceApi'
import { Avatar } from '../components/common/Avatar'
import { MainLayout } from '../components/layout/MainLayout'
import { useAuthStore } from '../stores/useAuthStore'
import { useChannelStore } from '../stores/useChannelStore'
import { useMessageStore } from '../stores/useMessageStore'
import { useWorkspaceStore } from '../stores/useWorkspaceStore'
import type { WorkspaceMember } from '../types/workspace'
import { getWorkspaceAccent } from '../utils/workspaceAccent'

interface PermissionNoticeState {
  left: number
  top: number
}

interface WorkspaceManageCardData {
  id: string
  badge: string
  name: string
  description: string
  members: number
  extraMembers: number
  accent: string
  previewMembers: WorkspaceMember[]
}

function WorkspaceTopHeader() {
  return (
    <header className="flex h-10 items-center border-b border-slate-300 bg-[#fbfbff] px-6">
      <div className="flex items-center gap-2 text-[#0058BE]">
        <MessageSquare aria-hidden size={22} strokeWidth={2.5} />
        <span className="text-2xl font-extrabold">Chattr</span>
      </div>
    </header>
  )
}

function WorkspaceManageCard({
  onDelete,
  onViewMembers,
  workspace,
}: {
  onDelete: (event: MouseEvent<HTMLButtonElement>) => void
  onViewMembers: () => void
  workspace: WorkspaceManageCardData
}) {
  const visiblePreviewMembers = workspace.previewMembers.slice(0, Math.min(2, workspace.members))

  return (
    <article className="group relative overflow-hidden rounded-lg border border-slate-300 bg-white transition-shadow hover:shadow-md">
      <div className="h-1" style={{ backgroundColor: workspace.accent }} />
      <button
        aria-label="워크스페이스 삭제"
        className="absolute right-4 top-5 grid size-8 place-items-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-[#BA1A1A]"
        onClick={onDelete}
        type="button"
      >
        <Trash2 size={18} />
      </button>
      <div className="p-4">
        <div className="grid size-9 place-items-center rounded-md bg-slate-200 text-xs font-extrabold text-slate-950">
          {workspace.badge}
        </div>

        <h2 className="mt-4 text-sm font-extrabold text-slate-950">{workspace.name}</h2>
        <p className="mt-2 min-h-10 text-xs font-medium leading-5 text-slate-600">{workspace.description}</p>

        <div className="my-4 h-px bg-slate-300" />

        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="mb-2 flex min-h-6 items-center -space-x-2">
              {visiblePreviewMembers.map((member) => (
                <Avatar key={member.id} name={member.user.name} size={22} src={member.user.avatarUrl} />
              ))}
              {workspace.members >= 3 ? (
                <span className="grid size-6 place-items-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-600 ring-2 ring-white">
                  +{workspace.extraMembers}
                </span>
              ) : null}
            </div>
            <p className="text-xs font-medium text-slate-700">{workspace.members} Members</p>
          </div>

          <button
            className="rounded-full px-3 py-1 text-[11px] font-bold leading-none text-white transition-opacity hover:opacity-85"
            onClick={onViewMembers}
            style={{ backgroundColor: workspace.accent }}
            type="button"
          >
            멤버 조회
          </button>
        </div>
      </div>
    </article>
  )
}

export function WorkspaceManagePage() {
  const navigate = useNavigate()
  const [permissionNotice, setPermissionNotice] = useState<PermissionNoticeState | null>(null)
  const authUser = useAuthStore((state) => state.user)
  const activeUserId = authUser?.id ?? ''
  const { deleteWorkspaceChannels, channels } = useChannelStore()
  const deleteChannelMessages = useMessageStore((state) => state.deleteChannelMessages)
  const deleteWorkspace = useWorkspaceStore((state) => state.deleteWorkspace)
  const setActiveWorkspaceId = useWorkspaceStore((state) => state.setActiveWorkspaceId)
  const storedWorkspaces = useWorkspaceStore((state) => state.workspaces)
  const workspaceMembersByWorkspaceId = useWorkspaceStore((state) => state.workspaceMembersByWorkspaceId)

  const displayedWorkspaces: WorkspaceManageCardData[] = storedWorkspaces.map((workspace, index) => {
    const workspaceMembers = workspaceMembersByWorkspaceId[workspace.id] ?? []
    const memberCount = workspaceMembers.length

    return {
      accent: getWorkspaceAccent(index),
      badge: workspace.name.slice(0, 2).toUpperCase(),
      description: '참여 중인 워크스페이스입니다.',
      extraMembers: Math.max(0, memberCount - 2),
      id: workspace.id,
      members: memberCount,
      name: workspace.name,
      previewMembers: workspaceMembers,
    }
  })

  const handleViewMembers = (workspaceId: string) => {
    setActiveWorkspaceId(workspaceId)
    navigate('/workspaces/members')
  }

  const showPermissionNotice = (event: MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setPermissionNotice({
      left: Math.max(16, Math.min(rect.right + 10, window.innerWidth - 346)),
      top: Math.max(16, Math.min(rect.top - 10, window.innerHeight - 100)),
    })
  }

  const handleDeleteWorkspace = (workspaceId: string, event: MouseEvent<HTMLButtonElement>) => {
    const currentRole =
      workspaceMembersByWorkspaceId[workspaceId]?.find((member) => member.user.id === activeUserId)?.role ?? 'member'

    if (currentRole !== 'admin') {
      showPermissionNotice(event)
      return
    }

    void workspaceApi.deleteWorkspace(workspaceId).then(() => {
      channels
        .filter((channel) => channel.workspaceId === workspaceId)
        .forEach((channel) => deleteChannelMessages(channel.id))
      deleteWorkspaceChannels(workspaceId)
      deleteWorkspace(workspaceId)
      setPermissionNotice(null)
    })
  }

  return (
    <MainLayout header={<WorkspaceTopHeader />}>
      <div className="min-h-0 overflow-y-auto bg-[#fbfbff] px-7 py-6">
        {permissionNotice ? (
          <div
            className="fixed z-40 w-[20.625rem] rounded-lg border border-slate-300 bg-white p-3 text-xs font-bold leading-5 text-slate-700 shadow-xl"
            style={{ left: permissionNotice.left, top: permissionNotice.top }}
          >
            <div className="flex items-start justify-between gap-3">
              <p>워크스페이스 삭제는 해당 워크스페이스의 admin 멤버만 가능합니다.</p>
              <button
                aria-label="워크스페이스 삭제 권한 안내 닫기"
                className="shrink-0 text-slate-400 transition-colors hover:text-slate-700"
                onClick={() => setPermissionNotice(null)}
                type="button"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ) : null}
        <div className="flex w-full flex-col gap-7">
          <section>
            <h1 className="text-base font-extrabold text-slate-950">workspace 설정</h1>
          </section>

          <section>
            <div className="mb-5 flex items-center gap-2 text-base font-medium text-slate-800">
              <Users size={18} />
              <span>내 워크스페이스 목록: 참여 중인 워크스페이스를 정보를 확인 및 수정하세요.</span>
            </div>

            {displayedWorkspaces.length === 0 ? (
              <p className="text-sm font-medium text-slate-500">참여 중인 워크스페이스가 없습니다.</p>
            ) : (
              <div className="grid grid-cols-3 gap-4 max-xl:grid-cols-2 max-md:grid-cols-1">
                {displayedWorkspaces.map((workspace) => (
                  <WorkspaceManageCard
                    key={workspace.id}
                    onDelete={(event) => handleDeleteWorkspace(workspace.id, event)}
                    onViewMembers={() => handleViewMembers(workspace.id)}
                    workspace={workspace}
                  />
                ))}
              </div>
            )}
          </section>

          <section>
            <div className="mb-5 flex items-center gap-2 text-base font-medium text-slate-800">
              <Mail size={18} />
              <span>초대된 목록: 워크스페이스에 참여하기 위해 초대를 수락해주세요.</span>
            </div>
            <p className="text-sm font-medium text-slate-500">수락 대기 중인 초대가 없습니다.</p>
          </section>
        </div>
      </div>
    </MainLayout>
  )
}
