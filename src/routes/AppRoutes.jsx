import { Routes, Route, Navigate } from 'react-router-dom'
import useScrollToTop from '../hooks/useScrollToTop'
import MainLayout from '../layouts/MainLayout'
import HomePage from '../pages/Home/HomePage'
import ProductsPage from '../pages/Products/ProductsPage'
import ProductDetailsPage from '../pages/ProductDetails/ProductDetailsPage'
import CartPage from '../pages/Cart/CartPage'
import WishlistPage from '../pages/Wishlist/WishlistPage'
import CheckoutPage from '../pages/Checkout/CheckoutPage'
import OrderSuccessPage from '../pages/OrderSuccess/OrderSuccessPage'
import OrdersPage from '../pages/Orders/OrdersPage'
import OrderDetailsPage from '../pages/OrderDetails/OrderDetailsPage'
import LoginPage from '../pages/Login/LoginPage'
import RegisterPage from '../pages/Register/RegisterPage'
import ProfilePage from '../pages/Profile/ProfilePage'

export default function AppRoutes() {
  useScrollToTop()

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:id" element={<ProductDetailsPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="wishlist" element={<WishlistPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="order-success" element={<OrderSuccessPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="orders/:id" element={<OrderDetailsPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
