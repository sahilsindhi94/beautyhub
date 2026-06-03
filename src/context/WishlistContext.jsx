import { createContext, useContext, useState, useEffect } from 'react'

const WishlistContext = createContext()

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState(() => {
    const saved = localStorage.getItem('beautyhub_wishlist')
    return saved ? JSON.parse(saved) : []
  })

  // Generate a random temporary user ID if not exists
  const [deviceId] = useState(() => {
    let id = localStorage.getItem('beautyhub_device_id')
    if (!id) {
      id = 'device_' + Math.random().toString(36).substring(2, 15)
      localStorage.setItem('beautyhub_device_id', id)
    }
    return id
  })

  useEffect(() => {
    localStorage.setItem('beautyhub_wishlist', JSON.stringify(wishlistItems))
    // Here we would sync with Convex using deviceId as the fallback userId
    // e.g., if we were calling mutations directly from context
  }, [wishlistItems])

  const addToWishlist = (product) => {
    setWishlistItems(prev => {
      if (prev.some(item => item._id === product._id)) {
        return prev
      }
      return [...prev, product]
    })
  }

  const removeFromWishlist = (productId) => {
    setWishlistItems(prev => prev.filter(item => item._id !== productId))
  }

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item._id === productId)
  }

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      deviceId
    }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
