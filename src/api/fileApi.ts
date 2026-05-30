import { axiosInstance } from './axiosInstance'

interface PresignResponse {
  presignedUrl: string
  fileUrl: string
}

export const fileApi = {
  getPresignedUrl: async (filename: string, contentType: string) => {
    const { data } = await axiosInstance.post<PresignResponse>('/files/presign', {
      filename,
      contentType,
    })
    return data
  },
  uploadToS3: async (presignedUrl: string, file: File) => {
    await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': file.type },
    })
  },
}
