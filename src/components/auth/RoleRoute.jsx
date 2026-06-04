import { Navigate, Outlet } from 'react-router-dom'
import AuthLoadingScreen from './AuthLoadingScreen'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { isClerkConfigured } from '../../auth/clerkConfig'

function ConfiguredRoleRoute({ allowedRoles }) {
  const user = useCurrentUser()

  if (user === undefined || user === null) {
    return <AuthLoadingScreen message="Loading your permissions..." />
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

function DemoRoleRoute() {
  return <Outlet />
}

const RoleRoute = isClerkConfigured ? ConfiguredRoleRoute : DemoRoleRoute

export default RoleRoute
