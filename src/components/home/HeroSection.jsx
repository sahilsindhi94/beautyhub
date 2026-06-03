import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const heroVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
}

export default function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-overlay" />
      <div className="hero-content">
        <motion.div
          className="hero-copy"
          initial="hidden"
          animate="visible"
          variants={heroVariant}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        >
          <span className="eyebrow">Luxury Beauty Collection</span>
          <h1>Discover premium skincare, makeup, haircare and fragrances.</h1>
          <p>
            Experience an elevated beauty ritual with rose gold finishes, luminous formulas,
            and designer favorites curated for a radiant lifestyle.
          </p>
          <div className="hero-actions">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link to="/products" className="button button-primary">
                Shop Now
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link to="/products" className="button button-secondary">
                Explore Collection
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
