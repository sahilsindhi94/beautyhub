import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useConvexAuth } from 'convex/react'
import AuthLoadingScreen from './AuthLoadingScreen'
import { isClerkConfigured } from '../../auth/clerkConfig'

function ConfiguredProtectedRoute() {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const location = useLocation()

  if (isLoading) {
    return <AuthLoadingScreen message="Checking your secure session..." />
  }

  if (!isAuthenticated) {
    return <Navigate to="/register" replace state={{ from: location }} />
  }

  return <Outlet />
}

function DemoProtectedRoute() {
  return <Outlet />
}

const ProtectedRoute = isClerkConfigured ? ConfiguredProtectedRoute : DemoProtectedRoute

export default ProtectedRoute
