import ConfigProvider from "../config"
import AssetManager from "./assets"
import CareerManager from "./careers"
import CoreManager from "./core.manager"
import CourseManager from "./courses"
import EnrollmentManager from "./enrollment"
import TransactionManager from "./transactions"

export default class CoreManagerDefault implements CoreManager {
  configProvider: ConfigProvider
  am: AssetManager
  cm: CareerManager
  crm: CourseManager
  em: EnrollmentManager
  tm: TransactionManager

  constructor(configProvider: ConfigProvider){
    this.configProvider = configProvider
  }
  assetManager(): AssetManager {
    return this.am
  }
  careerManager(): CareerManager {
    return this.cm
  }
  courseManager(): CourseManager {
    return this.crm
  }
  enrollmentManager(): EnrollmentManager {
    return this.em
  }
  transactionManager(): TransactionManager {
    return this.tm
  }
  
  setAssetManager(m: AssetManager) {
    this.am = m
  }
  setCareerManager(m: CareerManager) {
    this.cm = m
  }
  setCourseManager(m: CourseManager) {
    this.crm = m
  }
  setEnrollmentManager(m: EnrollmentManager) {
    this.em = m
  }
  setTransactionManager(m: TransactionManager) {
    this.tm = m
  }
} 