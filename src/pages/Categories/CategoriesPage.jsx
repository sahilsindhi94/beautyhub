import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { categories } from '../../services/homeData'

export default function CategoriesPage() {
  return (
    <section className="page page-categories" style={{ paddingTop: '120px', paddingBottom: '80px', background: 'var(--bg-soft)', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: '3rem', marginBottom: '16px' }}>Shop by Category</h1>
          <p style={{ color: 'var(--muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>Explore our curated collection of premium beauty products across all categories.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '32px' }}>
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
                  height: '400px',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  textDecoration: 'none',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
                }}
                className="category-card glow-effect"
              >
                <div 
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url(${category.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                  }}
                  className="category-bg"
                />
                <div 
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)',
                  }}
                />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '32px', color: 'white' }}>
                  <h2 style={{ fontSize: '2rem', fontFamily: 'var(--serif)', marginBottom: '8px' }}>{category.title}</h2>
                  <p style={{ fontSize: '1rem', opacity: 0.9, fontWeight: 500 }}>{category.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
      <style>{`
        .category-card:hover .category-bg {
          transform: scale(1.08);
        }
      `}</style>
    </section>
  )
}
