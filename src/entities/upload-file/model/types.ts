export type UploadFileResult = {
  status: 'ok' | 'error'
  httpStatus: number
  uploaded: boolean
  service: string
  message: string
  fileName: string
  contentType: string
  parseMode: string
  size: number
  timestamp: string
}
