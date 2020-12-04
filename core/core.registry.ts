import ConfigProvider from "../config"
import CoreManager from "./core.manager"

export interface CoreRegistry {
  manager(): CoreManager
  configuration(): ConfigProvider
}

export default CoreRegistry