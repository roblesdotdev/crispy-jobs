import { z } from 'zod'

export const applySchema = z.object({
  firstName: z.string().min(3),
  lastName: z.string().min(3),
  email: z.string().email(),
  phone: z.string().min(10),
})

export type ApplySchemaInput = z.TypeOf<typeof applySchema>
