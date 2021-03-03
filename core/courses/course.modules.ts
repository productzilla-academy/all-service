
// type Module struct {
// 	core.General

import { General } from "../core.types"
import Course from "./course"
import Quiz from "./course.quiz"

export enum ModuleType {
  Module = 'module',
  Assesment = 'assesment'
}

export enum Quality {
  sd ='sd',
  hd = 'hd',
  fhd = 'fhd',
  uhd = 'uhd',
  Q4k = '4k',
  Q8k = '8k',
  Q144p = '144p',
  Q240p = '240p',
  Q360p = '360p',
  Q480p = '480p',
  Q720p = '720p',
  Q1080p = '1080p',
}
export interface Material {
  url: string,
  quality: Quality
}
export interface Module extends General{
  course: Course
  parent_module?: Module
  sub_modules_count?: number
  content: string
  type: ModuleType
  quiz?: Quiz
  weight: number
  number: number
  material: Material[]
}

export interface HerarcialModule {
  uuid: string,
  name: string,
  type: ModuleType
  sub_modules: HerarcialModule[]
}

export default Module