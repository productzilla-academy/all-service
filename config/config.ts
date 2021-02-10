import { BaseLogger } from 'pino'
import { Tracer } from 'opentracing'

export enum DSNProtocol {
  MYSQL= 'mysql',
  POSTGRESQL= 'postgre',
  // MONGODB= 'mongo' //not implemented yet
}

export interface ConfigProvider {
  listenHost(): string
  listenPort(): number
  logger(): BaseLogger
  appName(): string
  dsn(): string
  traccer(): Tracer
  dsnProtocol(): string
  
  objectStorageURL(): string
  objectStorageAccessKey(): string
  objectStorageSecretKey(): string

  elasticsearchURL(): string
  elasticsearchUsername(): string
  elasticsearchPassword(): string

  getProtocol(d: string): string

  getEnvironment(): string
}