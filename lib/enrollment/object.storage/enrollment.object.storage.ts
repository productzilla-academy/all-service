import Context from "../../../context";
import { Student } from "../../../core/enrollment/enroll";
import { EnrollmentObjectStorageManager } from "../../../core/enrollment/enrollment.manager"
import ObjectStorage, { ObjectStorageProvider } from "../../object.storage"
import ConfigProvider from "../../../config"
import fileType from 'file-type'
import { BadRequestError } from "../../../errors";

export default class EnrollmentObjectStorageProvider implements EnrollmentObjectStorageManager {
  objectStorage: ObjectStorageProvider
  
  constructor(configProvider: ConfigProvider) {
    this.objectStorage = ObjectStorage(configProvider)
  }
  async uploadFileAnswer(context: Context, student: Student, courseUUID: string, moduleUUID: string, quizUUID: string, questionUUID: string, file: Buffer): Promise<string> {
    const f = await fileType.fromBuffer(file)
    await this.objectStorage.uploadFile(context, `student-${student.username}`, `courses/${courseUUID}/modules/${moduleUUID}/quizes/${quizUUID}/questions/${questionUUID}/answer.${f.ext}`, file, true)
    return `student-${student.username}/courses/${courseUUID}/modules/${moduleUUID}/quizes/${quizUUID}/questions/${questionUUID}/answer.${f.ext}`
  }

} 