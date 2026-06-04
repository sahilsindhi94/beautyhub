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
import ProtectedRoute from '../components/auth/ProtectedRoute'
import RoleRoute from '../components/auth/RoleRoute'
import AdminPage, { AdminPanel } from '../pages/Admin/AdminPage'

export default function AppRoutes() {
  useScrollToTop()

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:id" element={<ProductDetailsPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="order-success" element={<OrderSuccessPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/:id" element={<OrderDetailsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route element={<RoleRoute allowedRoles={['admin', 'manager']} />}>
            <Route path="admin" element={<AdminPage />}>
              <Route index element={<AdminPanel />} />
              <Route path="products" element={<AdminPanel title="Products" />} />
              <Route path="categories" element={<AdminPanel title="Categories" />} />
              <Route path="orders" element={<AdminPanel title="Orders" />} />
              <Route path="reviews" element={<AdminPanel title="Reviews" />} />
              <Route path="coupons" element={<AdminPanel title="Coupons" />} />
              <Route path="analytics" element={<AdminPanel title="Analytics" />} />
              <Route element={<RoleRoute allowedRoles={['admin']} />}>
                <Route path="users" element={<AdminPanel title="Users" />} />
                <Route path="settings" element={<AdminPanel title="Settings" />} />
              </Route>
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
