import { Link } from '@remix-run/react'

export default function Index() {
  return (
    <div className="flex min-h-screen items-center justify-center text-xl">
      <Link to="/search">Search</Link>
    </div>
  )
}
