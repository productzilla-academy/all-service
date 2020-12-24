import CoreManager from "../core/core.manager"
import CoreManagerDefault from "../core/core.manager.default"
import HandlerProvider from "../handler/provider"
import ConfigProvider from "../config"
import Registry from "./driver.registry"
import RegistryBase from "./driver.registry.base"


export class RegistryDefault extends RegistryBase implements Registry {
  configProvider: ConfigProvider

  constructor(configProvider: ConfigProvider
) {
    super()
    this.configProviderconfigProvider
    const m = new CoreManagerDefault(c)
    this.set(this).setConfig(c).setManager(m)
  }
  init(): void {

  }
  handler(): HandlerProvider {
    return super.handler()
  }
  configuration(): ConfigProvider{
    return this.c
  }
  manager(): CoreManager {
    return this.m
  }
}

export default RegistryDefault