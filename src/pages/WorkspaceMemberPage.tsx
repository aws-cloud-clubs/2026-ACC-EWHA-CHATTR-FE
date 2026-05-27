import { Header } from '../components/layout/Header'
import { MainLayout } from '../components/layout/MainLayout'
import { WorkspaceMemberItem } from '../components/workspace/WorkspaceMemberItem'
import { mockWorkspaceMembers } from '../mocks/mockWorkspace'

export function WorkspaceMemberPage() {
  return (
    <MainLayout header={<Header title="Chattr" />}>
      <div className="page">
        <h1>Workspace members</h1>
        <section className="panel">
          {mockWorkspaceMembers.map((member) => (
            <WorkspaceMemberItem key={member.id} member={member} />
          ))}
        </section>
      </div>
    </MainLayout>
  )
}
