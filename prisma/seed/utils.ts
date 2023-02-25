import { faker } from '@faker-js/faker'
import type { Job } from '~/types'

export function createJob(): Pick<
  Job,
  'title' | 'location' | 'team' | 'body' | 'bannerUrl'
> {
  return {
    title: faker.name.jobTitle(),
    location: faker.address.cityName(),
    team: faker.name.jobArea(),
    body: faker.lorem.paragraphs(),
    bannerUrl: faker.image.abstract(1234, 2345, true),
  }
}
