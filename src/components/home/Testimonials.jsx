import { motion } from 'framer-motion'
import { testimonials } from '../../services/homeData'

export default function Testimonials() {
  return (
    <section className="section testimonials-section">
      <div className="section-header-wrap">
        <p className="section-eyebrow">Testimonials</p>
        <h2>Customers share their luxury beauty experience.</h2>
      </div>
      <div className="testimonial-grid">
        {testimonials.map((item, index) => (
          <motion.article
            key={item.id}
            className="testimonial-card"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
          >
            <div className="testimonial-top">
              <img src={item.image} alt={item.name} className="testimonial-avatar" />
              <div>
                <strong>{item.name}</strong>
                <span>{item.role}</span>
              </div>
            </div>
            <div className="testimonial-rating">{Array.from({ length: item.rating }).map((_, starIndex) => (
              <span key={starIndex}>★</span>
            ))}</div>
            <p>{item.review}</p>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
