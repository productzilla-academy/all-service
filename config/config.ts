import { BaseLogger } from 'pino'
export interface ConfigProvider {
  listenHost(): string
  listenPort(): number
  logger(): BaseLogger
  appName(): string
  defaultSender(): string
}