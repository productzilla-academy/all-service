import knex from 'knex'
import ConfigProvider from '../../../config'
import { INDEX_TABLE_CAREERS, INDEX_TABLE_LEVELS} from "../../careers";
import { 
  INDEX_TABLE_COURSES, 
  INDEX_TABLE_MODULES,
  INDEX_TABLE_QUESTIONS,
  INDEX_TABLE_QUIZ,
  INDEX_TABLE_RESULT,
  INDEX_TABLE_QUESTION_OPTIONS
} from "../../courses";
const path = require('path')

export const tables = {
  INDEX_TABLE_CAREERS,
  INDEX_TABLE_LEVELS,
  INDEX_TABLE_COURSES,
  INDEX_TABLE_MODULES,
  INDEX_TABLE_QUESTIONS,
  INDEX_TABLE_QUESTION_OPTIONS,
  INDEX_TABLE_QUIZ,
  INDEX_TABLE_RESULT
}

export const connection = (c: ConfigProvider) => {
  let client = c.dsnProtocol()
  let connection = c.dsn()
  return knex({
    client,
    connection,
    pool: { min: 0, max: 7 },
    migrations: {
      directory: path.join(__dirname, './migrations')
    }
  })
}