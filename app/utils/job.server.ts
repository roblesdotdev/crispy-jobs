import type { Prisma } from '@prisma/client'
import type { Job } from '~/types'
import { db } from './db.server'

export const JOBS_PEER_PAGE = 15

export async function searchJobs(query: string) {
  await new Promise(res => setTimeout(res, Math.random() * 1000))
  return db.job.findMany({
    where: {
      AND: [
        {
          title: {
            contains: query,
          },
        },
        { published: true },
      ],
    },
    select: {
      id: true,
      title: true,
    },
    take: 10,
  })
}

export async function getJobById(id: Job['id']) {
  return db.job.findFirst({
    where: { AND: [{ id }, { published: true }] },
  })
}

export async function searchDeepJobs({
  query,
  skip,
}: {
  query?: string | null
  skip?: number | null
}) {
  const hasQuery = query && query.length > 0
  const validSkip = skip ? Math.max(skip, 1) : 1

  const where = {
    published: true,
    ...(hasQuery && {
      OR: [{ title: { contains: query } }, { body: { contains: query } }],
    }),
  }

  const options: Prisma.JobFindManyArgs = {
    take: JOBS_PEER_PAGE,
    skip: (validSkip - 1) * JOBS_PEER_PAGE,
    where,
    select: {
      id: true,
      title: true,
      location: true,
      team: true,
    },
  }

  return db.$transaction([db.job.count({ where }), db.job.findMany(options)])
}
