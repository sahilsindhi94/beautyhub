import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { categories } from '../../services/homeData'

export default function CategoriesPage() {
  return (
    <section className="page page-categories" style={{ paddingTop: '120px', paddingBottom: '80px', background: 'var(--surface)', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h1 style={{ fontFamily: 'var(--heading)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.03em', lineHeight: 1.1 }}>Shop by Category</h1>
          <p style={{ color: 'var(--text-soft)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto', fontFamily: 'var(--sans)', lineHeight: 1.6 }}>Explore our curated collection of premium beauty products across all categories.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' }}>
          {categories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Link 
                to={`/products?category=${category.slug}`} 
                style={{ 
                  display: 'block',
                  position: 'relative',
                  height: '500px',
                  borderRadius: '32px',
                  overflow: 'hidden',
                  textDecoration: 'none',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.08)'
                }}
                className="category-card"
              >
                <div 
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url(${category.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transition: 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                  }}
                  className="category-bg"
                />
                <div 
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(255, 92, 168, 0.4) 0%, transparent 70%)',
                    transition: 'opacity 0.4s ease',
                    opacity: 0.8
                  }}
                  className="category-gradient"
                />
                <div 
                  className="glass-panel"
                  style={{ 
                    position: 'absolute', 
                    bottom: '24px', 
                    left: '24px', 
                    right: '24px', 
                    padding: '24px', 
                    color: 'var(--text)',
                    borderRadius: '24px',
                    transition: 'transform 0.4s ease, background 0.4s ease',
                    background: 'rgba(255, 255, 255, 0.85)'
                  }}
                >
                  <h2 style={{ fontSize: '2rem', fontFamily: 'var(--heading)', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.02em', color: 'var(--text)' }}>{category.title}</h2>
                  <p style={{ fontSize: '1.05rem', color: 'var(--text-soft)', fontWeight: 500, margin: 0 }}>{category.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
      <style>{`
        .category-card:hover .category-bg {
          transform: scale(1.1);
        }
        .category-card:hover .category-gradient {
          opacity: 1;
        }
        .category-card:hover .glass-panel {
          transform: translateY(-8px);
          background: rgba(255, 255, 255, 0.95);
        }
      `}</style>
    </section>
  )
}
