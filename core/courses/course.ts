import { Level } from "../career";
import { General } from "../core.types";

export default interface Course extends General {
  level: Level
  creator: string
}