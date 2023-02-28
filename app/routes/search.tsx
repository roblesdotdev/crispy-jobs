import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Form, useLoaderData, useSearchParams } from '@remix-run/react'
import ListingCard from '~/components/listing-card'
import { getListing, searchDeepJobs } from '~/utils/job.server'
import { JobCombobox } from './resources/jobs'

type LoaderData = {
  items: NonNullable<Awaited<ReturnType<typeof getListing>>>
}

export const loader: LoaderFunction = async ({ request }) => {
  const searchParams = new URL(request.url).searchParams
  const query = searchParams.get('query')

  const headers = { 'Cache-Control': 'max-age=60' }

  if (!query || query.length === 0) {
    return json<LoaderData>(
      {
        items: await getListing(),
      },
      { headers },
    )
  }

  return json<LoaderData>(
    {
      items: await searchDeepJobs(query),
    },
    { headers },
  )
}

export default function Search() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('query') ?? ''
  const { items } = useLoaderData<LoaderData>()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 text-xl">
      <h1>Searching {searchParams.get('query') ?? 'with no query'}</h1>
      <h2>{items.length} items found</h2>
      <Form>
        <JobCombobox query={query} />
      </Form>
      <div className="mx-auto mt-6 flex w-full max-w-3xl flex-col divide-y divide-slate-300">
        {items.map(item => (
          <ListingCard
            key={item.id}
            id={item.id}
            title={item.title}
            location={item.location}
            team={item.team}
          />
        ))}
      </div>
    </div>
  )
}
