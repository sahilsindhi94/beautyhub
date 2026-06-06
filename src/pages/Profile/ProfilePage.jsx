import { useState, useRef } from 'react'
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
  const generateUploadUrl = useMutation(api.users.generateUploadUrl)
  const updateProfileImage = useMutation(api.users.updateProfileImage)
  const { signOut } = useAuthActions()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [isUploading, setIsUploading] = useState(false)

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

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB")
      return
    }

    // Validate type
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)) {
      alert("Please upload a JPG, PNG, or WEBP image")
      return
    }

    try {
      setIsUploading(true)
      const postUrl = await generateUploadUrl()
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      })
      const { storageId } = await result.json()
      await updateProfileImage({ storageId })
    } catch (error) {
      console.error("Failed to upload image", error)
      alert("Failed to upload image. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <section className="page page-profile" style={{ background: 'var(--bg-soft)', minHeight: '100vh', paddingTop: 0 }}>
      <div className="profile-cover-banner"></div>
      <div className="page-shell" style={{ marginTop: '-80px', position: 'relative', zIndex: 10 }}>
        
        <div className="profile-dashboard">
          <motion.div
            className="profile-card modern-card"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="profile-avatar-wrapper" onClick={() => !isUploading && fileInputRef.current?.click()}>
              <img
                src={user.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                alt={user.name || 'BeautyHub profile'}
                className="profile-avatar glow-effect"
                style={{ opacity: isUploading ? 0.5 : 1 }}
              />
              <div className="profile-avatar-overlay">
                {isUploading ? (
                  <div className="upload-spinner"></div>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef}
                style={{ display: 'none' }} 
                accept="image/jpeg, image/png, image/webp" 
                onChange={handleImageChange} 
              />
            </div>
            
            <div className="profile-main">
              <p className="section-eyebrow">My Profile</p>
              {isEditing ? (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', margin: '14px 0 8px', justifyContent: 'center' }}>
                  <input 
                    type="text" 
                    value={editName} 
                    onChange={(e) => setEditName(e.target.value)} 
                    style={{ padding: '10px 16px', borderRadius: '12px', border: '1px solid var(--border)', fontSize: '1rem', outlineColor: 'var(--primary)' }}
                    autoFocus
                  />
                  <button onClick={handleSave} className="button button-primary" style={{ padding: '10px 16px' }}>Save</button>
                  <button onClick={() => setIsEditing(false)} className="button button-secondary" style={{ padding: '10px 16px' }}>Cancel</button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'center' }}>
                  <h1 style={{ margin: '14px 0 8px', fontSize: '2rem' }}>{user.name}</h1>
                  <button onClick={handleEditClick} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', textDecoration: 'none', fontSize: '0.9rem', padding: 0, fontWeight: '600' }}>Edit</button>
                </div>
              )}
              <p style={{ color: 'var(--muted)' }}>{user.email}</p>
            </div>
            <button type="button" className="button button-secondary" onClick={handleLogout} style={{ marginTop: '32px', width: '100%', maxWidth: '250px' }}>
              Logout
            </button>
          </motion.div>

          <div className="profile-stats-grid">
            <motion.div className="stat-card modern-card glow-effect" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="stat-icon">✨</div>
              <div className="stat-content">
                <span>Member Since</span>
                <strong>{user.createdAt ? formatOrderDate(user.createdAt) : 'Recently'}</strong>
              </div>
            </motion.div>
            
            <motion.div className="stat-card modern-card glow-effect" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="stat-icon">🛍️</div>
              <div className="stat-content">
                <span>Total Orders</span>
                <strong>{stats?.totalOrders || 0}</strong>
              </div>
            </motion.div>
            
            <motion.div className="stat-card modern-card glow-effect" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div className="stat-icon">💖</div>
              <div className="stat-content">
                <span>Wishlist Count</span>
                <strong>{stats?.wishlistCount || 0}</strong>
              </div>
            </motion.div>
            
            <motion.div className="stat-card modern-card glow-effect" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <div className="stat-icon">🛒</div>
              <div className="stat-content">
                <span>Cart Count</span>
                <strong>{stats?.cartCount || 0}</strong>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
