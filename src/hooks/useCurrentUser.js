import { useConvexAuth, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'

export function useCurrentUser() {
  const { isAuthenticated, isLoading } = useConvexAuth()
  return useQuery(api.users.getCurrent, isLoading || !isAuthenticated ? 'skip' : {})
}
