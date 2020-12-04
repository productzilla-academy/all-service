import Context from "../../context";
import Career, { Level } from "./career";

export default interface CareerManager {
  createCareer(context: Context, career: Career): Promise<void>
  fetchCareer(context: Context): Promise<Career[]>
  deleteCareer(context: Context, careerName: string): Promise<void>
  
  createCareerLevel(context: Context, careerName: string, level: Level): Promise<void>
  fetchCareerLevel(context: Context, careerName: string): Promise<Level[]>
  deleteLevel(context: Context, levelUUID: string): Promise<void>

}