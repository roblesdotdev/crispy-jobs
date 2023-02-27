import type { Job } from '~/types'
import { db } from './db.server'

export async function getListing(): Promise<
  Pick<Job, 'id' | 'title' | 'location' | 'team'>[]
> {
  return db.job.findMany({
    where: { published: true },
    select: {
      id: true,
      title: true,
      location: true,
      team: true,
    },
  })
}

export async function searchJobs(query: string) {
  await new Promise(res => setTimeout(res, Math.random() * 1000))
  return db.job.findMany({
    where: {
      title: {
        contains: query,
      },
    },
    select: {
      id: true,
      title: true,
    },
    take: 10,
  })
}
