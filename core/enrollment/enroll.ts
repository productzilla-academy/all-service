import { Generic } from "../core.types";
import Course from "../courses/course";
export interface Student {
  username: string
}
export interface Enrollment extends Generic {
  course: Course
  students: Student
  open: Date
  expire?: Date
}