import config from 'config'
import { Tracer } from 'opentracing'
import pino, { BaseLogger } from 'pino'
import { URL } from 'url'
import { ConfigProvider } from './config'

export const [
  keyListenPort,
  keyListenHost,

  keyDSN,

  appName,

  keyObjectStorageURL,
  keyObjectAccess,
  keyObjectSecret,

  keyElasticearchURL,
  keyElasticearchUsername,
  keyElasticearchPassword,

  keyJaegerURL,
  keyJaegerSampler,
  keyJaegerConst,

  keyEnvironment
] = [
  'listen.port',
  'listen.host',
  'dsn',

  'productzilla-core-system',

  'objectstorage.url',
  'objectstorage.access_key',
  'objectstorage.secret_key',

  'elasticsearch.url',
  'elasticsearch.auth.username',
  'elasticsearch.auth_password',

  'jaeger.url',
  'jaeger.sampler',
  'jaeger.const',

  'environment'
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
  objectStorageURL(): string {
    return config.get(keyObjectStorageURL)
  }
  elasticsearchURL(): string {
    return config.get(keyElasticearchURL)
  }
  dsn(): string {
    return config.get(keyDSN)
  }
  dsnProtocol(): string {
    return this.dsn().split('://')[0]
  }
  traccer(): Tracer {
    throw new Error('Method not implemented.')
  }
  objectStorageAccessKey(): string {
    return config.get(keyObjectAccess)
  }
  objectStorageSecretKey(): string {
    return config.get(keyObjectSecret)
  }
  elasticsearchUsername(): string {
    return config.get(keyElasticearchUsername)
  }
  elasticsearchPassword(): string {
    return config.get(keyElasticearchPassword)
  }
  getProtocol(d: string): string {
    return d.split('://')[0]
  }
  getEnvironment(): string {
    return config.get(keyEnvironment)
  }
}

export default ConfigProvider