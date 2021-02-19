import { Response } from "express"
import ConfigProvider from "../../../config"
import { Career, Level } from "../../../core/careers"
import CoreManager from "../../../core/core.manager"
import { RestRequest } from "../types"

export const careerParam = {
  level: 'level_name',
  name: 'career_name'
}
export const getLevelName = (r: RestRequest): string => r.params[careerParam.level]
export const getCareerName = (r: RestRequest): string => r.params[careerParam.name] && r.params[careerParam.name].toLocaleLowerCase().split(' ').join('-') 

const getCareerBody = (r: RestRequest): Career => ({
  name: r.body.name  && r.body.name.toLocaleLowerCase().split(' ').join('-') ,
  description: r.body.description
})

const getLevelBody = (r: RestRequest): Level => ({
  name: r.body.name,
  number: r.body.number,
  description: r.body.description
})

export const careerController = (configProvider: ConfigProvider, m: CoreManager) => ({
  async createCareer(r: RestRequest, w: Response) {
    const career = getCareerBody(r)
    await m.careerManager().createCareer(r.context, career)
    w.status(201).send(career)
  },
  async fetchCareer(r: RestRequest, w: Response) {
    const c = await m.careerManager().fetchCareer(r.context)
    w.status(200).send(c)
  },
  async getCareer(r: RestRequest, w: Response) {
    const c = await m.careerManager().getCareer(r.context, getCareerName(r))
    w.status(200).send(c)
  },
  async deleteCareer(r: RestRequest, w: Response) {
    const c = await m.careerManager().deleteCareer(r.context, getCareerName(r))
    w.status(202).send(c)
  },
  async fetchLevel(r: RestRequest, w: Response) {
    const c = await m.careerManager().fetchLevel(r.context)
    w.status(200).send(c)
  },
  async getLevel(r: RestRequest, w: Response) {
    const c = await m.careerManager().getLevel(r.context, getLevelName(r))
    w.status(200).send(c)
  },
  async createLevel(r: RestRequest, w: Response) {
    const c = await m.careerManager().createLevel(r.context, getLevelBody(r))
    w.status(201).send(c)
  },
  async deleteLevel(r: RestRequest, w: Response) {
    const c = await m.careerManager().deleteLevel(r.context, getLevelName(r))
    w.status(202).send(c)
  },
})

export default careerController