import { Link } from 'react-router-dom'

import { appRoutes } from '@shared/config/routes'
import { Button } from '@shared/ui/button'
import { Container } from '@shared/ui/container'

export const NotFoundPage = () => (
  <main className="page not-found">
    <Container>
      <section className="panel panel--padded not-found__card">
        <span className="hero__eyebrow">404</span>
        <h1 className="hero__title">La ruta no existe en este template.</h1>
        <p className="hero__description">
          Usa esta pagina como base para tu experiencia de error o redirige a la home
          del proyecto que construyas sobre el template.
        </p>
        <div className="hero__actions">
          <Button as={Link} to={appRoutes.home}>
            Volver al inicio
          </Button>
        </div>
      </section>
    </Container>
  </main>
)
