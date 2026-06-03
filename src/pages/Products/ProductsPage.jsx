import { useState, useMemo, useEffect } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import ProductCard from '../../components/product/ProductCard'
import ProductSkeleton from '../../components/ui/ProductSkeleton'
import './ProductsPage.css' // We might need this for specific layout

// Helper for debouncing
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debouncedValue
}

export default function ProductsPage() {
  const allProducts = useQuery(api.products.getProducts)

  // Filters State
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [priceRange, setPriceRange] = useState('All') // 'Under500', '500-1000', '1000-2000', '2000+'
  const [minRating, setMinRating] = useState(0)
  const [featuredOnly, setFeaturedOnly] = useState(false)
  
  // Sort State
  const [sortOption, setSortOption] = useState('Newest') // 'PriceLowToHigh', 'PriceHighToLow', 'HighestRated', 'Featured'

  useEffect(() => {
    document.title = 'BeautyHub | All Products'
  }, [])

  // Derived state (filtering & sorting)
  const filteredAndSortedProducts = useMemo(() => {
    if (!allProducts) return []

    let result = [...allProducts]

    // 1. Search
    if (debouncedSearchTerm) {
      const lowerQuery = debouncedSearchTerm.toLowerCase()
      result = result.filter(
        p => p.name.toLowerCase().includes(lowerQuery) || 
             p.brand.toLowerCase().includes(lowerQuery) || 
             p.category.toLowerCase().includes(lowerQuery)
      )
    }

    // 2. Category
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory)
    }

    // 3. Price
    if (priceRange !== 'All') {
      result = result.filter(p => {
        if (priceRange === 'Under500') return p.price < 500
        if (priceRange === '500-1000') return p.price >= 500 && p.price <= 1000
        if (priceRange === '1000-2000') return p.price >= 1000 && p.price <= 2000
        if (priceRange === '2000+') return p.price > 2000
        return true
      })
    }

    // 4. Rating
    if (minRating > 0) {
      result = result.filter(p => p.rating >= minRating)
    }

    // 5. Featured Only
    if (featuredOnly) {
      result = result.filter(p => p.featured)
    }

    // 6. Sorting
    switch (sortOption) {
      case 'PriceLowToHigh':
        result.sort((a, b) => a.price - b.price)
        break
      case 'PriceHighToLow':
        result.sort((a, b) => b.price - a.price)
        break
      case 'HighestRated':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'Featured':
        result.sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1))
        break
      case 'Newest':
      default:
        // Already sorted by newest from backend usually, but we can assume ID sorting or _creationTime
        result.sort((a, b) => b._creationTime - a._creationTime)
        break
    }

    return result
  }, [allProducts, debouncedSearchTerm, selectedCategory, priceRange, minRating, featuredOnly, sortOption])

  return (
    <section className="page page-products">
      <div className="page-shell">
        <div className="products-layout">
          
          {/* Sidebar Filters */}
          <aside className="products-sidebar">
            <div className="filter-group">
              <input 
                type="search" 
                placeholder="Search products, brands..." 
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <h3>Categories</h3>
              <ul className="filter-list">
                {['All', 'Makeup', 'Skincare', 'Haircare', 'Fragrance', 'Beauty Tools'].map(cat => (
                  <li key={cat}>
                    <label className="radio-label">
                      <input 
                        type="radio" 
                        name="category" 
                        checked={selectedCategory === cat}
                        onChange={() => setSelectedCategory(cat)}
                      />
                      <span>{cat}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <div className="filter-group">
              <h3>Price Range</h3>
              <ul className="filter-list">
                {[
                  { label: 'All Prices', val: 'All' },
                  { label: 'Under ₹500', val: 'Under500' },
                  { label: '₹500 - ₹1000', val: '500-1000' },
                  { label: '₹1000 - ₹2000', val: '1000-2000' },
                  { label: '₹2000+', val: '2000+' }
                ].map(price => (
                  <li key={price.val}>
                    <label className="radio-label">
                      <input 
                        type="radio" 
                        name="price" 
                        checked={priceRange === price.val}
                        onChange={() => setPriceRange(price.val)}
                      />
                      <span>{price.label}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <div className="filter-group">
              <h3>Rating</h3>
              <ul className="filter-list">
                {[
                  { label: 'Any Rating', val: 0 },
                  { label: '4.0 & Up', val: 4 },
                  { label: '4.5 & Up', val: 4.5 },
                  { label: '5.0 Only', val: 5 }
                ].map(rating => (
                  <li key={rating.val}>
                    <label className="radio-label">
                      <input 
                        type="radio" 
                        name="rating" 
                        checked={minRating === rating.val}
                        onChange={() => setMinRating(rating.val)}
                      />
                      <span>{rating.label}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <div className="filter-group">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={featuredOnly}
                  onChange={(e) => setFeaturedOnly(e.target.checked)}
                />
                <span>Featured Products Only</span>
              </label>
            </div>
          </aside>

          {/* Main Content */}
          <main className="products-main">
            <div className="products-header">
              <h2>All Products {allProducts && `(${filteredAndSortedProducts.length})`}</h2>
              <div className="sort-control">
                <label htmlFor="sort">Sort by:</label>
                <select 
                  id="sort" 
                  value={sortOption} 
                  onChange={(e) => setSortOption(e.target.value)}
                  className="sort-select"
                >
                  <option value="Newest">Newest</option>
                  <option value="PriceLowToHigh">Price: Low to High</option>
                  <option value="PriceHighToLow">Price: High to Low</option>
                  <option value="HighestRated">Highest Rated</option>
                  <option value="Featured">Featured</option>
                </select>
              </div>
            </div>

            {allProducts === undefined ? (
              <div className="product-grid loading-state">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : filteredAndSortedProducts.length === 0 ? (
              <div className="empty-state" style={{ padding: '4rem', textAlign: 'center' }}>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search query.</p>
                <button 
                  className="button button-primary"
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('All')
                    setPriceRange('All')
                    setMinRating(0)
                    setFeaturedOnly(false)
                  }}
                  style={{ marginTop: '1rem' }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="product-grid">
                {filteredAndSortedProducts.map((product, index) => (
                  <ProductCard key={product._id} product={product} index={index} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </section>
  )
}
