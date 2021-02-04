import { Request, Response } from "express"
import ConfigProvider from "../../../config"
import CoreManager from "../../../core/core.manager"
import HttpProxy from 'http-proxy'
import { getCourseUUID } from "./course"
import { URL } from "url"

const proxy = new HttpProxy()
export const assetController = (configProvider: ConfigProvider, m: CoreManager) => ({
  async fetchfile(r: Request, w: Response){
    const file = r.params['0']
    const course = getCourseUUID(r)
    const target = await m.objectStorage().getObjectUrl(r.context, course, file)
    const urlTarget = new URL(target)
    proxy.web(r, w, {
      ignorePath: true,
      target
    })
    proxy.on(`proxyReq`, (req) => {
      req.setHeader(`Host`, urlTarget.host)
    })
  }
})

export default assetController