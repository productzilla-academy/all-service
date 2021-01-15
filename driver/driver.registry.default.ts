import CoreManager from "../core/core.manager"
import CoreManagerDefault from "../core/core.manager.default"
import HandlerProvider from "../handler/provider"
import ConfigProvider from "../config"
import Registry from "./driver.registry"
import RegistryBase from "./driver.registry.base"
import CarrerStorageProvider from "../lib/careers"
import CourseProvider from "../lib/courses"
import ObjectStorage from "../lib/object.storage"


export class RegistryDefault extends RegistryBase implements Registry {
  configProvider: ConfigProvider

  constructor(configProvider: ConfigProvider) {
    super()
    this.configProvider = configProvider
    const m = new CoreManagerDefault(configProvider)
    m.setCareerManager(new CarrerStorageProvider(configProvider))
    m.setCourseManager(new CourseProvider(configProvider))
    m.setObjectStorage(ObjectStorage(configProvider))
    this.set(this).setConfig(configProvider).setManager(m)
  }
  init(): void {

  }
  handler(): HandlerProvider {
    return super.handler()
  }
  configuration(): ConfigProvider{
    return this.configProvider
  }
  manager(): CoreManager {
    return this.m
  }
}

export default RegistryDefault