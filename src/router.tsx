import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import AppShell from './components/layout/app-shell'
import { ProtectedRoute } from './components/protected-route'
import Dashboard from './pages/dashboard/dashboard'
import ManagersPage from './pages/dashboard/managers'
import LoginPage from './pages/login/login'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppShell>
          <Dashboard />
        </AppShell>
      </ProtectedRoute>
    ),
  },
  {
    path: '/managers',
    element: (
      <ProtectedRoute>
        <AppShell>
          <ManagersPage />
        </AppShell>
      </ProtectedRoute>
    ),
  },
])

export default router
