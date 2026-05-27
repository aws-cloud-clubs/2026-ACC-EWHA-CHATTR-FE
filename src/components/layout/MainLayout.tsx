import type { ReactNode } from 'react'
import { WorkspaceSidebar } from './WorkspaceSidebar'

interface MainLayoutProps {
  sidebar?: ReactNode
  header?: ReactNode
  children: ReactNode
}

export function MainLayout({ children, header, sidebar }: MainLayoutProps) {
  return (
    <div className={`app-shell ${sidebar ? 'app-shell-with-sidebar' : 'app-shell-main-only'}`}>
      <WorkspaceSidebar />
      {sidebar}
      <main className="main-panel">
        {header}
        {children}
      </main>
    </div>
  )
}
