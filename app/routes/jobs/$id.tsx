import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Form, useActionData, useLoaderData } from '@remix-run/react'
import { marked } from 'marked'
import invariant from 'tiny-invariant'
import { ErrorLabel, Input, InputLabel } from '~/components/forms'
import { MapPinIcon, UserGroupIcon } from '~/components/icons'
import type { SchemaErrors } from '~/utils/forms'
import { validateSchema } from '~/utils/forms'
import { getJobById } from '~/utils/job.server'
import type { ApplySchemaInput } from '~/utils/validation'
import { applySchema } from '~/utils/validation'

type LoaderData = {
  job: NonNullable<Awaited<ReturnType<typeof getJobById>>>
  html: string
}

export const loader: LoaderFunction = async ({ params }) => {
  const jobId = params.id
  invariant(typeof jobId === 'string', 'jobId type invalid')

  const job = await getJobById(jobId)

  if (!job) {
    throw new Response('Cannot found job', { status: 404 })
  }

  const html = marked(job.body)

  return json<LoaderData>(
    {
      job,
      html,
    },
    {
      headers: {
        'Cache-Control': 'private, max-age=3600',
      },
    },
  )
}

type ActionData = {
  status: 'success' | 'error'
  errors?: SchemaErrors<ApplySchemaInput> | null
}

export const action: ActionFunction = async ({ request }) => {
  const { formData, errors } = await validateSchema<ApplySchemaInput>({
    request,
    schema: applySchema,
  })

  if (errors) {
    return json<ActionData>({ status: 'error', errors }, { status: 400 })
  }

  /* TODO: send email with form data */
  console.log(formData)

  return json<ActionData>({ status: 'success' })
}

export default function Job() {
  const { job, html } = useLoaderData<LoaderData>()
  const data = useActionData<ActionData>()
  const errors = data?.errors

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 py-32 px-6 text-xl">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold">{job.title}</h1>
        <ul className="mt-2 flex flex-col gap-2 text-sm font-bold">
          <li className="flex items-center gap-2">
            <MapPinIcon className="h-4 w-4" />
            <span>{job.location}</span>
          </li>
          <li className="flex items-center gap-2">
            <UserGroupIcon className="h-4 w-4" />
            <span>{job.team}</span>
          </li>
        </ul>
      </div>
      <div className="mx-auto max-w-3xl">
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
      <div className="py-6">
        <h1 className="mb-4 text-2xl font-bold">Apply Now</h1>
        <Form method="post" noValidate>
          <div className="flex flex-col">
            <InputLabel htmlFor="firstName" text="First Name" />
            <Input
              name="firstName"
              placeholder="John"
              errorId="fn-error"
              invalid={Boolean(errors?.firstName)}
            />
            <ErrorLabel id="fn-error" error={errors?.firstName} />
          </div>
          <div className="flex flex-col">
            <InputLabel htmlFor="lastName" text="Last Name" />
            <Input
              name="lastName"
              placeholder="Doe"
              errorId="ln-error"
              invalid={Boolean(errors?.lastName)}
            />
            <ErrorLabel id="ln-error" error={errors?.lastName} />
          </div>
          <div className="flex flex-col">
            <InputLabel htmlFor="email" text="Eamil" />
            <Input
              type="email"
              name="email"
              placeholder="example@email.com"
              errorId="email-error"
              invalid={Boolean(errors?.email)}
            />
            <ErrorLabel id="email-error" error={errors?.email} />
          </div>
          <div className="flex flex-col">
            <InputLabel htmlFor="phone" text="Phone" />
            <Input
              name="phone"
              placeholder="444 44 444"
              errorId="phone-error"
              invalid={Boolean(errors?.phone)}
            />
            <ErrorLabel id="phone-error" error={errors?.phone} />
          </div>

          <div className="py-4">
            <button type="submit" className="bg-black px-6 py-3 text-white">
              Submit Application
            </button>
          </div>
        </Form>
        <p className="text-sm">
          By voluntarily providing information and clicking "Submit
          Application", you explicitly consent to the use of information for the
          purposes described in our Privacy statement.
        </p>
      </div>
    </div>
  )
}
