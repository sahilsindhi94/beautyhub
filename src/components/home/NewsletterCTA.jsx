import { motion } from 'framer-motion'
import { useState } from 'react'

export default function NewsletterCTA() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if(email) setSubscribed(true)
  }

  return (
    <section className="section newsletter-cta" style={{ position: 'relative', padding: '80px 24px', background: 'var(--primary-soft)', overflow: 'hidden' }}>
      <div className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 40px', borderRadius: '40px', textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <p className="section-eyebrow" style={{ marginBottom: '16px' }}>Join The Club</p>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '16px', lineHeight: 1.1 }}>Get 15% off your first order</h2>
        <p style={{ color: 'var(--text-soft)', marginBottom: '32px', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto 32px' }}>
          Be the first to know about new drops, exclusive offers, and beauty tips from our experts.
        </p>
        
        {subscribed ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ padding: '20px', background: 'var(--surface)', borderRadius: '20px', display: 'inline-block', color: 'var(--primary)', fontWeight: 'bold' }}>
            ✨ Welcome to the future of beauty! Check your inbox.
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px', maxWidth: '450px', margin: '0 auto', flexDirection: 'column' }}>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ padding: '16px 24px', borderRadius: '100px', border: '1px solid var(--border)', fontSize: '1rem', width: '100%', outlineColor: 'var(--primary)', background: 'var(--surface)' }}
            />
            <button type="submit" className="button button-primary" style={{ width: '100%', padding: '16px', borderRadius: '100px' }}>
              Subscribe Now
            </button>
          </form>
        )}
      </div>
      
      {/* Background decorations */}
      <div style={{ position: 'absolute', top: '-50px', left: '-50px', width: '200px', height: '200px', background: 'var(--primary)', filter: 'blur(80px)', opacity: 0.3, borderRadius: '50%' }} />
      <div style={{ position: 'absolute', bottom: '-50px', right: '-50px', width: '300px', height: '300px', background: 'var(--secondary)', filter: 'blur(100px)', opacity: 0.2, borderRadius: '50%' }} />
    </section>
  )
}
