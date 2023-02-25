import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { getListing } from '~/utils/job.server'

type LoaderData = {
  jobs: Awaited<ReturnType<typeof getListing>>
}

export const loader: LoaderFunction = async () => {
  const jobs = await getListing()
  return json<LoaderData>({ jobs })
}

export default function Index() {
  const { jobs } = useLoaderData<LoaderData>()

  return (
    <div className="flex min-h-screen items-center justify-center text-xl">
      <pre>{JSON.stringify(jobs, null, 2)}</pre>
    </div>
  )
}
