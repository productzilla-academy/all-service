import EnrollmentManager from "../../core/enrollment"
import { EnrollmentStorageManager } from "../../core/enrollment/enrollment.manager"
import ConfigProvider from "../../config"

export class EnrollmentProvider implements EnrollmentManager{
  st: EnrollmentStorageManager

  constructor(configProvider: ConfigProvider) {
    this.st = new EnrollmentStorageManager(configProvider)
  }
  storage(): EnrollmentStorageManager {
    return this.st
  }

}