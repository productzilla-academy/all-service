'use strict'

import { NextFunction, Request, Response } from "express"
import { BaseLogger } from "pino"
import { HttpError } from "../../../errors"

const getErrorMessage = (err: Error) => err.message || 'internal_server_error'

export const catchMiddleware = (log: BaseLogger) => {

  return (e: HttpError, r: Request, w: Response, n: NextFunction) => {
      if (w.headersSent) {
        return n(e)
      }
      const errMessage = getErrorMessage(e)
      if (e.code === 500 || typeof e.code !== 'number' || !e.code) {
        log.error({
          message: errMessage,
          error: e,
          stacktrace: e.stack
        })
      }
      w.status(e.code && typeof e.code === 'number' && e.code || 500).send({ message: errMessage})
    }
    
} 

export default catchMiddleware