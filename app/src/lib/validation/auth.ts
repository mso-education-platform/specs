import { z } from "zod"

const email = z.string().email().transform((value) => value.trim().toLowerCase())

export const checkEmailSchema = z.object({
  email,
})

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email,
  password: z.string().min(8).max(128),
})

export const loginSchema = z.object({
  email,
  password: z.string().min(1).max(128),
})

export type CheckEmailDto = z.infer<typeof checkEmailSchema>
export type RegisterDto = z.infer<typeof registerSchema>
export type LoginDto = z.infer<typeof loginSchema>
