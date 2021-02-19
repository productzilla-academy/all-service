import { Response } from "express"
import { UploadedFile } from "express-fileupload"
import ConfigProvider from "../../../config"
import CoreManager from "../../../core/core.manager"
import { Module } from "../../../core/courses"
import { FileUpload } from "../../../types/custom"
import { RestRequest } from "../types"
import { getCourseUUID, getImage } from "./course"
import { getFileName, getFiles } from "./global"

export const moduleParams = {
  moduleUUID: 'module_uuid'
}

export const getModuleUUID = (r: RestRequest): string => r.params[moduleParams.moduleUUID]

export const getMaterial = (r: RestRequest): UploadedFile => r.files.material as UploadedFile

export const getModuleBody = (r: RestRequest): Module => ({
  content: r.body.content,
  description: r.body.description,
  name: r.body.name,
  number: r.body.number,
  uuid: getModuleUUID(r),
  weight: r.body.weight,
  overview: r.body.overview,
  parent_module: r.body.parent_module,
  type: r.body.type
} as Module)

export const moduleController = (c: ConfigProvider, m: CoreManager) => ({
  async fetchModules(r: RestRequest, w: Response){
    let modules = await m.courseManager().storage().fetchModules(r.context, getCourseUUID(r))
    
    w.send(modules)
  },
  async getModules(r: RestRequest, w: Response){
    const module = await m.courseManager().storage().getModule(r.context, getCourseUUID(r), getModuleUUID(r))
    w.send(module)
  },
  async createModule(r: RestRequest, w: Response){
    const module = getModuleBody(r)
    const res = await m.courseManager().storage().createModule(r.context, getCourseUUID(r), module)
    w.status(201).send(res)
  },
  async updateModule(r: RestRequest, w: Response){
    const module = getModuleBody(r)
    const res = await m.courseManager().storage().updateModule(r.context, getCourseUUID(r), getModuleUUID(r), module)
    w.status(201).send(res)
  },
  async deleteModule(r: RestRequest, w: Response){
    const res = await m.courseManager().storage().deleteModule(r.context, getCourseUUID(r), getModuleUUID(r))
    w.status(201).send(res)
  },
  async herarcialModules(r: RestRequest, w: Response){
    const h = await m.courseManager().storage().herarcialModules(r.context, getCourseUUID(r))
    w.send(h)
  },
 
  async updateCover(r: RestRequest, w: Response){
    const image = getImage(r)
    const course = await m.courseManager().objectStorage().uploadModuleCover(r.context, getCourseUUID(r), getModuleUUID(r), image.data)
    w.status(201).send(course)
  },
  async updateMaterial(r: RestRequest, w: Response){
    const material = getMaterial(r)
    const course = await m.courseManager().objectStorage().uploadModuleMaterial(r.context, getCourseUUID(r), getModuleUUID(r), material.data)
    w.status(201).send(course)
  },
  async uploadFiles(r: RestRequest, w: Response){
    const f = getFiles(r)
    const files = Array.isArray(f) && f || [f as UploadedFile] 
    const promises: Promise<void>[] = []
    for (const p in files) {
      const file = files[p]
      promises.push(
        m.courseManager().objectStorage().uploadModuleFile(r.context, getCourseUUID(r), getModuleUUID(r), file.data, file.name)
      )
    }
    await Promise.all(promises)
    w.status(201).send({
      message: 'success'
    })
  },
  async fileList(r: RestRequest, w: Response){
    const list = await m.courseManager().objectStorage().fetchModuleFiles(r.context, getCourseUUID(r), getModuleUUID(r))
    w.send(list)
  },
  async deleteFile(r: RestRequest, w: Response){
    await m.courseManager().objectStorage().deleteModuleFile(r.context, getCourseUUID(r), getModuleUUID(r), getFileName(r))
    w.status(202).send({
      message: 'success'
    })

  }  
})

export default moduleController