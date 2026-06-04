import { SignUp, useUser } from '@clerk/clerk-react'
import { Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { isClerkConfigured } from '../../auth/clerkConfig'
import '../Login/AuthPage.css'

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

export default function RegisterPage() {
  if (!isClerkConfigured) {
    return (
      <section className="auth-page">
        <div className="auth-copy">
          <p className="section-eyebrow">Clerk setup needed</p>
          <h1>Your website is running in demo mode.</h1>
          <p>Set VITE_CLERK_PUBLISHABLE_KEY in .env.local to activate registration and protected auth.</p>
        </div>
      </section>
    )
  }

  return <ConfiguredRegisterPage />
}

function ConfiguredRegisterPage() {
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
        <p className="section-eyebrow">Join BeautyHub</p>
        <h1>Create your secure beauty profile.</h1>
        <p>Email sign up, verification, password recovery, and protected shopping flows are handled by Clerk.</p>
      </motion.div>
      <motion.div
        className="auth-card-shell"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
      >
        <SignUp
          routing="path"
          path="/register"
          signInUrl="/login"
          fallbackRedirectUrl="/"
          appearance={clerkAppearance}
        />
      </motion.div>
    </section>
  )
}
