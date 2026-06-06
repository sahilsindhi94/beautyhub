import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import HeroSection from '../../components/home/HeroSection'
import ProductListSection from '../../components/home/ProductListSection'
import FeaturedCategories from '../../components/home/FeaturedCategories'
import WhyChooseUs from '../../components/home/WhyChooseUs'
import Testimonials from '../../components/home/Testimonials'
import ContactSection from '../../components/home/ContactSection'
import InstagramGallery from '../../components/home/InstagramGallery'
import NewsletterCTA from '../../components/home/NewsletterCTA'
import './HomePage.css'

export default function HomePage() {
  const allProducts = useQuery(api.products.getProducts)
  
  // Create safe slices for the UI if products are loaded
  const trendingProducts = allProducts ? allProducts.slice(0, 4) : []
  const bestSellers = allProducts ? allProducts.slice(4, 8) : []

  return (
    <div className="home-page">
      <HeroSection />
      
      <main className="homepage-contents">
        <ProductListSection 
          title="Trending Now" 
          subtitle="Viral products everyone is talking about."
          eyebrow="On the For You Page"
          products={trendingProducts}
          isLoading={allProducts === undefined}
        />
        
        <ProductListSection 
          title="Best Sellers" 
          subtitle="Our most loved formulas."
          eyebrow="Cult Favorites"
          products={bestSellers}
          isLoading={allProducts === undefined}
        />
        
        <FeaturedCategories />
        <WhyChooseUs />
        <Testimonials />
        <ContactSection />
        <InstagramGallery />
        <NewsletterCTA />
      </main>
    </div>
  )
}
