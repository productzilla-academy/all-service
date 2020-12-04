import ConfigProvider, { Config } from "../config"
import { Driver } from "./driver"
import Registry from "./driver.registry"
import RegistryDefault from "./driver.registry.default"

export default class DriverDefault implements Driver {
  private c: ConfigProvider
  private r: Registry
  constructor(){
    this.c = new Config()
    this.r = new RegistryDefault(this.c)
  }
  configuration(): ConfigProvider {
    return this.c
  }
  registry(): Registry {
    return this.r
  }
  callRegistry(): Driver {
    throw new Error("Method not implemented.")
  }

}