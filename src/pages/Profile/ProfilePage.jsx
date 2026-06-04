import { motion } from 'framer-motion'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import AuthLoadingScreen from '../../components/auth/AuthLoadingScreen'
import { formatOrderDate } from '../../utils/currency'
import { useAuthActions } from '@convex-dev/auth/react'
import { useNavigate } from 'react-router-dom'
import './ProfilePage.css'

export default function ProfilePage() {
  const user = useQuery(api.users.getCurrent)
  const stats = useQuery(api.users.getProfileStats)
  const { signOut } = useAuthActions()
  const navigate = useNavigate()

  if (user === undefined || stats === undefined) {
    return <AuthLoadingScreen message="Loading your profile..." />
  }

  if (user === null) {
    return null
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/')
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
            src={user.image || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
            alt={user.name || 'BeautyHub profile'}
            className="profile-avatar"
          />
          <div className="profile-main">
            <p className="section-eyebrow">My Profile</p>
            <h1>{user.name}</h1>
            <p>{user.email}</p>
          </div>
          <button type="button" className="button button-primary" onClick={handleLogout} style={{ marginTop: '24px' }}>
            Logout
          </button>
        </motion.div>

        <div className="profile-stats">
          <div>
            <span>Member Since</span>
            <strong>{user.createdAt ? formatOrderDate(user.createdAt) : 'Recently'}</strong>
          </div>
          <div>
            <span>Total Orders</span>
            <strong>{stats?.totalOrders || 0}</strong>
          </div>
          <div>
            <span>Wishlist Count</span>
            <strong>{stats?.wishlistCount || 0}</strong>
          </div>
          <div>
            <span>Cart Count</span>
            <strong>{stats?.cartCount || 0}</strong>
          </div>
        </div>
      </div>
    </section>
  )
}
