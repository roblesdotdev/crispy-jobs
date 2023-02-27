import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Form, useLoaderData, useSearchParams } from '@remix-run/react'
import { getListing, searchDeepJobs } from '~/utils/job.server'
import { JobCombobox } from './resources/jobs'

export const loader: LoaderFunction = async ({ request }) => {
  const searchParams = new URL(request.url).searchParams
  const query = searchParams.get('query')

  const headers = { 'Cache-Control': 'max-age=60' }

  if (!query || query.length === 0) {
    return json(
      {
        items: await getListing(),
      },
      { headers },
    )
  }

  return json(
    {
      items: await searchDeepJobs(query),
    },
    { headers },
  )
}

export default function Search() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('query') ?? ''
  const { items } = useLoaderData()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-xl">
      <h1>Searching {searchParams.get('query') ?? 'with no query'}</h1>
      <h2>{items.length} items found</h2>
      <Form>
        <JobCombobox query={query} />
      </Form>

      <pre className="mx-auto max-w-5xl whitespace-pre-wrap">
        {JSON.stringify(items, null, 2)}
      </pre>
    </div>
  )
}
