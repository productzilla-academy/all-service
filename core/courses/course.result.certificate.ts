import { Generic } from "../core.types"
import Course from "./course"
export interface Certificate extends Generic {
  course: Course
  weight_goal: number
  format: string
  caption: string
}
export default Certificate