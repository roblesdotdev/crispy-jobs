import { PrismaClient } from '@prisma/client'
import { createCompany, createJob } from './utils'

const prisma = new PrismaClient()

async function seed() {
  console.log('๐ฑ Seeding...')
  console.time(`๐ฑ Database has been seeded`)

  console.time('๐งน Cleaned up the database...')
  await prisma.company.deleteMany({ where: {} })
  console.timeEnd('๐งน Cleaned up the database...')

  const totalCompanies = 5
  console.time(`๐ข Created ${totalCompanies} companies...`)
  const companies = await Promise.all(
    Array.from({ length: totalCompanies }, async () => {
      const companyData = createCompany()
      return await prisma.company.create({
        data: {
          ...companyData,
        },
      })
    }),
  )
  console.timeEnd(`๐ข Created ${totalCompanies} companies...`)

  const jobPeerCompany = 4
  const totalJobs = totalCompanies * jobPeerCompany
  console.time(`๐ค Created ${totalJobs} jobs...`)
  const companyIds = companies.map(c => c.id)
  await Promise.all(
    Array.from({ length: companyIds.length }, async () => {
      companyIds.map(async companyId => {
        const jobData = createJob()
        return await prisma.job.create({
          data: {
            ...jobData,
            companyId,
          },
        })
      })
    }),
  )
  console.timeEnd(`๐ค Created ${totalJobs} jobs...`)

  console.timeEnd(`๐ฑ Database has been seeded`)
}

seed()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
