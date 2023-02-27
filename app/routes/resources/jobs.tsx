import type { LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useFetcher, useNavigate } from '@remix-run/react'
import clsx from 'clsx'
import { useCombobox } from 'downshift'
import { useId, useState } from 'react'
import invariant from 'tiny-invariant'
import { searchJobs } from '~/utils/job.server'

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url)
  const query = url.searchParams.get('query')
  invariant(typeof query === 'string', 'query is required')
  return json(
    {
      items: await searchJobs(query),
    },
    {
      headers: { 'Cache-Control': 'max-age=60' },
    },
  )
}

export function JobCombobox({ error }: { error?: string | null }) {
  const jobsFetcher = useFetcher<typeof loader>()
  const navigate = useNavigate()
  const id = useId()
  const jobs = jobsFetcher.data?.items ?? []
  type Job = (typeof jobs)[number]
  const [selectedJob, setSelectedJob] = useState<Job | null | undefined>(null)
  const [query, setQuery] = useState<string>('')

  const cb = useCombobox<Job>({
    id,
    onSelectedItemChange: ({ selectedItem }) => {
      setSelectedJob(selectedItem)
      navigate(`/jobs/${selectedItem?.id}`)
    },
    items: jobs,
    itemToString: item => (item ? item.title : ''),
    onInputValueChange: changes => {
      setSelectedJob(null)
      setQuery(changes.inputValue ?? '')
      jobsFetcher.load(`/resources/jobs?query=${changes.inputValue ?? ''}`)
    },
  })

  const displayMenu = cb.isOpen && jobs.length > 0

  return (
    <div className="relative">
      <input name="jobId" type="hidden" value={selectedJob?.id ?? ''} />
      <div className="flex flex-wrap items-center gap-1">
        <label {...cb.getLabelProps()} className="sr-only">
          Jobs
        </label>
        {error ? (
          <em id="job-error" className="sr-only text-xs text-red-600">
            {error}
          </em>
        ) : null}
      </div>
      <div {...cb.getMenuProps({ className: 'relative' })}>
        <input
          {...cb.getInputProps({
            className: clsx('w-full border border-gray-500 px-2 py-1 text-lg', {
              'rounded-t rounded-b-0': displayMenu,
              rounded: !displayMenu,
            }),
            'aria-invalid': Boolean(error) || undefined,
            'aria-errormessage': error ? 'job-error' : undefined,
            placeholder: 'Search your next job...',
            name: 'query',
            onKeyDown(e) {
              if (
                e.key === 'Enter' &&
                !selectedJob &&
                cb.highlightedIndex < 0
              ) {
                navigate(`/search?query=${query}`)
              }
            },
          })}
        />
      </div>
      <ul
        {...cb.getMenuProps({
          className: clsx(
            'absolute z-10 max-h-[180px] w-full overflow-y-scroll  rounded-b border border-t-0 border-gray-500 bg-white shadow-lg',
            { hidden: !displayMenu },
          ),
        })}
      >
        {displayMenu
          ? jobs.map((job, index) => (
              <li
                className={clsx('cursor-pointer py-1 px-2', {
                  'bg-green-200': cb.highlightedIndex === index,
                })}
                key={job.id}
                {...cb.getItemProps({ item: job, index })}
              >
                {job.title}
              </li>
            ))
          : null}
      </ul>
    </div>
  )
}
