import z from 'zod'

const userSchema = z.object({
  username: z.string(),
})

const exerciseSchema = z.object({
  description: z.string(),
  duration: z.union([z.string(), z.number()]),
  date: z.string().optional(),
})

const querySchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  limit: z.string().optional(),
})

export const validateUser = (user) => {
  return userSchema.safeParse(user)
}

export const validateExercise = (exercise) => {
  return exerciseSchema.safeParse(exercise)
}

export const validateQuery = (query) => {
  return querySchema.safeParse(query)
}
