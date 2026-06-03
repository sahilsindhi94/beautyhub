import AnnouncementBar from '../../components/home/AnnouncementBar'
import HeroSection from '../../components/home/HeroSection'
import FeaturedCategories from '../../components/home/FeaturedCategories'
import FeaturedProducts from '../../components/home/FeaturedProducts'
import WhyChooseUs from '../../components/home/WhyChooseUs'
import BrandShowcase from '../../components/home/BrandShowcase'
import BeautyBlog from '../../components/home/BeautyBlog'
import Testimonials from '../../components/home/Testimonials'
import NewsletterSection from '../../components/home/NewsletterSection'
import InstagramGallery from '../../components/home/InstagramGallery'
import './HomePage.css'

export default function HomePage() {
  return (
    <div className="home-page">
      <AnnouncementBar />
      <HeroSection />
      <main className="homepage-contents">
        <FeaturedCategories />
        <FeaturedProducts />
        <WhyChooseUs />
        <BrandShowcase />
        <BeautyBlog />
        <Testimonials />
        <NewsletterSection />
        <InstagramGallery />
      </main>
    </div>
  )
}
