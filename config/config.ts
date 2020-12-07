import { BaseLogger } from 'pino'
import { Tracer } from 'opentracing'

export interface ConfigProvider {
  listenHost(): string
  listenPort(): number
  logger(): BaseLogger
  appName(): string
  dsn(): string
  dsnProtocol(): string
  traccer(): Tracer
  objectStorageDsn(): string
  objectStorageProtocol(): string
}