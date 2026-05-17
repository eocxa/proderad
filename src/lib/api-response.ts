import { NextResponse } from "next/server"
import type { ApiResponse, ApiError } from "@/types"

export function success<T>(data: T, status = 200, meta?: ApiResponse<T>["meta"]) {
  const body: ApiResponse<T> = { success: true, data }
  if (meta) body.meta = meta
  return NextResponse.json(body, { status })
}

export function created<T>(data: T) {
  return success(data, 201)
}

export function error(code: ApiError["code"], message: string, status = 400, details?: ApiError["details"]) {
  const body: ApiResponse<never> = {
    success: false,
    error: { code, message },
  }
  if (details) body.error!.details = details
  return NextResponse.json(body, { status })
}

export function unauthorized(message = "No autenticado") {
  return error("UNAUTHORIZED", message, 401)
}

export function forbidden(message = "Sin permisos suficientes") {
  return error("FORBIDDEN", message, 403)
}

export function notFound(message = "Recurso no encontrado") {
  return error("NOT_FOUND", message, 404)
}

export function conflict(message = "Conflicto") {
  return error("CONFLICT", message, 409)
}

export function serverError(message = "Error interno del servidor") {
  return error("INTERNAL_ERROR", message, 500)
}
