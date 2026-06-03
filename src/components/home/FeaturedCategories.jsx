import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { categories } from '../../services/homeData'

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (index) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: index * 0.08 } }),
}

export default function FeaturedCategories() {
  return (
    <section className="section featured-categories">
      <div className="section-header-wrap">
        <p className="section-eyebrow">Shop by category</p>
        <h2>Premium beauty categories for every ritual.</h2>
      </div>
      <div className="category-grid">
        {categories.map((category, index) => (
          <motion.div
            key={category.slug}
            className="category-card"
            custom={index}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
          >
            <div
              className="category-image"
              style={{ backgroundImage: `url(${category.image})` }}
            />
            <div className="category-copy">
              <span>{category.title}</span>
              <p>{category.description}</p>
              <Link to={`/products?category=${category.slug}`} className="category-link">
                Explore
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
