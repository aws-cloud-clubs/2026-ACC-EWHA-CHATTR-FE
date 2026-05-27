import type { DmRoom } from '../types/dm'

export const mockDmRooms: DmRoom[] = [
  {
    id: 'dm-1',
    participants: [
      {
        id: 'user-2',
        email: 'hong@example.com',
        name: '홍길동',
        status: 'online',
      },
    ],
    updatedAt: '2026-05-26T00:00:00.000Z',
  },
  {
    id: 'dm-2',
    participants: [
      {
        id: 'user-3',
        email: 'kim@example.com',
        name: '김철수',
        status: 'offline',
      },
    ],
    updatedAt: '2026-05-26T00:00:00.000Z',
  },
]
