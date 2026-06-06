import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import AuthLoadingScreen from '../../components/auth/AuthLoadingScreen'
import { formatOrderDate } from '../../utils/currency'
import { useAuthActions } from '@convex-dev/auth/react'
import { useNavigate, Link } from 'react-router-dom'
import './ProfilePage.css'

export default function ProfilePage() {
  const user = useQuery(api.users.getCurrent)
  const stats = useQuery(api.users.getProfileStats)
  const recentOrders = useQuery(api.orders.getOrders)
  const wishlistItems = useQuery(api.wishlist.getWishlist)
  
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

  // Calculate profile completeness
  const completeness = user ? [user.name, user.email, user.image, user.phone, user.address].filter(Boolean).length * 20 : 0;

  return (
    <section className="page page-profile premium-profile-bg">
      <div className="profile-cover-banner"></div>
      <div className="page-shell premium-dashboard">
        
        {/* Sidebar / Left Column */}
        <aside className="dashboard-sidebar">
          <motion.div
            className="glass-panel profile-hero-card"
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
              {isEditing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '14px 0 16px', width: '100%' }}>
                  <input 
                    type="text" 
                    value={editName} 
                    onChange={(e) => setEditName(e.target.value)} 
                    style={{ padding: '10px 16px', borderRadius: '12px', border: '1px solid var(--border)', fontSize: '1rem', outlineColor: 'var(--primary)', textAlign: 'center' }}
                    autoFocus
                  />
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <button onClick={handleSave} className="button button-primary" style={{ padding: '8px 16px', borderRadius: '100px' }}>Save</button>
                    <button onClick={() => setIsEditing(false)} className="button button-secondary" style={{ padding: '8px 16px', borderRadius: '100px', background: 'transparent' }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <h1 className="profile-name">{user.name}</h1>
                  <button onClick={handleEditClick} className="edit-profile-btn">Edit Profile</button>
                </div>
              )}
              <p className="profile-email">{user.email}</p>
            </div>
            
            <div className="completeness-tracker">
              <div className="completeness-header">
                <span>Profile Completion</span>
                <strong>{completeness}%</strong>
              </div>
              <div className="completeness-bar-bg">
                <div className="completeness-bar-fill" style={{ width: `${completeness}%` }}></div>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-soft)', marginTop: '8px', textAlign: 'center' }}>Add your phone & address to complete your profile.</p>
            </div>

            <button type="button" className="button premium-logout-btn" onClick={handleLogout}>
              Sign Out
            </button>
          </motion.div>
        </aside>

        {/* Main Dashboard Grid */}
        <main className="dashboard-main">
          {/* Stats Row */}
          <div className="dashboard-stats-grid">
            <motion.div className="glass-panel stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="stat-icon premium-icon">🛍️</div>
              <div className="stat-content">
                <span>Total Orders</span>
                <strong>{stats?.totalOrders || 0}</strong>
              </div>
            </motion.div>
            
            <motion.div className="glass-panel stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="stat-icon premium-icon">💖</div>
              <div className="stat-content">
                <span>Wishlist</span>
                <strong>{stats?.wishlistCount || 0}</strong>
              </div>
            </motion.div>
            
            <motion.div className="glass-panel stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div className="stat-icon premium-icon">🛒</div>
              <div className="stat-content">
                <span>In Cart</span>
                <strong>{stats?.cartCount || 0}</strong>
              </div>
            </motion.div>
          </div>

          <div className="dashboard-split-panels">
            {/* Recent Orders */}
            <motion.div className="glass-panel dashboard-panel" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <div className="panel-header">
                <h3>Recent Orders</h3>
                <Link to="/orders" className="panel-link">View All →</Link>
              </div>
              <div className="panel-body">
                {recentOrders && recentOrders.length > 0 ? (
                  <ul className="recent-order-list">
                    {recentOrders.slice(0, 3).map(order => (
                      <li key={order._id} className="recent-order-item">
                        <div className="order-item-left">
                          <span className="order-number">{order.orderNumber}</span>
                          <span className="order-date">{formatOrderDate(order.createdAt)}</span>
                        </div>
                        <div className="order-item-right">
                          <span className={`order-status-badge ${order.status.toLowerCase()}`}>{order.status}</span>
                          <span className="order-total">₹{order.total.toFixed(2)}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="empty-panel-state">
                    <p>No orders yet.</p>
                    <Link to="/products" className="button button-primary" style={{ padding: '8px 16px', borderRadius: '100px', fontSize: '0.9rem' }}>Shop Now</Link>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Wishlist Summary */}
            <motion.div className="glass-panel dashboard-panel" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <div className="panel-header">
                <h3>My Wishlist</h3>
                <Link to="/wishlist" className="panel-link">View All →</Link>
              </div>
              <div className="panel-body">
                {wishlistItems && wishlistItems.length > 0 ? (
                  <div className="mini-wishlist-grid">
                    {wishlistItems.slice(0, 4).map(item => (
                      <div key={item._id} className="mini-wishlist-item" style={{ backgroundImage: `url(${item.product?.image})` }}></div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-panel-state">
                    <p>Your wishlist is empty.</p>
                    <Link to="/products" className="button button-primary" style={{ padding: '8px 16px', borderRadius: '100px', fontSize: '0.9rem' }}>Discover Products</Link>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </main>

      </div>
    </section>
  )
}
