import { motion } from 'framer-motion'
import { brands } from '../../services/homeData'

export default function BrandShowcase() {
  return (
    <section className="section brand-showcase">
      <div className="section-header-wrap">
        <p className="section-eyebrow">Featured brands</p>
        <h2>Designer names trusted by beauty connoisseurs.</h2>
      </div>
      <div className="brand-row">
        {brands.map((brand) => (
          <motion.div
            key={brand.name}
            className="brand-item"
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ duration: 0.25 }}
          >
            <img src={brand.logo} alt={brand.name} />
            <span>{brand.name}</span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
