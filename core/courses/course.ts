import { Level } from "../careers";
import { General, Resource } from "../core.types";

export default interface Course extends General {
  level: Level
  creator: string
  resources: Resource
  open: Date
}