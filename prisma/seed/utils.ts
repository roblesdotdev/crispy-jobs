import { faker } from '@faker-js/faker'
import type { Job } from '~/types'

export function createJob(): Pick<
  Job,
  'title' | 'location' | 'team' | 'body' | 'bannerUrl'
> {
  const title = faker.name.jobTitle()
  const body = `
## Section 1

${faker.lorem.paragraph()}

## Section 2

${faker.lorem.paragraphs()}
`
  return {
    title,
    location: faker.address.cityName(),
    team: faker.name.jobArea(),
    body: body,
    bannerUrl: faker.image.abstract(1234, 640, true),
  }
}
