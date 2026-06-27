import { useState, useEffect } from 'react'
import PerchLanding from './PerchLanding'
import PerchDashboard from './PerchDashboard'
import PerchOnboarding from './PerchOnboarding'
import PerchListingGenerator from './PerchListingGenerator'
import PerchListings from './PerchListings'
import PerchFinances from './PerchFinances'
import PerchPricing from './PerchPricing'
import PerchAnalytics from './PerchAnalytics'
import PerchSettings from './PerchSettings'

function getPage() {
  const h = window.location.hash
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

  useEffect(() => {
    const handler = () => setPage(getPage())
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

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
