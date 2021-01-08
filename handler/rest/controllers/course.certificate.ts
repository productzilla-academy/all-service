import { Response } from "express";
import ConfigProvider from "../../../config";
import CoreManager from "../../../core/core.manager";
import { Certificate } from "../../../core/courses";
import { RestRequest } from "../types";
import { getCourseUUID } from "./course";

export const certificateParams = {
  certificateUUID: 'certificate_uuid'
}
export const getCertificateBody = (r: RestRequest): Certificate => ({
  caption: r.body.caption,
  format: r.body.format,
  weight_goal: r.body.weight_goal
} as Certificate)

export const getCertificateUUID = (r: RestRequest) => r.params[certificateParams.certificateUUID]

export const courceCertificateController = (c: ConfigProvider, m: CoreManager) => ({
  async update(r: RestRequest, w: Response){
    const certificate = await m.courseManager().storage().updateResultCertificate(r.context, getCourseUUID(r), getCertificateUUID(r), getCertificateBody(r))
    w.status(202).send(certificate)
  },
  async get(r: RestRequest, w: Response){
    const certificate = await m.courseManager().storage().getResultCertificate(r.context, getCourseUUID(r), getCertificateUUID(r))
    w.send(certificate)
  },
  async fetch(r: RestRequest, w: Response){
    const certificates = await m.courseManager().storage().fetchResultCertificate(r.context, getCourseUUID(r))
    w.send(certificates)
  },
  async create(r: RestRequest, w: Response){
    const certificate = await m.courseManager().storage().createResultCertificate(r.context, getCourseUUID(r), getCertificateBody(r))
    w.status(201).send(certificate)
  },
  async delete(r: RestRequest, w: Response){
    const certificate = await m.courseManager().storage().deleteResultCertificate(r.context, getCourseUUID(r), getCertificateUUID(r))
    w.send(certificate)
  }
})

export default courceCertificateController