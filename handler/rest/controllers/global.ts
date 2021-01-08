import { RestRequest } from "../types";

export const globalParams = {
  page: 'page',
  size: 'size'
}

export const getPage = (r: RestRequest): number => r.query[globalParams.page]  as any as number || 1
export const getSize = (r: RestRequest): number => r.query[globalParams.size]  as any as number || 10