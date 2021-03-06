import ConfigProvider from "../../../config"
import Context from "../../../context"
import CareerManager, { Career, Level } from "../../../core/careers"
import { SQLDBProtocols } from "../../storage/storage.types"
import CareerElasticsearchProvider from "./elasticsearch/careers.elasticsearch.storage.provider"
import CareerSQLProvider from "./sql/careers.sql.storage.provider"
export class CarrerStorageProvider implements CareerManager{
  configProvider: ConfigProvider

  hotDB: CareerManager
  coldDB: CareerManager
  
  constructor(configProvider: ConfigProvider){
    this.configProvider = configProvider
    this.coldDB = SQLDBProtocols.indexOf(this.configProvider.dsnProtocol()) >= 0 ? new CareerSQLProvider(configProvider): null 
    this.hotDB = !configProvider.elasticsearchURL() ? null : new CareerElasticsearchProvider(configProvider)
  }
  async getCareer(context: Context, name: string): Promise<Career> {
    const career = this.hotDB ? await this.hotDB.getCareer(context, name) : await this.coldDB.getCareer(context, name)
    return career
  }
  async getLevel(context: Context, name: string): Promise<Level> {
    const career = this.hotDB ? await this.hotDB.getLevel(context, name) : await this.coldDB.getLevel(context, name)
    return career
  }
  async createCareer(context: Context, career: Career): Promise<void> {
    const p = [this.coldDB.createCareer(context, career)]
    this.hotDB && p.push(this.hotDB.createCareer(context, {...career, name: career.name.toLowerCase().replace(' ', '-')}))
    const [r] = await Promise.all(p)
    return r
  }
  async fetchCareer(context: Context): Promise<Career[]> {
    const careers = this.hotDB ? await this.hotDB.fetchCareer(context) : await this.coldDB.fetchCareer(context)
    return careers
  }
  async deleteCareer(context: Context, careerName: string): Promise<void> {
    this.coldDB && await this.coldDB.deleteCareer(context, careerName)
    this.hotDB && await this.hotDB.deleteCareer(context, careerName)
  }
  async createLevel(context: Context, level: Level): Promise<void> {
    this.coldDB && await this.coldDB.createLevel(context, level)
    this.hotDB && await this.hotDB.createLevel(context, level)
  }
  async fetchLevel(context: Context): Promise<Level[]> {
    const levels = this.hotDB ? await this.hotDB.fetchLevel(context) : await this.coldDB.fetchLevel(context)
    return levels
  }
  async deleteLevel(context: Context, levelUUID: string): Promise<void> {
    this.coldDB && await this.coldDB.deleteLevel(context, levelUUID)
    this.hotDB && await this.hotDB.deleteLevel(context,  levelUUID)
  }
}
export default CarrerStorageProvider