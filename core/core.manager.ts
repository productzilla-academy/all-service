import AssetManager from "./assets"
import CareerManager from "./careers"
import ObjectStorageManager from "./core.object.storage.manager"
import CourseManager from "./courses"
import EnrollmentManager from "./enrollment"
import TransactionManager from "./transactions"


export interface CoreManager {
  assetManager(): AssetManager
  careerManager(): CareerManager
  courseManager(): CourseManager
  enrollmentManager(): EnrollmentManager
  transactionManager(): TransactionManager
  
  setAssetManager(m: AssetManager)
  setCareerManager(m: CareerManager)
  setCourseManager(m: CourseManager)
  setEnrollmentManager(m: EnrollmentManager)
  setTransactionManager(m: TransactionManager)

  objectStorage(): ObjectStorageManager
  setObjectStorage(m: ObjectStorageManager)
}

export default CoreManager