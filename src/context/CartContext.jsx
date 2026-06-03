import { createContext, useContext, useState, useEffect, useMemo } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('beautyhub_cart')
    return saved ? JSON.parse(saved) : []
  })

  const [deviceId] = useState(() => {
    let id = localStorage.getItem('beautyhub_device_id')
    if (!id) {
      id = 'device_' + Math.random().toString(36).substring(2, 15)
      localStorage.setItem('beautyhub_device_id', id)
    }
    return id
  })

  useEffect(() => {
    localStorage.setItem('beautyhub_cart', JSON.stringify(cartItems))
    // Future sync with Convex here
  }, [cartItems])

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item._id === product._id)
      if (existingItem) {
        return prev.map(item => 
          item._id === product._id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { ...product, quantity }]
    })
  }

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item._id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCartItems(prev => prev.map(item => 
      item._id === productId ? { ...item, quantity } : item
    ))
  }

  const clearCart = () => {
    setCartItems([])
  }

  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }, [cartItems])

  const itemCount = useMemo(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0)
  }, [cartItems])

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      itemCount,
      deviceId
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
