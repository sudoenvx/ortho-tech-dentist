import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import AppShell from './components/layout/app-shell'
import Dashboard from './pages/dashboard/dashboard'
import ManagersPage from './pages/dashboard/managers'
import WebsitesPage from './pages/dashboard/websites'
import LoginPage from './pages/login/login'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <AppShell>
        <Dashboard />
      </AppShell>
    ),
  },
  {
    path: '/managers',
    element: (
      <AppShell>
        <ManagersPage />
      </AppShell>
    ),
  },
  {
    path: '/websites',
    element: (
      <AppShell>
        <WebsitesPage />
      </AppShell>
    ),
  },
])

export default router
