import { useParams } from '@remix-run/react'

export default function Job() {
  const params = useParams()
  return (
    <div className="flex min-h-screen items-center justify-center text-xl">
      <h1>Job {params.id}</h1>
    </div>
  )
}
