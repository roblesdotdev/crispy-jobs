import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Form, useLoaderData, useSearchParams } from '@remix-run/react'
import ListingCard from '~/components/listing-card'
import Pagination from '~/components/pagination'
import { searchDeepJobs } from '~/utils/job.server'
import { JobCombobox } from './resources/jobs'

const JOBS_PEER_PAGE = 15

type SearchResponse = NonNullable<Awaited<ReturnType<typeof searchDeepJobs>>>

type LoaderData = {
  totalJobs: SearchResponse[0]
  items: SearchResponse[1]
}

export const loader: LoaderFunction = async ({ request }) => {
  const searchParams = new URL(request.url).searchParams
  const query = searchParams.get('query')
  const page = searchParams.get('page')

  const headers = { 'Cache-Control': 'max-age=60' }
  const [totalJobs, items] = await searchDeepJobs({ query, skip: Number(page) })

  return json<LoaderData>({ totalJobs, items }, { headers })
}

export default function Search() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('query') ?? ''
  const { totalJobs, items } = useLoaderData<LoaderData>()
  const totalPages = Math.ceil(totalJobs / JOBS_PEER_PAGE)

  return (
    <div className="flex min-h-screen flex-col items-center  py-12 text-xl">
      <h1>Searching {searchParams.get('query') ?? 'with no query'}</h1>
      <h2>{totalJobs} items found</h2>
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
            company={item.company.name}
          />
        ))}
      </div>
      <div className="mx-auto w-full max-w-3xl py-6">
        <Pagination totalPages={totalPages} pageParam="page" />
      </div>
    </div>
  )
}
