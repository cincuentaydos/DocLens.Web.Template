export type ApiHealthCheckStatus = 'ok' | 'error'

export type ApiHealthCheckResult = {
  status: ApiHealthCheckStatus
  httpStatus: number
  service: string
  environment: string
  timestamp: string
}

export type ApiHealthStatus = ApiHealthCheckResult
