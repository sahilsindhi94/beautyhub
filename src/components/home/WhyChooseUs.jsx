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
        <p className="section-eyebrow">Why choose us</p>
        <h2>Every touchpoint reflects premium beauty service.</h2>
      </div>
      <div className="trust-grid">
        {trustFeatures.map((feature, index) => (
          <motion.article
            key={feature.title}
            className="trust-card"
            custom={index}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <span className="trust-icon">{feature.icon}</span>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
