import { fail, ok } from "@/lib/api-response"
import { requireSession } from "@/lib/auth/session"
import { requireLearner } from "@/lib/auth/guards"
import { onboardingRequestSchema } from "@/lib/validation/onboarding"
import { onboardingService } from "@/services/onboarding-service"

export async function POST(request: Request) {
  try {
    const session = await requireSession()
    requireLearner(session)

    const payload = onboardingRequestSchema.parse(await request.json())
    const result = await onboardingService.upsertOnboarding(session.userId, payload, {
      email: session.email,
      name: session.name,
    })

    return ok(result)
  } catch (error) {
    return fail(error)
  }
}
