import { PrismaClient } from '@prisma/client'
import { createJob } from './utils'

const prisma = new PrismaClient()

async function seed() {
  console.log('🌱 Seeding...')
  console.time(`🌱 Database has been seeded`)

  console.time('🧹 Cleaned up the database...')
  await prisma.job.deleteMany({ where: {} })
  console.timeEnd('🧹 Cleaned up the database...')

  const totalJobs = 35
  console.time(`👤 Created ${totalJobs} jobs...`)
  await Promise.all(
    Array.from({ length: totalJobs }, async () => {
      const jobData = createJob()
      return await prisma.job.create({
        data: {
          ...jobData,
        },
      })
    }),
  )
  console.timeEnd(`👤 Created ${totalJobs} jobs...`)

  console.timeEnd(`🌱 Database has been seeded`)
}

seed()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
