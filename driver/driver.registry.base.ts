import CoreManager from "../core/core.manager"
import CoreRegistry from "../core/core.registry"
import RestHandler from "../handler/rest"
import HandlerProvider from "../handler/provider"
import ConfigProvider from "../config"
import Registry from "./driver.registry"

export class RegistryBase {
  protected r: CoreRegistry
  protected configProvider: ConfigProvider

  protected h: HandlerProvider
  protected m: CoreManager
  set(r: Registry): RegistryBase {
    this.r = r
    return this
  }
  setConfig(configProvider: ConfigProvider
): RegistryBase {
    this.configProviderconfigProvider
    return this
  }
  setManager(m: CoreManager): RegistryBase {
    this.m = m
    return this
  }
  protected handler(): HandlerProvider {
    if (!this.h) this.h = new RestHandler(this.m, this.c)
    return this.h
  }
}

export default RegistryBase