import { type ReactNode } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { ChatPage } from '../pages/ChatPage'
import { DmPage } from '../pages/DmPage'
import { LoginPage } from '../pages/LoginPage'
import { ProfilePage } from '../pages/ProfilePage'
import { SignupPage } from '../pages/SignupPage'
import { WorkspaceManagePage } from '../pages/WorkspaceManagePage'
import { WorkspaceMemberPage } from '../pages/WorkspaceMemberPage'
import { useAuthStore } from '../stores/useAuthStore'

function ProtectedRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isSessionReady = useAuthStore((state) => state.isSessionReady)

  if (!isSessionReady) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#0058BE]" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate replace to="/login" />
  }

  return <>{children}</>
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate replace to="/chat" />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
  {
    path: '/chat',
    element: <ProtectedRoute><ChatPage /></ProtectedRoute>,
  },
  {
    path: '/dm',
    element: <ProtectedRoute><DmPage /></ProtectedRoute>,
  },
  {
    path: '/profile',
    element: <ProtectedRoute><ProfilePage /></ProtectedRoute>,
  },
  {
    path: '/workspaces/manage',
    element: <ProtectedRoute><WorkspaceManagePage /></ProtectedRoute>,
  },
  {
    path: '/workspaces/members',
    element: <ProtectedRoute><WorkspaceMemberPage /></ProtectedRoute>,
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
