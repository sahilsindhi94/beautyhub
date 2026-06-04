import { motion } from 'framer-motion'

export default function AuthLoadingScreen({ message = 'Preparing your BeautyHub experience...' }) {
  return (
    <section className="auth-loading-screen">
      <motion.div
        className="auth-loading-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="auth-loader" />
        <h1>BeautyHub</h1>
        <p>{message}</p>
      </motion.div>
    </section>
  )
}
