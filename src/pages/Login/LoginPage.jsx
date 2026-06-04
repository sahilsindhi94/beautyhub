import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthActions } from '@convex-dev/auth/react'
import './AuthPage.css'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { signIn } = useAuthActions()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!email || !password) {
      setError('Please enter both email and password.')
      return
    }

    setLoading(true)
    try {
      await signIn('password', { email, password, flow: 'signIn' })
      navigate('/')
    } catch (err) {
      console.error('Sign in error:', err)
      // Generic error message for security, or specific if known. 
      // The Convex provider usually throws errors with messages we can display
      setError(err?.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-page">
      <motion.div
        className="auth-copy"
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45 }}
      >
        <p className="section-eyebrow">Welcome back</p>
        <h1>Sign in to your BeautyHub ritual.</h1>
        <p>Access your saved cart, wishlist, orders, and account details in a secure rose-gold workspace.</p>
      </motion.div>
      <motion.div
        className="auth-card-shell"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
      >
        <div className="clerk-card-box">
          <div className="clerk-card" style={{ padding: '32px', backgroundColor: 'white' }}>
            <h2 className="clerk-title" style={{ marginTop: 0, marginBottom: '8px', fontSize: '1.5rem', fontWeight: 600 }}>Sign In</h2>
            <p className="clerk-subtitle" style={{ marginBottom: '24px', fontSize: '0.95rem' }}>
              to continue to BeautyHub
            </p>

            {error && (
              <div style={{ color: '#d32f2f', backgroundColor: '#ffebee', padding: '12px', borderRadius: '4px', marginBottom: '20px', fontSize: '0.9rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label htmlFor="email" style={{ fontSize: '0.9rem', color: '#4a4a4a', fontWeight: 500 }}>Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid #e0e0e0', fontSize: '1rem', outlineColor: '#b76e79' }}
                  placeholder="you@example.com"
                />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label htmlFor="password" style={{ fontSize: '0.9rem', color: '#4a4a4a', fontWeight: 500 }}>Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid #e0e0e0', fontSize: '1rem', outlineColor: '#b76e79' }}
                />
              </div>

              <button 
                type="submit" 
                className="button clerk-primary-button" 
                style={{ marginTop: '8px', padding: '12px', color: 'white', border: 'none', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 600, transition: 'opacity 0.2s', opacity: loading ? 0.7 : 1 }}
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div style={{ marginTop: '24px', fontSize: '0.9rem', textAlign: 'center', color: '#666' }}>
              Don't have an account?{' '}
              <Link to="/register" className="clerk-link" style={{ fontWeight: 500, textDecoration: 'none' }}>
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
