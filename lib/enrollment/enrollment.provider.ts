import EnrollmentManager from "../../core/enrollment"
import { EnrollmentObjectStorageManager, EnrollmentStorageManager } from "../../core/enrollment/enrollment.manager"
import EnrollmentStorageProvider from './storage/enrollment.storage.provider'
import EnrollmentObjectStorageProvider from './object.storage/enrollment.object.storage'
import ConfigProvider from "../../config"

export default class EnrollmentProvider implements EnrollmentManager{
  st: EnrollmentStorageManager
  os: EnrollmentObjectStorageManager
  constructor(configProvider: ConfigProvider) {
    this.st = new EnrollmentStorageProvider(configProvider)
    this.os = new EnrollmentObjectStorageProvider(configProvider)
  }
  objectStorage(): EnrollmentObjectStorageManager {
    return this.os
  }
  storage(): EnrollmentStorageManager {
    return this.st
  }

}