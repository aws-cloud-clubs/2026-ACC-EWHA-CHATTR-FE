import type { User } from './user'

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthResponse {
  user: User
  tokens: AuthTokens
}

export interface LoginResponse {
  idToken: string
  accessToken: string
  refreshToken: string
  username: string
  expiresIn: number
}
