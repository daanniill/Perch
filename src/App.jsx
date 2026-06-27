import { useState, useEffect } from 'react'
import PerchLanding from './PerchLanding'
import PerchDashboard from './PerchDashboard'

function getPage() {
  const h = window.location.hash
  if (h === '#/dashboard') return 'dashboard'
  return 'landing'
}

export default function App() {
  const [page, setPage] = useState(getPage)

  useEffect(() => {
    const handler = () => setPage(getPage())
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  if (page === 'dashboard') return <PerchDashboard />
  return <PerchLanding />
}
