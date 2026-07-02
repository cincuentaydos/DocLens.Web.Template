import { NavLink, Outlet } from 'react-router-dom'

import { appRoutes } from '@shared/config/routes'
import { siteConfig } from '@shared/config/site'
import { Container } from '@shared/ui/container'

export const AppLayout = () => (
  <div className="app-shell">
    <header className="topbar">
      <Container className="topbar__inner">
        <div className="brand">
          <p className="brand__title">{siteConfig.name}</p>
          <p className="brand__subtitle">{siteConfig.description}</p>
        </div>

        <nav className="nav" aria-label="Main navigation">
          <NavLink
            className={({ isActive }) =>
              isActive ? 'nav__link nav__link--active' : 'nav__link'
            }
            to={appRoutes.home}
            end
          >
            Inicio
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              isActive ? 'nav__link nav__link--active' : 'nav__link'
            }
            to={appRoutes.pocApiCheck}
          >
            API PoC
          </NavLink>
        </nav>
      </Container>
    </header>

    <Outlet />

    <footer className="footer">
      <Container className="footer__inner">
        <p className="footer__copy">{siteConfig.footerCopy}</p>
      </Container>
    </footer>
  </div>
)
