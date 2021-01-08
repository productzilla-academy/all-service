import { Generic } from "../core.types";

export interface Career {
  name: string
  created?: Date
  updated?: string
  id?: number
}
export interface Level  extends Generic {
  name: string
  description?: string
  career: Career
  number: number
}
export default Career