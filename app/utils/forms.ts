import type { z } from 'zod'
import type { ZodError } from 'zod'

export type SchemaErrors<T> = Partial<Record<keyof T, string>>

export async function validateSchema<InputSchema>({
  request,
  schema,
}: {
  request: Request
  schema: z.ZodSchema<InputSchema>
}) {
  const body = Object.fromEntries(await request.formData())
  try {
    const formData = schema.parse(body)
    return { formData, errors: null }
  } catch (e) {
    const errors = e as ZodError<InputSchema>
    return {
      formData: body,
      errors: errors.issues.reduce((acc: SchemaErrors<InputSchema>, curr) => {
        const key = curr.path[0] as keyof InputSchema
        acc[key] = curr.message
        return acc
      }, {}),
    }
  }
}
