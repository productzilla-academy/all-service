import CoreManager from "../../core/core.manager"
import ConfigProvider from "../../config"
import HandlerProvider from "../provider"
import express from 'express'
import {Server, createServer} from 'http'
import { RestRouter } from "./router"
export default class HttpHandler implements HandlerProvider{
  m: CoreManager
  configProvider: ConfigProvider

  app: Server
  constructor(m: CoreManager, configProvider: ConfigProvider) {
    this.m = m
    this.configProvider = configProvider
    const app = express()
    
    app.use(RestRouter(configProvider, m))

    this.app = createServer(app)
  }
  serve(): void {
    this.app.listen(this.configProvider.listenPort(), this.configProvider.listenHost(), () => {
      this.configProvider.logger().info(`app started on ${this.configProvider.listenHost()}:${this.configProvider.listenPort()}`)
    })
  }
  manager(): CoreManager {
    return this.m
  }
  configuration(): ConfigProvider {
    return this.configProvider
  }

}