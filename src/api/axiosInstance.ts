import axios from 'axios'
import { clearTokens, getAccessToken } from '../utils/token'

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  withCredentials: true,
})

axiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data && typeof response.data === 'object' && 'payload' in response.data) {
      response.data = response.data.payload
    }
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      clearTokens()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)
