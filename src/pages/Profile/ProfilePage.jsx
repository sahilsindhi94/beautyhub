import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import AuthLoadingScreen from '../../components/auth/AuthLoadingScreen'
import { formatOrderDate } from '../../utils/currency'
import { useAuthActions } from '@convex-dev/auth/react'
import { useNavigate } from 'react-router-dom'
import './ProfilePage.css'

export default function ProfilePage() {
  const user = useQuery(api.users.getCurrent)
  const stats = useQuery(api.users.getProfileStats)
  const updateProfile = useMutation(api.users.updateProfile)
  const { signOut } = useAuthActions()
  const navigate = useNavigate()

  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')

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

  const handleEditClick = () => {
    setEditName(user.name)
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (editName.trim() && editName !== user.name) {
      await updateProfile({ name: editName.trim() })
    }
    setIsEditing(false)
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
            {isEditing ? (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', margin: '14px 0 8px' }}>
                <input 
                  type="text" 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)} 
                  style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #e0e0e0', fontSize: '1rem', outlineColor: 'var(--accent)' }}
                  autoFocus
                />
                <button onClick={handleSave} className="button button-primary" style={{ padding: '8px 16px' }}>Save</button>
                <button onClick={() => setIsEditing(false)} className="button button-secondary" style={{ padding: '8px 16px' }}>Cancel</button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <h1 style={{ margin: '14px 0 8px' }}>{user.name}</h1>
                <button onClick={handleEditClick} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.9rem', padding: 0 }}>Edit</button>
              </div>
            )}
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
