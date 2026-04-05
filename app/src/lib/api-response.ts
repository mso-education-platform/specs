import { NextResponse } from "next/server"
import { ApiError, toApiError } from "@/lib/api-errors"

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, { status: 200, ...init })
}

export function created<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, { status: 201, ...init })
}

export function fail(error: unknown) {
  const apiError = toApiError(error)

  return NextResponse.json(
    {
      error: {
        code: apiError.code,
        message: apiError.message,
      },
    },
    { status: apiError.status },
  )
}

export function assert(condition: unknown, error: ApiError): asserts condition {
  if (!condition) {
    throw error
  }
}
