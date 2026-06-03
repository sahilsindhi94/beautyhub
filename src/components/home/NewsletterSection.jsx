import { motion } from 'framer-motion'

export default function NewsletterSection() {
  return (
    <section id="contact" className="section newsletter-section">
      <div className="newsletter-card">
        <div>
          <p className="section-eyebrow">Subscribe</p>
          <h2>Get exclusive beauty offers and tips.</h2>
          <p>Join our invite-only list for first access to new drops, beauty guides, and premium rewards.</p>
        </div>
        <motion.form
          className="newsletter-form"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <label className="sr-only" htmlFor="newsletter-email">
            Email address
          </label>
          <input id="newsletter-email" type="email" placeholder="Enter your email" />
          <button type="submit" className="button button-primary">
            Subscribe
          </button>
        </motion.form>
      </div>
    </section>
  )
}
