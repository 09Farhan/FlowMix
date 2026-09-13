'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { login } from '../../../lib/api'
import { useAuthStore } from '../../../lib/auth'
import Link from 'next/link'
import { Button } from '@flowmix/ui'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const setAuth = useAuthStore((state) => state.setAuth)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const data = await login(email, password)
      // Decode JWT slightly hacky for MVP since we don't have a jwt decode lib installed yet
      const payload = JSON.parse(atob(data.access_token.split('.')[1]))
      setAuth({ id: payload.id, email: payload.sub }, data.access_token)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink-950 text-paper-50 flex items-center justify-center p-4 selection:bg-violet-500/30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        <div className="bg-ink-900 border border-ink-800 rounded-2xl p-8 shadow-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-semibold mb-2">Welcome Back</h1>
            <p className="text-ink-300">Sign in to FlowMix to continue</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink-300 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-ink-950 border border-ink-800 rounded-xl px-4 py-3 text-paper-50 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                placeholder="you@example.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-ink-300 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-ink-950 border border-ink-800 rounded-xl px-4 py-3 text-paper-50 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            <div className="pt-2">
              <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center text-ink-400 text-sm">
            Don't have an account?{' '}
            <Link href="/register" className="text-violet-400 hover:text-violet-300 transition-colors">
              Sign up for free
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
