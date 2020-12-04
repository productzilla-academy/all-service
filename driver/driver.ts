import ConfigProvider from "../config"
import { Registry } from "./driver.registry"

export interface Driver {
  configuration(): ConfigProvider
  registry(): Registry
  callRegistry(): Driver
}
export default Driver