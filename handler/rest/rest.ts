import CoreManager from "../../core/core.manager"
import ConfigProvider from "../../config"
import HandlerProvider from "../provider"
import express from 'express'
import {Server, createServer} from 'http'
export default class HttpHandler implements HandlerProvider{
  m: CoreManager
  configProvider: ConfigProvider

  app: Server
  constructor(m: CoreManager, configProvider: ConfigProvider
) {
    this.m = m
    this.configProviderconfigProvider
    const app = express()
    app.use(`/`, router(c, m))

    this.app = createServer(app)
  }
  serve(): void {
    this.app.listen(this.c.listenPort(), this.c.listenHost(), () => {
      this.c.logger().info(`app started on ${this.c.listenHost()}:${this.c.listenPort()}`)
    })
  }
  manager(): CoreManager {
    return this.m
  }
  configuration(): ConfigProvider {
    return this.c
  }

}