export type UploadFileResult = {
  status: 'ok' | 'error'
  service: string
  filename?: string
  size?: number
  contentType?: string
  message?: string
  requestId?: string
  timestamp?: string
}
