import type { UploadFileResult } from '@entities/upload-file'
import { ENDPOINTS } from '@shared/api/endpoints'
import { httpPostFormData } from '@shared/api/httpClient'

export function uploadFile(file: File): Promise<UploadFileResult> {
  const formData = new FormData()
  formData.append('file', file)

  return httpPostFormData<UploadFileResult>(ENDPOINTS.uploadFile, formData)
}
