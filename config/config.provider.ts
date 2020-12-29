import config from 'config'
import { Tracer } from 'opentracing'
import pino, { BaseLogger } from 'pino'
import { ConfigProvider } from './config'

export const [
  keyListenPort,
  keyListenHost,
  keyDefaultSender,

  appName,

  keyObjectStorageURL,

  keyElasticearchURL,

  keyJaegerURL,
  keyJaegerSampler,
  keyJaegerConst
] = [
  'listen.port',
  'listen.host',
  'default.sender',

  'productzilla-core-system',

  'objectstorage.url',

  'elasticsearch.url',

  'jaeger.url',
  'jaeger.sampler',
  'jaeger.const'
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
  objectStorageURL(): string {
    throw new Error('Method not implemented.')
  }
  elasticsearchURL(): string {
    throw new Error('Method not implemented.')
  }
  dsn(): string {
    throw new Error('Method not implemented.')
  }
  dsnProtocol(): string {
    throw new Error('Method not implemented.')
  }
  traccer(): Tracer {
    throw new Error('Method not implemented.')
  }
  objectStorageAccessKey(): string {
    throw new Error('Method not implemented.')
  }
  objectStorageSecretKey(): string {
    throw new Error('Method not implemented.')
  }
  elasticsearchUsername(): string {
    throw new Error('Method not implemented.')
  }
  elasticsearchPassword(): string {
    throw new Error('Method not implemented.')
  }
  getProtocol(d: string): string {
    throw new Error('Method not implemented.')
  }
}

export default ConfigProvider