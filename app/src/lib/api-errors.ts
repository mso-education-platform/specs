import { ZodError } from "zod"

export class ApiError extends Error {
  readonly status: number
  readonly code: string

  constructor(status: number, code: string, message: string) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.code = code
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

function getPrismaErrorCode(error: unknown): string | null {
  if (typeof error !== "object" || error === null) {
    return null
  }

  const maybeCode = (error as { code?: unknown }).code
  return typeof maybeCode === "string" ? maybeCode : null
}

export function toApiError(error: unknown): ApiError {
  if (isApiError(error)) {
    return error
  }

  if (error instanceof ZodError) {
    const firstIssue = error.issues[0]?.message ?? "Invalid request payload."
    return new ApiError(400, "VALIDATION_ERROR", firstIssue)
  }

  const prismaCode = getPrismaErrorCode(error)
  if (prismaCode) {
    if (prismaCode === "P2002") {
      return new ApiError(409, "CONFLICT", "A record with the same unique value already exists.")
    }

    if (prismaCode === "P2021" || prismaCode === "P2022") {
      return new ApiError(500, "DATABASE_SCHEMA_OUTDATED", "Database schema is outdated. Run Prisma migrations.")
    }
  }

  return new ApiError(500, "INTERNAL_SERVER_ERROR", "Unexpected error.")
}
