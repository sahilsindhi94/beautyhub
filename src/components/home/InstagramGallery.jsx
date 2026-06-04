import { motion } from 'framer-motion'
import { instagramFeed } from '../../services/homeData'

export default function InstagramGallery() {
  return (
    <section className="section instagram-section">
      <div className="section-header-wrap">
        <p className="section-eyebrow">Instagram</p>
        <h2>Explore beauty moments from our community.</h2>
      </div>
      <div className="instagram-grid">
        {instagramFeed.map((item) => (
          <motion.div
            key={item.id}
            className="instagram-item"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.25 }}
            style={{ backgroundImage: `url(${item.image})` }}
          >
            <div className="instagram-overlay">@beautyhub</div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
