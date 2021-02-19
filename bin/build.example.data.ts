import Context from "../context";
import DriverDefault from "../driver/driver.default"
import { careers, courseExample, levels, moduleExample, quizExample, questionExample, optionsExample, certificates } from "./examples/data"
import fs from 'fs'
import path from 'path'
import to from "await-to-js";
import { Course, CourseCareer, ModuleType } from "../core/courses";
import { Career, Level } from "../core/careers";
import { Span } from "opentracing";
const d = new DriverDefault()

const getRandomCareer = (): string => {
  const d = Math.floor(Math.random() * careers.length)
  return careers[d].name
}
const getRandomLevel = (): string => {
  const d = Math.floor(Math.random() * levels.length)
  return levels[d].name
}
export default async function runExample() {
  const context = new Context({span: new Span()})
  const manager = d.registry().manager()
  for (let i = 0; i < careers.length; i++) {
    const element = careers[i];
    await to(manager.careerManager().createCareer(context, element))
  }
  for (let i = 0; i < levels.length; i++) {
    const element = levels[i];
    await to(manager.careerManager().createLevel(context, element))
  }
  for(let i = 0; i< 50; i++) {
    let course: Course = {
      ...courseExample,
      name: `${courseExample.name} ${i}`,
      career: [
        {
          career: {
            name: getRandomCareer()
          } as Career,
          level: {
            name: getRandomLevel()
          } as Level,
          number: 0
        }

      ]
    }
    const [e, c] = await to(manager.courseManager().storage().createCourse(context, course))
    if(!e) {
      const image = fs.readFileSync(path.join(__dirname, './examples/images/ux-law.jpeg'))
      await manager.courseManager().objectStorage().changeCourseCover(context, c.uuid, image)  
    } else continue
    for (let certIndex = 0; certIndex < certificates.length; certIndex++) {
      const element = certificates[certIndex];
      await to(manager.courseManager().storage().createResultCertificate(context, c.uuid, element))
    }
    for (let j = 0; j < 10; j++) {
        let module = {
          ...moduleExample,
          name: `${moduleExample.name} ${j}`,
          type:  j % 2 ? ModuleType.Module : ModuleType.Assesment
        }
        let e:Error;

        [e, module] = await to(manager.courseManager().storage().createModule(context, c.uuid, module))
        if(e) d.configuration().logger().error(`error-creating-module`, e)
        const material = fs.readFileSync(path.join(__dirname, './examples/material/video-example.mp4'))
        if(i % 2 ) {
          const submodule = {
            ...moduleExample,
            name: `${module.name} ${j}`,
            parent_module: module
          }
          module = await manager.courseManager().storage().createModule(context, c.uuid, submodule)
        }
        await to(manager.courseManager().objectStorage().uploadModuleFile(context, c.uuid, module.uuid, material, `video-example.mp4`))
        await to(manager.courseManager().storage().updateModule(context, c.uuid, module.uuid, {
          ...moduleExample,
          material: 'video-example.mp4',
           content: moduleExample.content.replace('{{.video}}', `/files/courses/${c.uuid}/modules/${module.uuid}/files/video-example.mp4`)
        }))
        
        const [eQuiz, quiz] = await to(manager.courseManager().storage().createModuleQuiz(context, c.uuid, module.uuid, quizExample))
        if(eQuiz) d.configuration().logger().error(`error-creating-quiz`, eQuiz)
        const [eQuestion, question] = await to(manager.courseManager().storage().createModuleQuizQuestions(context, c.uuid, module.uuid, quiz.uuid, questionExample))
        if(eQuestion) d.configuration().logger().error(`error-creating-question`, { s: eQuestion.stack})
        const [eQuestionOptions, options] = await to(manager.courseManager().storage().updateModuleQuizQuestionOptions(context, c.uuid, module.uuid, quiz.uuid, question.uuid, optionsExample))
        if(eQuestionOptions) d.configuration().logger().error(`error-creating-options`, eQuestionOptions)

      }
    }

}

