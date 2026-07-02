import type { ApiHealthStatus } from '@entities/api-health'

type ApiStatusPanelProps = {
  data: ApiHealthStatus | null
  error: string | null
}

export function ApiStatusPanel({ data, error }: ApiStatusPanelProps) {
  if (error) {
    return (
      <section className="api-status-panel">
        <h2 className="api-status-panel__title">API Gateway status</h2>
        <p className="api-status-panel__error" role="alert">
          Error: {error}
        </p>
      </section>
    )
  }

  if (!data) {
    return (
      <section className="api-status-panel">
        <h2 className="api-status-panel__title">API Gateway status</h2>
        <p className="api-status-panel__text">Not checked yet.</p>
      </section>
    )
  }

  return (
    <section className="api-status-panel">
      <h2 className="api-status-panel__title">API Gateway status</h2>

      <ul className="api-status-panel__list">
        <li>Status: {data.status}</li>
        <li>Service: {data.service}</li>
        <li>Environment: {data.environment ?? 'unknown'}</li>
        <li>Timestamp: {data.timestamp ?? 'not provided'}</li>
      </ul>
    </section>
  )
}
