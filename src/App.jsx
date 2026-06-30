import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import PerchLanding from './PerchLanding'
import PerchDashboard from './PerchDashboard'
import PerchOnboarding from './PerchOnboarding'
import PerchListingGenerator from './PerchListingGenerator'
import PerchListings from './PerchListings'
import PerchFinances from './PerchFinances'
import PerchPricing from './PerchPricing'
import PerchAnalytics from './PerchAnalytics'
import PerchSettings from './PerchSettings'

const PROTECTED = new Set(['dashboard', 'listing-generator', 'listings', 'finances', 'analytics', 'settings'])

function getPage() {
  const h = window.location.hash.split('?')[0]
  if (h === '#/dashboard')         return 'dashboard'
  if (h === '#/onboarding')        return 'onboarding'
  if (h === '#/listing-generator') return 'listing-generator'
  if (h === '#/listings')          return 'listings'
  if (h === '#/finances')          return 'finances'
  if (h === '#/pricing')           return 'pricing'
  if (h === '#/analytics')         return 'analytics'
  if (h === '#/settings')          return 'settings'
  return 'landing'
}

export default function App() {
  const [page, setPage] = useState(getPage)
  const [user, setUser] = useState(undefined) // undefined = loading, null = logged out

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      // PKCE OAuth callback lands on /?code=xxx — navigate to onboarding once session is ready
      if (event === 'SIGNED_IN' && new URLSearchParams(window.location.search).has('code')) {
        window.history.replaceState(null, '', '/')
        window.location.hash = '#/onboarding'
        setPage('onboarding')
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const handler = () => setPage(getPage())
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  // Redirect unauthenticated users away from protected routes
  useEffect(() => {
    if (user === null && PROTECTED.has(page)) {
      window.location.hash = '#/onboarding'
      setPage('onboarding')
    }
  }, [user, page])

  function navigate(p) {
    window.location.hash = `#/${p}`
    setPage(p)
  }

  if (page === 'dashboard')         return <PerchDashboard onNavigate={navigate} />
  if (page === 'onboarding')        return <PerchOnboarding onNavigate={navigate} />
  if (page === 'listing-generator') return <PerchListingGenerator onNavigate={navigate} />
  if (page === 'listings')          return <PerchListings onNavigate={navigate} />
  if (page === 'finances')          return <PerchFinances onNavigate={navigate} />
  if (page === 'pricing')           return <PerchPricing onNavigate={navigate} />
  if (page === 'analytics')         return <PerchAnalytics onNavigate={navigate} />
  if (page === 'settings')          return <PerchSettings onNavigate={navigate} />
  return <PerchLanding />
}
