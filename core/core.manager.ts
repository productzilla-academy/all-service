import AssetManager from "./assets";
import CareerManager from "./careers";
import CourseManager from "./courses";
import EnrollmentManager from "./enrollment";
import TransactionManager from "./transactions";

export interface CoreManager {
  assetManager(): AssetManager
  careerManager(): CareerManager
  courseManager(): CourseManager
  enrollmentManager(): EnrollmentManager
  transactionManager(): TransactionManager
}

export default CoreManager