import { z } from 'zod'

export const UpdateCard = z.object({
  id: z.string(),
  boardId: z.string(),
  title: z.string({
    required_error: 'Title is required',
    invalid_type_error: 'Invalid format'
  }).min(3, {
    message: 'Title is too short'
  }),
  description: z.optional(
    z.string({
      required_error: 'Description is required',
      invalid_type_error: 'Invalid format'
    }).min(3, {
      message: 'Description is too short'
    })
  )
})