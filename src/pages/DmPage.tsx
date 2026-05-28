import { useEffect, useRef, useState } from 'react'
import { ChatInput } from '../components/chat/ChatInput'
import { Avatar } from '../components/common/Avatar'
import { DmMessage } from '../components/dm/DmMessage'
import { DmSidebar } from '../components/layout/DmSidebar'
import { MainLayout } from '../components/layout/MainLayout'
import { createDefaultDmMessages } from '../mocks/mockDmMessages'
import { currentUserId } from '../mocks/mockWorkspaceMembers'
import { useDmStore } from '../stores/useDmStore'
import { useMessageStore } from '../stores/useMessageStore'
import { useWorkspaceStore } from '../stores/useWorkspaceStore'
import type { Message } from '../types/message'
import type { User } from '../types/user'
import { currentUserName } from '../utils/userDisplay'

function DmHeader({ participant }: { participant?: User }) {
  return (
    <header className="flex h-13 items-center gap-3 border-b border-slate-300 bg-[#fbfbff] px-6">
      <span className="relative inline-flex shrink-0">
        <Avatar name={participant?.name ?? 'DM'} size={36} src={participant?.avatarUrl} />
        {participant?.status === 'online' ? (
          <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-[#fbfbff] bg-emerald-500" />
        ) : null}
      </span>
      <h1 className="text-sm font-extrabold text-slate-950">{participant?.name ?? 'Direct Message'}</h1>
    </header>
  )
}

function DmMessageList({
  messages,
  onDeleteMessage,
  onEditMessage,
  onReplyMessage,
}: {
  messages: Message[]
  onDeleteMessage: (messageId: string) => void
  onEditMessage: (messageId: string, content: string) => void
  onReplyMessage: (message: Message) => void
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const lastMessageId = messages[messages.length - 1]?.id

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [lastMessageId])

  return (
    <div ref={scrollRef} className="flex min-h-0 flex-col gap-3 overflow-y-auto bg-[#fbfbff] px-6 py-4">
      <div className="mb-1 flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-300" />
        <span className="px-4 text-xs font-bold text-slate-600">2023년 10월 24일 화요일</span>
        <div className="h-px flex-1 bg-slate-300" />
      </div>
      {messages.map((message) => (
        <DmMessage
          key={message.id}
          message={message}
          onDelete={onDeleteMessage}
          onEdit={onEditMessage}
          onReply={onReplyMessage}
        />
      ))}
    </div>
  )
}

export function DmPage() {
  const { activeRoomId, rooms } = useDmStore()
  const currentUser = useWorkspaceStore((state) =>
    state.workspaceMembers.find((member) => member.user.id === currentUserId)?.user,
  )
  const { dmMessagesByRoomId, updateDmMessages } = useMessageStore()
  const [replyTarget, setReplyTarget] = useState<Message | null>(null)
  const activeRoom = rooms.find((room) => room.id === activeRoomId) ?? rooms[0]
  const participant = activeRoom?.participants[0]
  const activeRoomIdValue = activeRoom?.id
  const currentAuthor = currentUser ?? {
    id: currentUserId,
    email: 'kim.chattr@example.com',
    name: currentUserName,
    status: 'online' as const,
  }
  const messages = activeRoom
    ? (dmMessagesByRoomId[activeRoom.id] ?? createDefaultDmMessages(activeRoom.id, participant)).map((message) =>
        message.author.id === currentUserId
          ? {
              ...message,
              author: currentAuthor,
            }
          : message,
      )
    : []

  const updateActiveMessages = (updater: (messages: Message[]) => Message[]) => {
    if (!activeRoomIdValue) return

    updateDmMessages(activeRoomIdValue, (current) =>
      updater(current.length > 0 ? current : createDefaultDmMessages(activeRoomIdValue, participant)),
    )
  }

  const handleSendMessage = (content: string) => {
    if (!activeRoomIdValue) return

    const now = new Date()
    const nextMessage: Message = {
      id: `${activeRoomIdValue}-message-${now.getTime()}`,
      roomId: activeRoomIdValue,
      type: 'text',
      content,
      createdAt: now.toISOString(),
      displayTime: '방금 전',
      parentMessageId: replyTarget?.id,
      replyPreview: replyTarget
        ? {
            authorName: replyTarget.author.name,
            content: replyTarget.content,
          }
        : undefined,
      author: currentAuthor,
    }

    updateActiveMessages((current) => [...current, nextMessage])
    setReplyTarget(null)
  }

  return (
    <MainLayout header={<DmHeader participant={participant} />} sidebar={<DmSidebar />}>
      <DmMessageList
        messages={messages}
        onDeleteMessage={(messageId) =>
          updateActiveMessages((current) => current.filter((message) => message.id !== messageId))
        }
        onEditMessage={(messageId, content) =>
          updateActiveMessages((current) =>
            current.map((message) =>
              message.id === messageId ? { ...message, content, updatedAt: new Date().toISOString() } : message,
            ),
          )
        }
        onReplyMessage={setReplyTarget}
      />
      <ChatInput
        compact
        helperText="Enter를 눌러 메시지 전송, Shift + Enter로 줄바꿈"
        onCancelReply={() => setReplyTarget(null)}
        onSend={handleSendMessage}
        replyTarget={replyTarget}
      />
    </MainLayout>
  )
}
