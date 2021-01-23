import ConfigProvider from "../../../config"
import Context from "../../../context"
import { CourseObjectStorageManager } from "../../../core/courses"
import ObjectStorage, { ObjectStorageProvider } from "../../object.storage"
import fileType from 'file-type'
import { BadRequestError } from "../../../errors"
import { PipeFunction } from "../../../core/core.object.storage.manager"


export default class CourseObjectStorageProvider implements CourseObjectStorageManager {
  configProvider: ConfigProvider
  objectStorage: ObjectStorageProvider
  constructor (configProvider: ConfigProvider) {
    this.configProvider = configProvider
    this.objectStorage = ObjectStorage(configProvider)
  }
  async changeCourseCover (context: Context, courseUUID: string, file: Buffer): Promise<void> {
    const f = await fileType.fromBuffer(file)
    if (f.mime.toString().indexOf('image/') === -1) throw BadRequestError(`Wrong uploaded mime type: expect mime image/*`)
    await this.objectStorage.uploadFile(context, courseUUID, `images/cover`, file, true)
  }
  pipeCourseCover (context: Context, courseUUID: string, pipe: PipeFunction): void {
    this.objectStorage.pipeFile(context, courseUUID, `images/cover`, pipe)
  }
  async deleteCourseFile (context: Context, couresUUID: string, objectID: string): Promise<void> {
    await this.objectStorage.deleteFile(context, couresUUID, `files/${objectID}`)
  }
  async fetchCourseFiles (context: Context, courseUUID: string): Promise<string[]> {
    const list = await this.objectStorage.listFile(context, courseUUID, 'files')
    return list
  }
  pipeCourseFile(context: Context, courseUUID: string, fileName: string, pipe: PipeFunction): void {
    this.objectStorage.pipeFile(context, courseUUID, `files/${fileName}`, pipe)
  }
  pipeModuleCover (context: Context, courseUUID: string, moduleUUID: string, pipe: PipeFunction): void {
    this.objectStorage.pipeFile(context, courseUUID, `modules/${moduleUUID}/images/cover`, pipe)
  }
  async fetchModuleFiles (context: Context, courseUUID: string, moduleUUID: string): Promise<string[]> {
    const list = await this.objectStorage.listFile(context, courseUUID, `modules/${moduleUUID}`)
    return list
  }
  async deleteModuleFile (context: Context, courseUUID: string, moduleUUID: string, objectID: string): Promise<void> {
    await this.objectStorage.deleteFile(context, courseUUID, `modules/${moduleUUID}/${objectID}`)
  }
  pipeModuleFile (context: Context, courseUUID: string, moduleUUID: string, fileName: string, pipe: PipeFunction): void {
    this.objectStorage.pipeFile(context, courseUUID, `modules/${moduleUUID}/${fileName}`, pipe)
  }
  async uploadCourseFile(context: Context, courseUUID: string, file: Buffer, filename: string): Promise<void> {
    this.objectStorage.uploadFile(context, courseUUID, `files/${filename}`, file)
  }
  async uploadModuleCover(context: Context, courseUUID: string, moduleUUID: string, cover: Buffer): Promise<void> {
    const f = await fileType.fromBuffer(cover)
    if (f.mime.toString().indexOf('image/') === -1) throw BadRequestError(`Wrong uploaded mime type: expect mime image/*`)
    await this.objectStorage.uploadFile(context, courseUUID, `modules/${moduleUUID}/images/cover`, cover, true)
  }
  async uploadModuleFile(context: Context, courseUUID: string, moduleUUID: string, file: Buffer, filename: string): Promise<void> {
    this.objectStorage.uploadFile(context, courseUUID, `modules/${moduleUUID}/files/${filename}`, file)
  }
  async uploadModuleMaterial(context: Context, courseUUID: string, moduleUUID: string, file: Buffer): Promise<void> {
    const f = await fileType.fromBuffer(file)
    if (f.mime.toString().indexOf('video') === -1 && f.mime.toString().indexOf('pdf') === -1) throw BadRequestError(`Wrong uploaded mime type: expect mime video or pdf`)
    this.objectStorage.uploadFile(context, courseUUID, `modules/${moduleUUID}/material`, file)
  }
  async pipeModuleMaterial(context: Context, courseUUID: string, moduleUUID: string, pipe: PipeFunction): Promise<void> {
    this.objectStorage.pipeFile(context, courseUUID,`modules/${moduleUUID}/material`, pipe)
  }
  
}