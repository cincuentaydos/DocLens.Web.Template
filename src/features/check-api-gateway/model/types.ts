import type { ApiHealthStatus } from '@entities/api-health'

export type ApiGatewayCheckState = {
  loading: boolean
  data: ApiHealthStatus | null
  error: string | null
}
