const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/v1'

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || 'Login failed')
  }
  return res.json()
}

export async function register(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || 'Registration failed')
  }
  return res.json()
}

export async function getMe(token: string) {
  const res = await fetch(`${API_BASE}/auth/me?token=${token}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) {
    throw new Error('Failed to fetch user profile')
  }
  return res.json()
}
