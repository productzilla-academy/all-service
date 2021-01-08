import { Router } from "express";
import ConfigProvider from "../../config";
import CoreManager from "../../core/core.manager";
import careerController, { careerParam } from "./controllers/career"
import * as docs from './docs/swagger.json'
import swaggerExpress from 'swagger-ui-express'
import bodyParser from 'body-parser'
import catchMiddleware from "./middlewares/catch";
import courseController, { courseParams } from "./controllers/course";
import moduleController, { moduleParams } from "./controllers/module";
import courceCertificateController, { certificateParams } from "./controllers/course.certificate";
import quizController, { quizParams } from "./controllers/quiz";
require('express-async-errors')

export const RestRouter = (c: ConfigProvider, m: CoreManager) => {
  const router = Router()
  const careerCtrl = careerController(c, m)
  const courseCtrl = courseController(c, m)
  const moduleCtrl = moduleController(c, m)
  const certificateCtrl = courceCertificateController(c, m)
  const quizCtrl = quizController(c, m)

  router.use(bodyParser.json())
  router.use('/api-docs', swaggerExpress.serve, swaggerExpress.setup(docs));

  router.get(`/careers`, careerCtrl.fetchCareer)
  router.post(`/careers`, careerCtrl.createCareer)
  router.delete(`/careers/:${careerParam.name}`, careerCtrl.deleteCareer)
  router.get(`/careers/:${careerParam.name}/levels`, careerCtrl.fetchCareerLevel)
  router.post(`/careers/:${careerParam.name}/levels`, careerCtrl.createCareerLevel)
  router.delete(`/careers/:${careerParam.name}/levels/:${careerParam.uuid}`, careerCtrl.deleteCareerLevel)
  router.get(`/careers/:${careerParam.name}/courses`, courseCtrl.fetchCourseByCareer)

  router.get(`/courses`, courseCtrl.fetchCourse)
  router.get(`/courses/:${courseParams.uuid}`, courseCtrl.getCourse)

  router.get(`/courses/:${courseParams.uuid}/certificates`, certificateCtrl.fetch)
  router.get(`/courses/:${courseParams.uuid}/certificates/:${certificateParams.certificateUUID}`, certificateCtrl.get)
  router.get(`/tutor/:${courseParams.tutor}/courses/:${courseParams.uuid}/certificates`, certificateCtrl.fetch)
  router.get(`/tutor/:${courseParams.tutor}/courses/:${courseParams.uuid}/certificates/:${certificateParams.certificateUUID}`, certificateCtrl.get)
  router.post(`/tutor/:${courseParams.tutor}/courses/:${courseParams.uuid}/certificates`, certificateCtrl.create)
  router.put(`/tutor/:${courseParams.tutor}/courses/:${courseParams.uuid}/certificates/:${certificateParams.certificateUUID}`, certificateCtrl.update)
  router.delete(`/tutor/:${courseParams.tutor}/courses/:${courseParams.uuid}/certificates/:${certificateParams.certificateUUID}`, certificateCtrl.delete)
  
  router.get(`/courses/:${courseParams.uuid}/modules`, moduleCtrl.fetchModules)
  router.get(`/courses/:${courseParams.uuid}/modules/herarcial`, moduleCtrl.herarcialModules)
  router.get(`/courses/:${courseParams.uuid}/modules/:${moduleParams.moduleUUID}`, moduleCtrl.getModules)
  
  router.post(`/tutor/:${courseParams.tutor}/courses`, courseCtrl.createCourse)
  router.get(`/tutor/:${courseParams.tutor}/courses/:${courseParams.uuid}`, courseCtrl.getCourse)
  router.put(`/tutor/:${courseParams.tutor}/courses/:${courseParams.uuid}`, courseCtrl.updateCourse)
  router.delete(`/tutor/:${courseParams.tutor}/courses/:${courseParams.uuid}`, courseCtrl.deleteCourse)

  router.get(`/tutor/:${courseParams.tutor}/courses/:${courseParams.uuid}/modules`, moduleCtrl.fetchModules)
  router.post(`/tutor/:${courseParams.tutor}/courses/:${courseParams.uuid}/modules`, moduleCtrl.createModule)
  router.get(`/tutor/:${courseParams.tutor}/courses/:${courseParams.uuid}/modules/:${moduleParams.moduleUUID}`, moduleCtrl.getModules)
  router.put(`/tutor/:${courseParams.tutor}/courses/:${courseParams.uuid}/modules/:${moduleParams.moduleUUID}`, moduleCtrl.updateModule)
  router.delete(`/tutor/:${courseParams.tutor}/courses/:${courseParams.uuid}/modules/:${moduleParams.moduleUUID}`, moduleCtrl.deleteModule)


  router.get(`/courses/:${courseParams.uuid}/modules/:${moduleParams.moduleUUID}/quizes`, quizCtrl.getQuiz)
  router.get(`/courses/:${courseParams.uuid}/modules/:${moduleParams.moduleUUID}/quizes/:${quizParams.quizUUID}/questions`, quizCtrl.fetchQuestions)
  router.get(`/courses/:${courseParams.uuid}/modules/:${moduleParams.moduleUUID}/quizes/:${quizParams.quizUUID}/questions/${quizParams.quizUUID}`, quizCtrl.getQuestions)
  router.get(`/courses/:${courseParams.uuid}/modules/:${moduleParams.moduleUUID}/quizes/:${quizParams.quizUUID}/questions/${quizParams.quizUUID}/options`, quizCtrl.fetchQuizOptions)

  router.get(`/tutor/:${courseParams.tutor}/courses/:${courseParams.uuid}/modules/:${moduleParams.moduleUUID}/quizes`, quizCtrl.getQuiz)
  router.post(`/tutor/:${courseParams.tutor}/courses/:${courseParams.uuid}/modules/:${moduleParams.moduleUUID}/quizes`, quizCtrl.createQuiz)
  router.put(`/tutor/:${courseParams.tutor}/courses/:${courseParams.uuid}/modules/:${moduleParams.moduleUUID}/quizes`, quizCtrl.updateQuiz)
  router.delete(`/tutor/:${courseParams.tutor}/courses/:${courseParams.uuid}/modules/:${moduleParams.moduleUUID}/quizes`, quizCtrl.deleteQuiz)

  router.get(`/tutor/:${courseParams.tutor}/courses/:${courseParams.uuid}/modules/:${moduleParams.moduleUUID}/quizes/:${quizParams.quizUUID}/questions`, quizCtrl.fetchQuestions)
  router.post(`/tutor/:${courseParams.tutor}/courses/:${courseParams.uuid}/modules/:${moduleParams.moduleUUID}/quizes/:${quizParams.quizUUID}/questions`, quizCtrl.createQuestions)
  router.get(`/tutor/:${courseParams.tutor}/courses/:${courseParams.uuid}/modules/:${moduleParams.moduleUUID}/quizes/:${quizParams.quizUUID}/questions/${quizParams.quizUUID}`, quizCtrl.getQuestions)
  router.put(`/tutor/:${courseParams.tutor}/courses/:${courseParams.uuid}/modules/:${moduleParams.moduleUUID}/quizes/:${quizParams.quizUUID}/questions/${quizParams.quizUUID}`, quizCtrl.updateQuestions)
  router.delete(`/tutor/:${courseParams.tutor}/courses/:${courseParams.uuid}/modules/:${moduleParams.moduleUUID}/quizes/:${quizParams.quizUUID}/questions/${quizParams.quizUUID}`, quizCtrl.deleteQuestions)

  router.get(`/tutor/:${courseParams.tutor}/courses/:${courseParams.uuid}/modules/:${moduleParams.moduleUUID}/quizes/:${quizParams.quizUUID}/questions/${quizParams.quizUUID}/options`, quizCtrl.fetchQuizOptions)
  router.post(`/tutor/:${courseParams.tutor}/courses/:${courseParams.uuid}/modules/:${moduleParams.moduleUUID}/quizes/:${quizParams.quizUUID}/questions/${quizParams.quizUUID}/options`, quizCtrl.updateQuizOptions)

  router.use(catchMiddleware(c.logger()))

  return router
}