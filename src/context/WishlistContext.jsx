/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'
import { useConvexAuth, useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'

const WishlistContext = createContext()

function ConfiguredWishlistProvider({ children }) {
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth()
  const remoteItems = useQuery(api.wishlist.getWishlist, authLoading || !isAuthenticated ? 'skip' : {})
  const addWishlistItem = useMutation(api.wishlist.addToWishlist)
  const removeWishlistItem = useMutation(api.wishlist.removeFromWishlist)
  const [error, setError] = useState('')

  const wishlistItems = useMemo(() => {
    if (!remoteItems) return []
    return remoteItems
      .filter((item) => item.product)
      .map((item) => ({
        ...item.product,
        wishlistItemId: item._id,
      }))
  }, [remoteItems])

  const runWishlistAction = async (action) => {
    try {
      setError('')
      return await action()
    } catch {
      setError('Unable to update your wishlist. Please try again.')
      return null
    }
  }

  const addToWishlist = (product) =>
    !isAuthenticated
      ? Promise.resolve(setError('Please sign in to update your wishlist.'))
      : runWishlistAction(() => addWishlistItem({ productId: product._id }))

  const removeFromWishlist = (productId) =>
    !isAuthenticated
      ? Promise.resolve(setError('Please sign in to update your wishlist.'))
      : runWishlistAction(() => removeWishlistItem({ productId }))

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item._id === productId)
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        isLoading: authLoading || (isAuthenticated && remoteItems === undefined),
        error,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

function DemoWishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState(() => {
    const saved = localStorage.getItem('beautyhub_wishlist')
    return saved ? JSON.parse(saved) : []
  })
  const [error, setError] = useState('')

  const persist = (nextItems) => {
    localStorage.setItem('beautyhub_wishlist', JSON.stringify(nextItems))
    return nextItems
  }

  const addToWishlist = (product) => {
    setError('')
    setWishlistItems((current) =>
      persist(current.some((item) => item._id === product._id) ? current : [...current, product])
    )
  }

  const removeFromWishlist = (productId) => {
    setWishlistItems((current) => persist(current.filter((item) => item._id !== productId)))
  }

  const isInWishlist = (productId) => wishlistItems.some((item) => item._id === productId)

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        isLoading: false,
        error,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function WishlistProvider(props) {
  const { isAuthenticated } = useConvexAuth()
  return isAuthenticated ? <ConfiguredWishlistProvider {...props} /> : <DemoWishlistProvider {...props} />
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
