import { ChatInput } from '../components/chat/ChatInput'
import { MessageList } from '../components/chat/MessageList'
import { DmSidebar } from '../components/layout/DmSidebar'
import { Header } from '../components/layout/Header'
import { MainLayout } from '../components/layout/MainLayout'
import { mockMessages } from '../mocks/mockMessages'

export function DmPage() {
  return (
    <MainLayout header={<Header title="Direct messages" />} sidebar={<DmSidebar />}>
      <MessageList messages={mockMessages} />
      <ChatInput />
    </MainLayout>
  )
}
