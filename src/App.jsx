import { useState, useEffect } from 'react'
import PerchLanding from './PerchLanding'
import PerchDashboard from './PerchDashboard'
import PerchOnboarding from './PerchOnboarding'
import PerchListingGenerator from './PerchListingGenerator'

function getPage() {
  const h = window.location.hash
  if (h === '#/dashboard')         return 'dashboard'
  if (h === '#/onboarding')        return 'onboarding'
  if (h === '#/listing-generator') return 'listing-generator'
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

  if (page === 'dashboard')         return <PerchDashboard />
  if (page === 'onboarding')        return <PerchOnboarding onNavigate={navigate} />
  if (page === 'listing-generator') return <PerchListingGenerator />
  return <PerchLanding />
}
