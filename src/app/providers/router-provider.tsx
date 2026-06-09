import { BrowserRouter } from 'react-router-dom'

import { AppRouter } from '@app/routes/app-router'

export const AppRouterProvider = () => (
  <BrowserRouter>
    <AppRouter />
  </BrowserRouter>
)
