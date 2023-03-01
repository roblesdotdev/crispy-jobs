import { z } from 'zod'

const rePhoneNumber =
  /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/

export const applySchema = z.object({
  firstName: z
    .string()
    .min(3, { message: 'First Name is too short' })
    .max(20, { message: 'First Name is too long' }),
  lastName: z
    .string()
    .min(3, { message: 'Last Name is too short' })
    .max(20, { message: 'Last Name is too long' }),
  email: z
    .string()
    .email({ message: 'Email is invalid' })
    .min(4, { message: 'Email is too short' })
    .max(50, { message: 'Email is too long' }),
  phone: z
    .string()
    .regex(rePhoneNumber, 'Phone is invalid')
    .min(10, { message: 'Phone is too short' }),
})

export type ApplySchemaInput = z.TypeOf<typeof applySchema>
