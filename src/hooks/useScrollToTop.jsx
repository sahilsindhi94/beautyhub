import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function useScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    // If there is a hash, smooth scroll to it
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash.substring(1))
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100) // Slight delay to ensure DOM is ready
      return
    }
    // Otherwise scroll to top
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname, hash])
}
