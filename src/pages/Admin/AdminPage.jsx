import { motion } from 'framer-motion'
import { NavLink, Outlet } from 'react-router-dom'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import './AdminPage.css'

const adminLinks = [
  { to: '/admin', label: 'Dashboard', end: true, roles: ['admin', 'manager'] },
  { to: '/admin/products', label: 'Products', roles: ['admin', 'manager'] },
  { to: '/admin/categories', label: 'Categories', roles: ['admin', 'manager'] },
  { to: '/admin/orders', label: 'Orders', roles: ['admin', 'manager'] },
  { to: '/admin/users', label: 'Users', roles: ['admin'] },
  { to: '/admin/reviews', label: 'Reviews', roles: ['admin', 'manager'] },
  { to: '/admin/coupons', label: 'Coupons', roles: ['admin', 'manager'] },
  { to: '/admin/analytics', label: 'Analytics', roles: ['admin', 'manager'] },
  { to: '/admin/settings', label: 'Settings', roles: ['admin'] },
]

export function AdminPanel({ title = 'Admin Dashboard' }) {
  return (
    <motion.div
      className="admin-panel"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <p className="section-eyebrow">BeautyHub Control</p>
      <h1>{title}</h1>
      <p>Secure management tools are ready for role-based workflows.</p>
    </motion.div>
  )
}

export default function AdminPage() {
  const user = useCurrentUser()
  const visibleLinks = adminLinks.filter((link) => link.roles.includes(user?.role))

  return (
    <section className="page page-admin">
      <div className="page-shell admin-shell">
        <aside className="admin-sidebar">
          <h2>{user?.role === 'admin' ? 'Admin' : 'Management'}</h2>
          {visibleLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => (isActive ? 'admin-link active' : 'admin-link')}
            >
              {link.label}
            </NavLink>
          ))}
        </aside>
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </section>
  )
}
