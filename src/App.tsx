import StatusBoard from './StatusBoard'
import Partners from './Partners'
import { SignIn, useSession } from './lib/auth'
import { supabaseConfigured } from './lib/supabase'

export default function App() {
  const { session, loading } = useSession()
  if (new URLSearchParams(window.location.search).has('status')) return <StatusBoard />
  if (!supabaseConfigured) return <main className="wrap"><h1>Data partners</h1><p>The database is not connected yet. Your Coach will guide you.</p></main>
  if (loading) return <main className="wrap"><p>Loading…</p></main>
  if (!session) return <main className="wrap"><p className="kicker">GEO-Q</p><h1>Data partners</h1><SignIn /></main>
  return <Partners session={session} />
}
