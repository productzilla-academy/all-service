import { Request, Response } from "express"
import Context from '../context'
interface File {

}
interface FileUpload {
  [key: string]: File
}

declare global {
  namespace Express {
    interface Request {
      context: Context
    }
    interface Respose {
      
    }
  }
  
}
