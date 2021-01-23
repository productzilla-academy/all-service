import { Span } from "opentracing";
import Context from "../context";
import DriverDefault from "../driver/driver.default"
import { careers, courseExample, levels, moduleExample, quizExample, questionExample, optionsExample } from "./examples/data"
import fs from 'fs'
import path from 'path'
import to from "await-to-js";
const d = new DriverDefault()

export default async function runExample() {
  const context = new Context({span: new Span()})
  const manager = d.registry().manager()
  // for (let i = 0; i < careers.length; i++) {
  //   const element = careers[i];
  //   await manager.careerManager().createCareer(context, element)
  // }
  // for (let i = 0; i < levels.length; i++) {
  //   const element = levels[i];
  //   await manager.careerManager().createLevel(context, element)
  // }
  await to(manager.courseManager().storage().deleteModule(context, `a9242630-809a-5e3b-9663-58df8abb7fd0`, `e55cccad-4e20-5e78-a025-a66ba7178531`))
  await to(manager.courseManager().storage().deleteCourse(context, `a9242630-809a-5e3b-9663-58df8abb7fd0`))
  const c = await manager.courseManager().storage().createCourse(context, courseExample)
  const image = fs.readFileSync(path.join(__dirname, './examples/images/ux-law.jpeg'))
  await manager.courseManager().objectStorage().changeCourseCover(context, c.uuid, image)
  const module = await manager.courseManager().storage().createModule(context, c.uuid, moduleExample)
  const material = fs.readFileSync(path.join(__dirname, './examples/material/09-UX.pdf'))
  await manager.courseManager().objectStorage().uploadModuleMaterial(context, c.uuid, module.uuid, material)
  await manager.courseManager().storage().updateModule(context, c.uuid, module.uuid, {
    ...moduleExample,
    material: '09-UX.pdf'
  })
  const quiz = await manager.courseManager().storage().createModuleQuiz(context, c.uuid, module.uuid, quizExample)
  const question = await manager.courseManager().storage().createModuleQuizQuestions(context, c.uuid, module.uuid, quiz.uuid, questionExample)
  const options = await manager.courseManager().storage().updateModuleQuizQuestionOptions(context, c.uuid, module.uuid, quiz.uuid, question.uuid, optionsExample)
}

