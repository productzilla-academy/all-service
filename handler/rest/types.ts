import { Request } from "express"
import Context from "../../context"

export interface RestRequest extends Request {
  context: Context
}