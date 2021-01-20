import { Generic } from "../core.types"
import Course from "../courses/course"
import { BillingPlan } from "../transactions/billing"
export interface Student {
  username: string
}
export interface Enrollment extends Generic {
  course: Course
  billing_plan?: BillingPlan
  student: Student
  open: Date
  expire?: Date
  process?: number
}