import { Route, Routes } from 'react-router-dom'

import { HomePage } from '@pages/home'
import { NotFoundPage } from '@pages/not-found'
import { appRoutes } from '@shared/config/routes'
import { AppLayout } from '@widgets/app-layout'

export const AppRouter = () => (
  <Routes>
    <Route element={<AppLayout />}>
      <Route path={appRoutes.home} element={<HomePage />} />
      <Route path={appRoutes.notFound} element={<NotFoundPage />} />
    </Route>
  </Routes>
)
