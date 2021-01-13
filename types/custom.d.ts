import { Request, Response } from "express";

interface File {

}
interface FileUpload {
  [key: string]: File
}

declare global {
  namespace Express {
    interface Request {

    }
    interface Respose {
      
    }
  }
  
}
