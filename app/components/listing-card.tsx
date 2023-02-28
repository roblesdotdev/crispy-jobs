import { Link } from '@remix-run/react'
import type { Job } from '~/types'
import { MapPinIcon, UserGroupIcon } from './icons'

export default function ListingCard({
  id,
  title,
  location,
  team,
}: Pick<Job, 'id' | 'title' | 'location' | 'team'>) {
  return (
    <div className="flex w-full flex-1 flex-col px-3 py-6">
      <Link to={`/jobs/${id}`}>
        <h1 className="text-xl text-red-600 hover:text-red-500">{title}</h1>
      </Link>
      <ul className="mt-2 flex flex-col gap-2 text-sm font-bold">
        <li className="flex items-center gap-2">
          <MapPinIcon className="h-4 w-4" />
          <span>{location}</span>
        </li>
        <li className="flex items-center gap-2">
          <UserGroupIcon className="h-4 w-4" />
          <span>{team}</span>
        </li>
      </ul>
    </div>
  )
}
