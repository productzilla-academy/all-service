import { Response } from "express";
import ConfigProvider from "../../../config";
import { Career, Level } from "../../../core/careers";
import CoreManager from "../../../core/core.manager";
import { RestRequest } from "../types";

export const careerParam = {
  uuid: 'level_uuid',
  name: 'career_name'
}
export const getLevelUUID = (r: RestRequest): string => r.params[careerParam.uuid]
export const getCareerName = (r: RestRequest): string => r.params[careerParam.name]

const getCareerBody = (r: RestRequest): Career => ({
  name: r.body.name,
})

const getLevelBody = (r: RestRequest): Level => ({
  name: r.body.name,
  career: {
    name: getCareerName(r)
  },
  description: r.body.description,
  uuid: undefined,
  number: r.body.number
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
  async deleteCareer(r: RestRequest, w: Response) {
    const c = await m.careerManager().deleteCareer(r.context, getCareerName(r))
    w.status(202).send(c)
  },
  async fetchCareerLevel(r: RestRequest, w: Response) {
    const c = await m.careerManager().fetchCareerLevel(r.context, getCareerName(r))
    w.status(200).send(c)
  },
  async createCareerLevel(r: RestRequest, w: Response) {
    const c = await m.careerManager().createCareerLevel(r.context, getCareerName(r), getLevelBody(r))
    w.status(201).send(c)
  },
  async deleteCareerLevel(r: RestRequest, w: Response) {
    const c = await m.careerManager().deleteLevel(r.context, getLevelUUID(r))
    w.status(202).send(c)
  },
})

export default careerController