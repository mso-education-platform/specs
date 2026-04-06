import { fail, ok } from "@/lib/api-response"
import { checkEmailSchema } from "@/lib/validation/auth"
import { prisma } from "@/lib/db/prisma"

export async function POST(request: Request) {
  try {
    const payload = checkEmailSchema.parse(await request.json())

    const user = await prisma.user.findUnique({
      where: { email: payload.email },
      select: { id: true },
    })

    return ok({ exists: Boolean(user) })
  } catch (error) {
    return fail(error)
  }
}
