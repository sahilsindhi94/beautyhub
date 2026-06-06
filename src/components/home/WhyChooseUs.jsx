import { motion } from 'framer-motion'
import { trustFeatures } from '../../services/homeData'

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: index * 0.08 } }),
}

export default function WhyChooseUs() {
  return (
    <section id="about" className="section why-choose-us">
      <div className="section-header-wrap">
        <p className="section-eyebrow">The BeautyHub Promise</p>
        <h2>Glow Up Guide</h2>
        <p className="section-subtitle">Everything you need to know for that flawless finish.</p>
      </div>
      <div className="trust-grid modern-tips-grid">
        {trustFeatures.map((feature, index) => (
          <motion.article
            key={feature.title}
            className="modern-card glow-effect tip-card"
            custom={index}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ y: -8 }}
            style={{ padding: '32px', textAlign: 'center' }}
          >
            <div className="benefit-icon-wrapper" style={{ fontSize: '3rem', marginBottom: '16px' }}>
              {feature.icon}
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>{feature.title}</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>{feature.description}</p>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
