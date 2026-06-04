import { useEffect, useState } from 'react'
import { useConvexAuth, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { isClerkConfigured } from '../../auth/clerkConfig'

export default function AuthSync() {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const syncCurrentUser = useMutation(api.users.syncCurrentUser)
  const [lastError, setLastError] = useState('')

  useEffect(() => {
    if (!isClerkConfigured) return
    if (isLoading || !isAuthenticated) return

    let cancelled = false
    syncCurrentUser()
      .then(() => {
        if (!cancelled) setLastError('')
      })
      .catch(() => {
        if (!cancelled) setLastError('Unable to sync your account. Please refresh and try again.')
      })

    return () => {
      cancelled = true
    }
  }, [isAuthenticated, isLoading, syncCurrentUser])

  if (!isClerkConfigured) return null

  if (!lastError) return null

  return (
    <div className="auth-sync-error" role="alert">
      {lastError}
    </div>
  )
}
