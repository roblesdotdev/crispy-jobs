import { useSearchParams } from '@remix-run/react'

export default function Index() {
  const [searchParams] = useSearchParams()

  return (
    <div className="flex min-h-screen items-center justify-center text-xl">
      <h1>Searching {searchParams.get('query')}</h1>
    </div>
  )
}
