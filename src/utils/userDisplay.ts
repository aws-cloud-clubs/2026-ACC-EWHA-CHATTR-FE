import { useAuthStore } from '../stores/useAuthStore'
import type { User } from '../types/user'

export function isCurrentUser(user?: Pick<User, 'id'>) {
  const authUserId = useAuthStore.getState().user?.id
  return Boolean(authUserId && user?.id === authUserId)
}

export function getUserDisplayName(user?: Pick<User, 'id' | 'name'>) {
  if (!user) return ''
  if (!isCurrentUser(user)) return user.name
  return `${user.name} (나)`
}

export function getUserAvatarName(user?: Pick<User, 'id' | 'name'>) {
  if (!user) return ''
  if (!isCurrentUser(user)) return user.name
  return user.name
}
