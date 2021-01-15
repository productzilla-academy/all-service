import { Response } from "express";
import ConfigProvider from "../../../config";
import { Level } from "../../../core/careers";
import CoreManager from "../../../core/core.manager";
import { Course } from "../../../core/courses";
import { RestRequest } from "../types";
import { getPage, getSize } from "./global";
import { to } from 'await-to-js'
import { Paginated } from "../../../core/core.types";
import { getCareerName } from "./career";
import { UploadedFile } from "express-fileupload";


export const courseParams = {
  uuid: 'course_uuid',
  tutor: 'tutor',
  level: 'level'
}

export const getCourseUUID = (r: RestRequest): string => r.params[courseParams.uuid] || r.body[courseParams.uuid]

export const getTutor = (r: RestRequest): string => r.params[courseParams.tutor] || r.body[courseParams.tutor]

export const getLevel = (r: RestRequest): string => r.params[courseParams.level] || r.query[courseParams.level] as string

export const getImage = (r: RestRequest): UploadedFile => r.files.image as UploadedFile

export const getCourseBody = (r: RestRequest): Course => ({
  uuid: getCourseUUID(r),
  description: r.body.description,
  name: r.body.name,
  open: r.body.open ? new Date(r.body.open) : new Date(),
  status: r.body.status,
  tutor: getTutor(r),
  overview: r.body.overview,
  career: r.body.career
})

export const courseController = (c: ConfigProvider, m: CoreManager) => ({
  async createCourse(r: RestRequest, w: Response){
    const course = getCourseBody(r)
    const res = await m.courseManager().storage().createCourse(r.context, course)
    return w.status(201).send(res)
  },
  async fetchCourse(r: RestRequest, w: Response){
    const [
      page,
      size,
      level,
      tutor
    ] = [getPage(r), getSize(r), getLevel(r), getTutor(r)]
    const courses = await m.courseManager().storage().fetchCourses(r.context, {
      pagination: {
        page, size
      },
      search: {
        level, tutor
      }
    })
    w.send(courses)
  },
  async fetchCourseByCareer(r: RestRequest, w: Response){
    const levels = await m.careerManager().fetchLevel(r.context)
    const p: Promise<[Error, Paginated<Course[]>]>[] = []
    for (const i in levels) {
      const level = levels[i]
      p.push(
        to(
          m.courseManager()
          .storage()
          .fetchCourses(
            r.context, {
              search: {
                level: level.name,
                career: getCareerName(r)
              }
            }
          )
        )
      )
    }
    const l = await Promise.all(p)
    interface CourseLevel {
      level: Level
      courses: Paginated<Course[]>
    }
    const result: CourseLevel[] = []
    for (const i in levels) {
      const courses = l[i][1]
      result.push({
        level: {
          ...levels[i]
        },
        courses: courses || { data: [] as Course[], pagination: { page: 0, total_page: 0, total_size: 0, size: 0 }} 
      })
    }
    w.send(result)
  },
  async getCourse(r: RestRequest, w: Response){
    const course = await m.courseManager().storage().getCourse(r.context, getCourseUUID(r))
    w.send(course)
  },
  async updateCourse(r: RestRequest, w: Response){
    const course = await m.courseManager().storage().updateCourse(r.context, getCourseUUID(r), getCourseBody(r))
    w.status(202).send(course)
  },
  async deleteCourse(r: RestRequest, w: Response){
    const course = await m.courseManager().storage().deleteCourse(r.context, getCourseUUID(r))
    w.status(202).send(course)
  },
  async updateCover(r: RestRequest, w: Response){
    const image = getImage(r)
    const course = await m.courseManager().objectStorage().changeCourseCover(r.context, getCourseUUID(r), image.data)
    w.status(201).send(course)
  }
})

export default courseController