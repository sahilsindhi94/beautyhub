import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useConvexAuth } from 'convex/react'
import AuthLoadingScreen from './AuthLoadingScreen'

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const location = useLocation()

  if (isLoading) {
    return <AuthLoadingScreen message="Checking your secure session..." />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
