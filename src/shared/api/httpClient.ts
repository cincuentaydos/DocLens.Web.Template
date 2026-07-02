import { env } from '@shared/config/env'

export async function httpGet<TResponse>(path: string): Promise<TResponse> {
  const response = await fetch(`${env.apiBaseUrl}${path}`)

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`)
  }

  return response.json() as Promise<TResponse>
}
