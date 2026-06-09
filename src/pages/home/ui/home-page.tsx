import { Button } from '@shared/ui/button'
import { Container } from '@shared/ui/container'
import {
  quickStartSteps,
  referenceSections,
  templateHighlights,
} from '@shared/config/template-content'

export const HomePage = () => (
  <main className="page">
    <Container>
      <section className="hero">
        <article className="panel panel--padded">
          <span className="hero__eyebrow">Template listo para reutilizar</span>
          <h1 className="hero__title">React + TypeScript con una base FSD preparada para crecer.</h1>
          <p className="hero__description">
            Este starter deja resueltos el bootstrap, el routing, los aliases y una
            estructura de capas limpia para acelerar la creacion de nuevas webs del
            equipo.
          </p>
          <div className="hero__actions">
            <Button as="a" href="#fsd-structure">
              Ver estructura
            </Button>
            <Button as="a" href="#next-steps" variant="secondary">
              Primeros pasos
            </Button>
          </div>
        </article>

        <aside className="panel status-card">
          <span className="status-card__tag">Base del proyecto</span>
          <h2 className="status-card__title">Lo que ya viene resuelto</h2>
          <ul className="status-card__list">
            {templateHighlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="section" id="fsd-structure">
        <div className="section__header">
          <h2 className="section-title">Mapa base de la arquitectura</h2>
          <p className="section__description">
            Cada capa tiene una responsabilidad clara para que el template escale sin
            mezclar UI, negocio y configuracion.
          </p>
        </div>

        <div className="grid">
          {referenceSections.map((section) => (
            <article className="panel surface" key={section.title}>
              <span className="surface__kicker">{section.kicker}</span>
              <h3 className="surface__title">{section.title}</h3>
              <p className="surface__description">{section.description}</p>
              <div className="surface__content">
                <ul className="list">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="next-steps">
        <div className="section__header">
          <h2 className="section-title">Checklist para arrancar una nueva web</h2>
          <p className="section__description">
            Cambia el contenido de ejemplo y empieza a construir sobre una base comun.
          </p>
        </div>

        <article className="panel surface">
          <ol className="checklist">
            {quickStartSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </article>
      </section>
    </Container>
  </main>
)
