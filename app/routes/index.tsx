import { Form } from '@remix-run/react'
import { JobCombobox } from './resources/jobs'

export default function Index() {
  return (
    <Form>
      <div className="flex items-center justify-center pt-32">
        <JobCombobox />
      </div>
    </Form>
  )
}
