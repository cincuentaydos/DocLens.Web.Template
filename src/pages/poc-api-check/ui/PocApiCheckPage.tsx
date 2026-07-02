import { useState } from 'react'

import {
  checkApiGateway,
  CheckApiGatewayButton,
  type ApiGatewayCheckState,
} from '@features/check-api-gateway'
import { ApiStatusPanel } from '@widgets/api-status-panel'

import './poc-api-check-page.css'

export function PocApiCheckPage() {
  const [state, setState] = useState<ApiGatewayCheckState>({
    loading: false,
    data: null,
    error: null,
  })

  async function handleCheckApiGateway() {
    setState({
      loading: true,
      data: null,
      error: null,
    })

    try {
      const data = await checkApiGateway()

      setState({
        loading: false,
        data,
        error: null,
      })
    } catch (error) {
      setState({
        loading: false,
        data: null,
        error:
          error instanceof Error
            ? error.message
            : 'Unexpected error while checking API Gateway',
      })
    }
  }

  return (
    <main className="poc-api-check-page">
      <p className="poc-api-check-page__eyebrow">Technical validation</p>

      <h1 className="poc-api-check-page__title">DocLens API Gateway PoC</h1>

      <p className="poc-api-check-page__description">
        Validate the initial end-to-end flow between the React front-end, the
        environment-based API configuration and the API Gateway health endpoint.
      </p>

      <div className="poc-api-check-page__actions">
        <CheckApiGatewayButton
          loading={state.loading}
          onClick={handleCheckApiGateway}
        />
      </div>

      <ApiStatusPanel data={state.data} error={state.error} />
    </main>
  )
}
