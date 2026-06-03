import { motion } from 'framer-motion'
import { blogPosts } from '../../services/homeData'

export default function BeautyBlog() {
  return (
    <section className="section beauty-blog">
      <div className="section-header-wrap">
        <p className="section-eyebrow">Beauty blog</p>
        <h2>Expert guidance, self-care rituals, and glamour stories.</h2>
      </div>
      <div className="blog-grid">
        {blogPosts.map((post, index) => (
          <motion.article
            key={post.id}
            className="blog-card"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="blog-thumb" style={{ backgroundImage: `url(${post.image})` }} />
            <div className="blog-copy">
              <h3>{post.title}</h3>
              <p>{post.description}</p>
              <a href={post.url} className="blog-link">
                Read More
              </a>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
