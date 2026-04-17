import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../lib/authContext'
import { toast } from '../lib/toastStore'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-text-muted">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    toast.info('Please log in to continue')
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
