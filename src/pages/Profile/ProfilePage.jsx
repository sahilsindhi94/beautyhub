import { SignOutButton, useUser } from '@clerk/clerk-react'
import { motion } from 'framer-motion'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import AuthLoadingScreen from '../../components/auth/AuthLoadingScreen'
import { formatOrderDate } from '../../utils/currency'
import { isClerkConfigured } from '../../auth/clerkConfig'
import './ProfilePage.css'

export default function ProfilePage() {
  if (!isClerkConfigured) {
    return (
      <section className="page page-profile">
        <div className="page-shell">
          <div className="profile-card">
            <div className="profile-main">
              <p className="section-eyebrow">Demo Mode</p>
              <h1>Clerk is not configured yet.</h1>
              <p>Add your Clerk environment values and restart the dev server to view a real profile.</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return <ConfiguredProfilePage />
}

function ConfiguredProfilePage() {
  const { user: clerkUser } = useUser()
  const user = useQuery(api.users.getCurrent)
  const stats = useQuery(api.users.getProfileStats)

  if (user === undefined || stats === undefined || user === null) {
    return <AuthLoadingScreen message="Loading your profile..." />
  }

  return (
    <section className="page page-profile">
      <div className="page-shell">
        <motion.div
          className="profile-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <img
            src={user.image || clerkUser?.imageUrl}
            alt={user.name || 'BeautyHub profile'}
            className="profile-avatar"
          />
          <div className="profile-main">
            <p className="section-eyebrow">My Profile</p>
            <h1>{user.name}</h1>
            <p>{user.email}</p>
            <span className="role-pill">{user.role}</span>
          </div>
          <SignOutButton redirectUrl="/login">
            <button type="button" className="button button-primary">
              Logout
            </button>
          </SignOutButton>
        </motion.div>

        <div className="profile-stats">
          <div>
            <span>Member Since</span>
            <strong>{formatOrderDate(user.createdAt)}</strong>
          </div>
          <div>
            <span>Total Orders</span>
            <strong>{stats.totalOrders}</strong>
          </div>
          <div>
            <span>Wishlist Count</span>
            <strong>{stats.wishlistCount}</strong>
          </div>
          <div>
            <span>Cart Count</span>
            <strong>{stats.cartCount}</strong>
          </div>
        </div>
      </div>
    </section>
  )
}
