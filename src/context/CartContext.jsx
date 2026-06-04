/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'
import { useConvexAuth, useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { isClerkConfigured } from '../auth/clerkConfig'

const CartContext = createContext()

function ConfiguredCartProvider({ children }) {
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth()
  const remoteItems = useQuery(api.cart.getCart, authLoading || !isAuthenticated ? 'skip' : {})
  const addCartItem = useMutation(api.cart.addToCart)
  const updateCartQuantity = useMutation(api.cart.updateQuantity)
  const removeCartItem = useMutation(api.cart.removeFromCart)
  const clearRemoteCart = useMutation(api.cart.clearCart)
  const [error, setError] = useState('')

  const cartItems = useMemo(() => {
    if (!remoteItems) return []
    return remoteItems
      .filter((item) => item.product)
      .map((item) => ({
        ...item.product,
        cartItemId: item._id,
        quantity: item.quantity,
      }))
  }, [remoteItems])

  const runCartAction = async (action) => {
    try {
      setError('')
      return await action()
    } catch {
      setError('Unable to update your cart. Please try again.')
      return null
    }
  }

  const addToCart = (product, quantity = 1) =>
    !isAuthenticated
      ? Promise.resolve(setError('Please sign in to update your cart.'))
      : runCartAction(() => addCartItem({ productId: product._id, quantity }))

  const removeFromCart = (productId) =>
    !isAuthenticated
      ? Promise.resolve(setError('Please sign in to update your cart.'))
      : runCartAction(() => removeCartItem({ productId }))

  const updateQuantity = (productId, quantity) =>
    !isAuthenticated
      ? Promise.resolve(setError('Please sign in to update your cart.'))
      : runCartAction(() => updateCartQuantity({ productId, quantity }))

  const clearCart = () =>
    !isAuthenticated
      ? Promise.resolve(setError('Please sign in to update your cart.'))
      : runCartAction(() => clearRemoteCart())

  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }, [cartItems])

  const itemCount = useMemo(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0)
  }, [cartItems])

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        itemCount,
        isLoading: authLoading || (isAuthenticated && remoteItems === undefined),
        error,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

function DemoCartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('beautyhub_cart')
    return saved ? JSON.parse(saved) : []
  })
  const [error, setError] = useState('')

  const persist = (nextItems) => {
    localStorage.setItem('beautyhub_cart', JSON.stringify(nextItems))
    return nextItems
  }

  const addToCart = (product, quantity = 1) => {
    setError('')
    setCartItems((current) =>
      persist(
        current.some((item) => item._id === product._id)
          ? current.map((item) =>
              item._id === product._id ? { ...item, quantity: item.quantity + quantity } : item
            )
          : [...current, { ...product, quantity }]
      )
    )
  }

  const removeFromCart = (productId) => {
    setCartItems((current) => persist(current.filter((item) => item._id !== productId)))
  }

  const updateQuantity = (productId, quantity) => {
    setCartItems((current) =>
      persist(
        quantity <= 0
          ? current.filter((item) => item._id !== productId)
          : current.map((item) => (item._id === productId ? { ...item, quantity } : item))
      )
    )
  }

  const clearCart = () => setCartItems(persist([]))

  const cartTotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems]
  )
  const itemCount = useMemo(
    () => cartItems.reduce((count, item) => count + item.quantity, 0),
    [cartItems]
  )

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        itemCount,
        isLoading: false,
        error,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const CartProvider = isClerkConfigured ? ConfiguredCartProvider : DemoCartProvider

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
