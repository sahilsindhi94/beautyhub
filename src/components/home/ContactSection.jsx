import { useState } from 'react'
import { motion } from 'framer-motion'

export default function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSuccess(true)
    e.target.reset()
    setTimeout(() => setIsSuccess(false), 5000)
  }

  return (
    <section id="contact" className="section contact-section" style={{ padding: '100px 20px', background: 'var(--surface)' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <p className="section-eyebrow">Get In Touch</p>
          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontFamily: 'var(--heading)', marginBottom: '16px' }}>We'd Love to Hear From You</h2>
          <p style={{ color: 'var(--muted)', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem', lineHeight: '1.6' }}>Whether you have a question about products, orders, or anything else, our team is ready to answer all your questions.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '64px', alignItems: 'start' }}>
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}
          >
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--bg-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0, border: '1px solid var(--border)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', fontFamily: 'var(--sans)', fontWeight: 600 }}>Email</h3>
                <p style={{ color: 'var(--text)', fontWeight: 500 }}>support@beautyhub.in</p>
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem', marginTop: '4px' }}>We'll respond within 24 hours.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--bg-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0, border: '1px solid var(--border)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', fontFamily: 'var(--sans)', fontWeight: 600 }}>Phone</h3>
                <p style={{ color: 'var(--text)', fontWeight: 500 }}>+91 9499844194</p>
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem', marginTop: '4px' }}>Mon-Fri from 9am to 6pm.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--bg-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0, border: '1px solid var(--border)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', fontFamily: 'var(--sans)', fontWeight: 600 }}>Office</h3>
                <p style={{ color: 'var(--text)', fontWeight: 500 }}>Godhra, Gujarat - 389001</p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: 'clamp(24px, 5vw, 48px)', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}
            className="glass-panel"
            onSubmit={handleSubmit}
          >
            {isSuccess && (
              <div style={{ padding: '16px 20px', background: '#ecfdf5', color: '#065f46', borderRadius: '12px', border: '1px solid #a7f3d0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <span style={{ fontWeight: 500 }}>Message sent successfully! Our team will get back to you soon.</span>
              </div>
            )}

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 140px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label htmlFor="firstName" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>First Name</label>
                <input id="firstName" type="text" required style={{ padding: '14px 16px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--surface)', outlineColor: 'var(--primary)' }} placeholder="Jane" />
              </div>
              <div style={{ flex: '1 1 140px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label htmlFor="lastName" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>Last Name</label>
                <input id="lastName" type="text" required style={{ padding: '14px 16px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--surface)', outlineColor: 'var(--primary)' }} placeholder="Doe" />
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="email" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>Email</label>
              <input id="email" type="email" required style={{ padding: '14px 16px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--surface)', outlineColor: 'var(--primary)' }} placeholder="jane@example.com" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="message" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>Message</label>
              <textarea id="message" required rows="5" style={{ padding: '14px 16px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--surface)', resize: 'vertical', outlineColor: 'var(--primary)' }} placeholder="How can we help you?"></textarea>
            </div>

            <button type="submit" className="button button-primary" disabled={isSubmitting} style={{ marginTop: '8px', padding: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
              {isSubmitting ? (
                <>
                  <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
                  Sending...
                </>
              ) : (
                'Send Message'
              )}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  )
}
