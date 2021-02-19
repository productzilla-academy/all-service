import ConfigProvider from "../../../../config"
import Context from "../../../../context"
import CareerManager, { Career, Level } from "../../../../core/careers"

export default class CareerElasticsearchProvider implements CareerManager {
  configProvider: ConfigProvider

  constructor(configProvider: ConfigProvider){
    this.configProvider = configProvider
  }
  getCareer(context: Context, name: string): Promise<Career> {
    throw new Error("Method not implemented.")
  }
  getLevel(context: Context, name: string): Promise<Level> {
    throw new Error("Method not implemented.")
  }
  deleteLevel(context: Context, levelName: string): Promise<void> {
    throw new Error("Method not implemented.")
  }
  createLevel(context: Context, level: Level): Promise<void> {
    throw new Error("Method not implemented.")
  }
  fetchLevel(context: Context): Promise<Level[]> {
    throw new Error("Method not implemented.")
  }
  
  createCareer(context: Context, career: Career): Promise<void> {
    throw new Error("Method not implemented.")
  }
  fetchCareer(context: Context): Promise<Career[]> {
    throw new Error("Method not implemented.")
  }
  deleteCareer(context: Context, careerName: string): Promise<void> {
    throw new Error("Method not implemented.")
  } 
}