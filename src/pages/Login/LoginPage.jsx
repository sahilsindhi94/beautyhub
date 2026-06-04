import { SignIn, useUser } from '@clerk/clerk-react'
import { Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { isClerkConfigured } from '../../auth/clerkConfig'
import './AuthPage.css'

const clerkAppearance = {
  elements: {
    cardBox: 'clerk-card-box',
    card: 'clerk-card',
    headerTitle: 'clerk-title',
    headerSubtitle: 'clerk-subtitle',
    formButtonPrimary: 'clerk-primary-button',
    footerActionLink: 'clerk-link',
  },
}

export default function LoginPage() {
  if (!isClerkConfigured) {
    return (
      <section className="auth-page">
        <div className="auth-copy">
          <p className="section-eyebrow">Clerk setup needed</p>
          <h1>Add your Clerk key to enable login.</h1>
          <p>Set VITE_CLERK_PUBLISHABLE_KEY in .env.local, then restart the Vite dev server.</p>
        </div>
      </section>
    )
  }

  return <ConfiguredLoginPage />
}

function ConfiguredLoginPage() {
  const { isSignedIn } = useUser()

  if (isSignedIn) {
    return <Navigate to="/" replace />
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
        <SignIn
          routing="path"
          path="/login"
          signUpUrl="/register"
          fallbackRedirectUrl="/"
          appearance={clerkAppearance}
        />
      </motion.div>
    </section>
  )
}
