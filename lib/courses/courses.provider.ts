import ConfigProvider from "../../config";
import Context from "../../context";
import CourseManager, { CourseObjectStorageManager, CourseStorageManager } from "../../core/courses";
import CourseObjectStorageProvider from "./object.storage/course.object.storage";
import CourseStorageProvider from "./storage/courses.storage.provider";

export default class CourseProvider implements CourseManager{
  oS: CourseObjectStorageManager
  st: CourseStorageManager

  constructor(configProvider: ConfigProvider) {
    this.oS = new CourseObjectStorageProvider(configProvider)
    this.st = new CourseStorageProvider(configProvider)
  }
  objectStorage(): CourseObjectStorageManager {
    return this.oS
  }
  storage(): CourseStorageManager {
    return this.st
  }


}