import { useState } from 'react'

import {
  checkApiGateway,
  CheckApiGatewayButton,
  type ApiGatewayCheckState,
} from '@features/check-api-gateway'
import { UploadFileForm } from '@features/upload-file'
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
      <section className="poc-hero">
        <div className="poc-hero__content">
          <p className="poc-hero__eyebrow">DocLens technical PoC</p>

          <h1 className="poc-hero__title">
            Frontend conectado con API Gateway local mediante floci.
          </h1>

          <p className="poc-hero__description">
            Esta pantalla valida el flujo completo entre React, la configuración
            por entorno, API Gateway local, Lambda y los endpoints de health check
            y subida de archivo.
          </p>

          <div className="poc-hero__badges">
            <span>React + Vite</span>
            <span>API Gateway</span>
            <span>Lambda</span>
            <span>floci local</span>
          </div>
        </div>

        <aside className="poc-hero__summary">
          <span className="poc-hero__summary-label">Validated flow</span>

          <ol className="poc-flow">
            <li>React UI</li>
            <li>VITE_API_BASE_URL</li>
            <li>API Gateway</li>
            <li>Lambda</li>
            <li>200 OK</li>
          </ol>
        </aside>
      </section>

      <section className="poc-grid">
        <article className="poc-card">
          <div className="poc-card__header">
            <div>
              <p className="poc-card__kicker">Endpoint</p>
              <h2 className="poc-card__title">Health check</h2>
            </div>

            <span className="poc-card__pill">GET /health</span>
          </div>

          <p className="poc-card__description">
            Comprueba que el frontend puede comunicarse con el API Gateway local
            generado por floci y recibir una respuesta válida de Lambda.
          </p>

          <div className="poc-card__actions">
            <CheckApiGatewayButton
              loading={state.loading}
              onClick={handleCheckApiGateway}
            />
          </div>

          <ApiStatusPanel data={state.data} error={state.error} />
        </article>

        <article className="poc-card poc-card--highlight">
          <div className="poc-card__header">
            <div>
              <p className="poc-card__kicker">Endpoint</p>
              <h2 className="poc-card__title">File upload</h2>
            </div>

            <span className="poc-card__pill">POST /upload-file</span>
          </div>

          <UploadFileForm />
        </article>
      </section>
    </main>
  )
}
