import type { ApiHealthStatus } from '@entities/api-health'
import { ENDPOINTS } from '@shared/api/endpoints'
import { httpGet } from '@shared/api/httpClient'

export function checkApiGateway(): Promise<ApiHealthStatus> {
  return httpGet<ApiHealthStatus>(ENDPOINTS.health)
}
