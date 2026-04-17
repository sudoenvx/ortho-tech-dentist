import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../lib/firebase'
import { toast } from '../../lib/toastStore'
import { Button } from '../../components/button'
import { Input } from '../../components/input'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim() || !password.trim()) {
      toast.error('Please enter both email and password')
      return
    }

    if (!auth) {
      toast.error('Firebase is not configured')
      return
    }

    try {
      setLoading(true)
      await signInWithEmailAndPassword(auth, email, password)
      toast.success('Login successful!')
      navigate('/')
    } catch (error: any) {
      const errorCode = error.code || 'UNKNOWN_ERROR'
      const errorMessage = error.message || 'An error occurred during login'

      if (errorCode === 'auth/user-not-found') {
        toast.error('No account found with this email')
      } else if (errorCode === 'auth/wrong-password') {
        toast.error('Incorrect password')
      } else if (errorCode === 'auth/invalid-email') {
        toast.error('Invalid email address')
      } else if (errorCode === 'auth/too-many-requests') {
        toast.error('Too many login attempts. Please try again later')
      } else {
        toast.error(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full h-screen bg-[#edecea] flex items-center justify-center bg-linear-to-br from-surface to-surface-raised">
      <div className="w-full max-w-md px-6 py-12 bg-white rounded shadow-xs shadow-secondary/60">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold text-text">Ortho Tech</h1>
            <p className="text-sm text-text-muted">Manager Dashboard Login</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="manager@example.com"
              disabled={loading}
              className='h-8'
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={loading}
              className='h-8'
            />

            <Button
              type="submit"
              className="w-full flex justify-center"
              size='md'
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
