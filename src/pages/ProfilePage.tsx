import { Header } from '../components/layout/Header'
import { MainLayout } from '../components/layout/MainLayout'
import { DeviceItem } from '../components/profile/DeviceItem'
import { ProfileCard } from '../components/profile/ProfileCard'
import type { Device, User } from '../types/user'

const user: User = {
  id: 'user-1',
  email: 'owner@chattr.app',
  name: 'Owner',
  status: 'online',
}

const devices: Device[] = [
  {
    id: 'device-1',
    name: 'Chrome on Windows',
    lastActiveAt: '2026-05-26T00:00:00.000Z',
  },
]

export function ProfilePage() {
  return (
    <MainLayout header={<Header title="Chattr" />}>
      <div className="page">
      <ProfileCard user={user} />
      <section className="panel">
        <h2>Devices</h2>
        {devices.map((device) => (
          <DeviceItem device={device} key={device.id} />
        ))}
      </section>
      </div>
    </MainLayout>
  )
}
