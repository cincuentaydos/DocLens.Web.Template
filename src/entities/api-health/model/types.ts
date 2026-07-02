export type ApiHealthStatus = {
  status: 'ok' | 'error'
  service: string
  environment?: string
  timestamp?: string
}
