
export class HttpError extends Error{
  code?: number
  error?: Error
  constructor(code: number, message: string, error?: Error) {
    super(message)
    this.error = error
    this.code = code
  }
}

export const NotFoundError = (message: string, error?: Error) => {
  return new HttpError(404, message, error)
}

export const ExistsError = (message: string, error?: Error) => {
  return new HttpError(409, message, error)
}

export const UnauthenticatedError = (message: string, error?: Error) => {
  return new HttpError(401, message, error)
}

export const UnauthorizedError = (message: string, error?: Error) => {
  return new HttpError(403, message, error)
}

export const InternalServerError = (message: string, error?: Error) => {
  return new HttpError(500, message, error)
}

export const BadGatewayError = (message: string, error?: Error) => {
  return new HttpError(502, message, error)
}

export const PrecondtionError = (message: string, error?: Error) => {
  return new HttpError(406, message, error)
}

export const BadRequestError = (message: string, error?: Error) => {
  return new HttpError(400, message, error)
}

export const DuplicateError = (message: string, error?: Error) => {
  return new HttpError(409, message, error)
}
