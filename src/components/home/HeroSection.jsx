import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const heroVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
}

export default function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-bg-gradient gradient-1" />
      <div className="hero-bg-gradient gradient-2" />
      <div className="hero-bg-mesh" />
      
      <div className="hero-content">
        <motion.div
          className="hero-copy"
          initial="hidden"
          animate="visible"
          variants={heroVariant}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.div 
            className="trendy-badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5, type: 'spring' }}
          >
            ✨ New Drops Just Landed
          </motion.div>
          
          <h1 className="hero-title">
            Your glow era <br/> <span className="gradient-text">starts here.</span>
          </h1>
          
          <p className="hero-subtitle">
            Shop the internet's most viral beauty, skincare, and makeup. 
            Because you deserve to look as good as you feel.
          </p>
          
          <div className="hero-actions">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/products" className="button button-primary">
                Shop Trending Now
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/products" className="button button-secondary">
                Take the Quiz
              </Link>
            </motion.div>
          </div>
        </motion.div>

        <motion.div 
          className="hero-image-container"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="hero-image-wrapper">
            <img src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop" alt="Premium beauty model with glowing skin" className="main-hero-image" />
            
            <motion.div 
              className="floating-product-card glow-effect"
              initial={{ y: 20 }}
              animate={{ y: -10 }}
              transition={{ repeat: Infinity, repeatType: 'reverse', duration: 3, ease: 'easeInOut' }}
            >
              <img src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=200&auto=format&fit=crop" alt="Serum" />
              <div>
                <h5>Glow Serum</h5>
                <p>₹2,400</p>
              </div>
            </motion.div>

            <motion.div 
              className="floating-review-card glow-effect"
              initial={{ y: -20 }}
              animate={{ y: 10 }}
              transition={{ repeat: Infinity, repeatType: 'reverse', duration: 4, ease: 'easeInOut' }}
            >
              <div className="stars">★★★★★</div>
              <p>"Literally obsessed! It gives glass skin."</p>
              <span>— @skincarejunkie</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
