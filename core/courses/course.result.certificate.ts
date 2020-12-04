import { Generic } from "../core.types";
import Course from "./course";

export default interface Certificate extends Generic {
  course: Course
  weight_goal: number
  format: string
}