import type { UploadFileResult } from '@entities/upload-file'

export type UploadFileState = {
  loading: boolean
  data: UploadFileResult | null
  error: string | null
}
