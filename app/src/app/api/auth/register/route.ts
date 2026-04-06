import { ApiError } from "@/lib/api-errors"
import { fail, ok } from "@/lib/api-response"
import { prisma } from "@/lib/db/prisma"
import { hashPassword } from "@/lib/auth/password"
import { registerSchema } from "@/lib/validation/auth"

export async function POST(request: Request) {
  try {
    const payload = registerSchema.parse(await request.json())

    const existing = await prisma.user.findUnique({
      where: { email: payload.email },
      select: { id: true },
    })

    if (existing) {
      throw new ApiError(409, "ACCOUNT_EXISTS", "An account with this email already exists.")
    }

    const user = await prisma.user.create({
      data: {
        email: payload.email,
        name: payload.name,
        role: payload.role,
        passwordHash: hashPassword(payload.password),
      },
    })

    if (payload.role === "LEARNER") {
      await prisma.learnerProfile.upsert({
        where: { userId: user.id },
        update: {},
        create: { userId: user.id },
      })
    }

    return ok({
      userId: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
    })
  } catch (error) {
    return fail(error)
  }
}
