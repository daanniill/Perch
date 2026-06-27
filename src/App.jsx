import { useState, useEffect } from 'react'
import PerchLanding from './PerchLanding'
import PerchDashboard from './PerchDashboard'
import PerchOnboarding from './PerchOnboarding'

function getPage() {
  const h = window.location.hash
  if (h === '#/dashboard')  return 'dashboard'
  if (h === '#/onboarding') return 'onboarding'
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

  if (page === 'dashboard')  return <PerchDashboard />
  if (page === 'onboarding') return <PerchOnboarding onNavigate={navigate} />
  return <PerchLanding />
}
