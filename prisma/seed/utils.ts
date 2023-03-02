import { faker } from '@faker-js/faker'
import type { Job, Company } from '~/types'

export function createCompany(): Omit<Company, 'id'> {
  return {
    name: faker.company.name(),
    address: faker.address.streetAddress(),
    description: faker.company.catchPhrase(),
    email: faker.internet.email(),
  }
}

export function createJob(): Pick<
  Job,
  'title' | 'code' | 'location' | 'team' | 'body' | 'bannerUrl'
> {
  const title = faker.name.jobTitle()
  const code = faker.random.alpha(6).toUpperCase()
  const body = `
## Section 1

${faker.lorem.paragraph()}

## Section 2

${faker.lorem.paragraphs(3, '\n\n\n')}

## Section 3

- ${faker.lorem.sentence()}
- ${faker.lorem.sentence()}
- ${faker.lorem.sentence()}
`
  return {
    title,
    code,
    location: faker.address.cityName(),
    team: faker.name.jobArea(),
    body: body,
    bannerUrl: faker.image.abstract(1234, 640, true),
  }
}
