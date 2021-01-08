import knex from 'knex'
import ConfigProvider from '../../../../config'
import { INDEX_TABLE_CAREERS, INDEX_TABLE_LEVELS} from "../../../careers";
import { INDEX_TABLE_BILLING_PLANS, INDEX_TABLE_TRANSACTIONS} from "../../../transactions";
import { INDEX_TABLE_ENROLLMENTS, INDEX_TABLE_LEARN_PROCESS, INDEX_TABLE_QUIZ_ANSWER } from "../../../enrollment";
import { 
  INDEX_TABLE_COURSES, 
  INDEX_TABLE_MODULES,
  INDEX_TABLE_QUESTIONS,
  INDEX_TABLE_QUIZ,
  INDEX_TABLE_RESULT_CERTIFICATE,
  INDEX_TABLE_QUESTION_OPTIONS
} from "../../../courses";
const path = require('path')
var SQLConn: knex = null
export const tables = {
  INDEX_TABLE_CAREERS,
  INDEX_TABLE_LEVELS,
  INDEX_TABLE_COURSES,
  INDEX_TABLE_MODULES,
  INDEX_TABLE_QUESTIONS,
  INDEX_TABLE_QUESTION_OPTIONS,
  INDEX_TABLE_QUIZ,
  INDEX_TABLE_RESULT_CERTIFICATE,
  INDEX_TABLE_BILLING_PLANS,
  INDEX_TABLE_TRANSACTIONS,
  INDEX_TABLE_ENROLLMENTS,
  INDEX_TABLE_LEARN_PROCESS,
  INDEX_TABLE_QUIZ_ANSWER
}
export const SQLConnection = (configProvider: ConfigProvider) => {
  if(SQLConn) return SQLConn
  let client = configProvider.dsnProtocol()
  let connection = configProvider.dsn()
  SQLConn = knex({
    client,
    connection,
    pool: { min: 0, max: 7 },
    migrations: {
      directory: path.join(__dirname, './migrations')
    }
  })
  return SQLConn
}


export default SQLConnection