import Context from "../../context"
import Career, { Level } from "./career"

export default interface CareerManager {
  createCareer(context: Context, career: Career): Promise<void>
  fetchCareer(context: Context): Promise<Career[]>
  deleteCareer(context: Context, careerName: string): Promise<void>
  
  createLevel(context: Context, level: Level): Promise<void>
  fetchLevel(context: Context): Promise<Level[]>
  deleteLevel(context: Context, levelName: string): Promise<void>
}