import { useEffect } from 'react'
import { DataLoader } from './components/DataLoader'
import { AppRouter } from './routes/router'
import { useAuthStore } from './stores/useAuthStore'

function App() {
  const restoreSession = useAuthStore((state) => state.restoreSession)

  useEffect(() => {
    restoreSession()
  }, [restoreSession])

  return (
    <>
      <DataLoader />
      <AppRouter />
    </>
  )
}

export default App
