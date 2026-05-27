import { mockDmRooms } from '../../mocks/mockDmRooms'
import { DmRoomItem } from '../dm/DmRoomItem'
import { Sidebar } from './Sidebar'

export function DmSidebar() {
  return (
    <Sidebar title="Direct Messages">
      {mockDmRooms.map((room) => (
        <DmRoomItem key={room.id} room={room} />
      ))}
    </Sidebar>
  )
}
