import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import invariant from 'tiny-invariant'
import { MapPinIcon, UserGroupIcon } from '~/components/icons'
import { getJobById } from '~/utils/job.server'
import { marked } from 'marked'

type LoaderData = {
  job: NonNullable<Awaited<ReturnType<typeof getJobById>>>
  html: string
}

export const loader: LoaderFunction = async ({ params }) => {
  const jobId = params.id
  invariant(typeof jobId === 'string', 'jobId type invalid')

  const job = await getJobById(jobId)

  if (!job) {
    throw new Response('Cannot found job', { status: 404 })
  }

  const html = marked(job.body)

  return json<LoaderData>(
    {
      job,
      html,
    },
    {
      headers: {
        'Cache-Control': 'private, max-age=3600',
      },
    },
  )
}

export default function Job() {
  const { job, html } = useLoaderData<LoaderData>()

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 py-32 px-6 text-xl">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold">{job.title}</h1>
        <ul className="mt-2 flex flex-col gap-2 text-sm font-bold">
          <li className="flex items-center gap-2">
            <MapPinIcon className="h-4 w-4" />
            <span>{job.location}</span>
          </li>
          <li className="flex items-center gap-2">
            <UserGroupIcon className="h-4 w-4" />
            <span>{job.team}</span>
          </li>
        </ul>
      </div>
      <div className="mx-auto max-w-3xl">
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  )
}
