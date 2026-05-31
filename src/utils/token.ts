const ACCESS_TOKEN_KEY = 'chattr.accessToken'
const REFRESH_TOKEN_KEY = 'chattr.refreshToken'
const ID_TOKEN_KEY = 'chattr.idToken'

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY)

export const setAccessToken = (token: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY)

export const setRefreshToken = (token: string) => {
  localStorage.setItem(REFRESH_TOKEN_KEY, token)
}

export const getIdToken = () => localStorage.getItem(ID_TOKEN_KEY)

export const setIdToken = (token: string) => {
  localStorage.setItem(ID_TOKEN_KEY, token)
}

export const removeIdToken = () => {
  localStorage.removeItem(ID_TOKEN_KEY)
}

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  removeIdToken()
}
