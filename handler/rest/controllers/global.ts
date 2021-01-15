import { UploadedFile } from "express-fileupload"
import { RestRequest } from "../types"

export const globalParams = {
  page: 'page',
  size: 'size',
  filename: 'filename'
}

export const getPage = (r: RestRequest): number => r.query[globalParams.page]  as any as number || 1
export const getSize = (r: RestRequest): number => r.query[globalParams.size]  as any as number || 10
export const getFiles = (r: RestRequest): UploadedFile | UploadedFile[] => r.files.files
export const getFileName = (r: RestRequest): string => r.params[globalParams.filename]