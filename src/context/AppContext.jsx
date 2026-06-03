import { createContext } from 'react'
import { CartProvider } from './CartContext'
import { WishlistProvider } from './WishlistContext'

export const AppContext = createContext(null)

export function AppProvider({ children }) {
  return (
    <AppContext.Provider value={{}}>
      <WishlistProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </WishlistProvider>
    </AppContext.Provider>
  )
}
