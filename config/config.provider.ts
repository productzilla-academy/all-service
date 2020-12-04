import config from 'config'
import pino, { BaseLogger } from 'pino'
import { ConfigProvider } from './config'

export const [
  keyListenPort,
  keyListenHost,
  keyDefaultSender,

  appName
] = [
  'listen.port',
  'listen.host',
  'default.sender',

  'productzilla-core-system'
]

function newLogger(): BaseLogger {
  return pino({
    name: appName,
    level: process.env.NODE_ENV === 'development' ? 'warn' : 'info',
    timestamp: () => `,"time":"${new Date().toISOString()}"`
  })
}

export class Config implements ConfigProvider {
 
  l?: BaseLogger = undefined
  
  listenHost(): string {
    return config.get(keyListenHost)
  }
  listenPort(): number {
    return config.get(keyListenPort)
  }
  logger(): BaseLogger {
    if(!this.l) this.l = newLogger()
    return this.l
  }
  appName(): string {
    return appName
  }
  defaultSender(): string {
    return config.get(keyDefaultSender)
  }
}

export default ConfigProvider