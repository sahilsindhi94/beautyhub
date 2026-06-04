import { useConvexAuth, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { isClerkConfigured } from '../auth/clerkConfig'

function useConfiguredCurrentUser() {
  const { isAuthenticated, isLoading } = useConvexAuth()
  return useQuery(api.users.getCurrent, isLoading || !isAuthenticated ? 'skip' : {})
}

function useDemoCurrentUser() {
  return null
}

export const useCurrentUser = isClerkConfigured ? useConfiguredCurrentUser : useDemoCurrentUser
