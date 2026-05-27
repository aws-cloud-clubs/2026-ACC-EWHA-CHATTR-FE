import { ChatInput } from '../components/chat/ChatInput'
import { MessageList } from '../components/chat/MessageList'
import { ChannelSidebar } from '../components/layout/ChannelSidebar'
import { Header } from '../components/layout/Header'
import { MainLayout } from '../components/layout/MainLayout'
import { mockMessages } from '../mocks/mockMessages'

export function ChatPage() {
  return (
    <MainLayout header={<Header title="# general" />} sidebar={<ChannelSidebar />}>
      <MessageList messages={mockMessages} />
      <ChatInput />
    </MainLayout>
  )
}
