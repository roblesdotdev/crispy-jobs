import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import invariant from 'tiny-invariant'
import { getJobById } from '~/utils/job.server'

type LoaderData = {
  job: NonNullable<Awaited<ReturnType<typeof getJobById>>>
}

export const loader: LoaderFunction = async ({ params }) => {
  const jobId = params.id
  invariant(typeof jobId === 'string', 'jobId type invalid')

  const job = await getJobById(jobId)

  if (!job) {
    throw new Response('Cannot found job', { status: 404 })
  }

  return json<LoaderData>(
    {
      job,
    },
    {
      headers: {
        'Cache-Control': 'private, max-age=3600',
      },
    },
  )
}

export default function Job() {
  const { job } = useLoaderData<LoaderData>()

  return (
    <div className="flex min-h-screen items-center justify-center text-xl">
      <pre className="mx-auto max-w-5xl whitespace-pre-wrap">
        {JSON.stringify(job, null, 2)}
      </pre>
    </div>
  )
}
