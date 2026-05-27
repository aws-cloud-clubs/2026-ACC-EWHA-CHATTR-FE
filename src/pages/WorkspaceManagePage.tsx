import { Header } from '../components/layout/Header'
import { MainLayout } from '../components/layout/MainLayout'
import { WorkspaceCard } from '../components/workspace/WorkspaceCard'
import { mockWorkspaces } from '../mocks/mockWorkspace'

export function WorkspaceManagePage() {
  return (
    <MainLayout header={<Header title="Chattr" />}>
      <div className="page">
        <h1>Workspace management</h1>
        <div className="stack">
          {mockWorkspaces.map((workspace) => (
            <WorkspaceCard key={workspace.id} workspace={workspace} />
          ))}
        </div>
      </div>
    </MainLayout>
  )
}
