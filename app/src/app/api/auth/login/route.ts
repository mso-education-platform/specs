import { ApiError } from "@/lib/api-errors"
import { fail, ok } from "@/lib/api-response"
import { prisma } from "@/lib/db/prisma"
import { verifyPassword } from "@/lib/auth/password"
import { loginSchema } from "@/lib/validation/auth"

export async function POST(request: Request) {
  try {
    const payload = loginSchema.parse(await request.json())

    const user = await prisma.user.findUnique({
      where: { email: payload.email },
      select: {
        id: true,
        role: true,
        email: true,
        name: true,
        passwordHash: true,
      },
    })

    if (!user) {
      throw new ApiError(401, "INVALID_CREDENTIALS", "Invalid email or password.")
    }

    if (!user.passwordHash) {
      throw new ApiError(401, "PASSWORD_NOT_SET", "This account cannot sign in with password yet.")
    }

    const isValid = verifyPassword(payload.password, user.passwordHash)

    if (!isValid) {
      throw new ApiError(401, "INVALID_CREDENTIALS", "Invalid email or password.")
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
