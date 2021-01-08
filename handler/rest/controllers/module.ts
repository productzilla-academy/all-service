import { Response } from "express"
import ConfigProvider from "../../../config"
import CoreManager from "../../../core/core.manager"
import { Module } from "../../../core/courses"
import { RestRequest } from "../types"
import { getCourseUUID } from "./course"

export const moduleParams = {
  moduleUUID: 'module_uuid'
}

export const getModuleUUID = (r: RestRequest): string => r.params[moduleParams.moduleUUID]

export const getModuleBody = (r: RestRequest): Module => ({
  content: r.body.content,
  description: r.body.description,
  name: r.body.name,
  number: r.body.number,
  uuid: getModuleUUID(r),
  weight: r.body.weight,
  overview: r.body.overview,
  parent_module: r.body.parent_module
} as Module)

interface HerarcialModule {
  uuid: string
  name: string
  sub_modules: HerarcialModule[] 
}

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
  }
})

export default moduleController