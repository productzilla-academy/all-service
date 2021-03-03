import ConfigProvider, { Config } from "../../../config"
import { Client} from 'minio'
import ObjectStorageProvider from "../object.storage.provider"
import Context from "../../../context"
import { InternalServerError, NotFoundError } from "../../../errors"
import { Stream } from "stream"
import { URL } from "url"
import { isStream, streamToString } from '../../services/stream'
import {to} from 'await-to-js'
import { PipeFunction } from "../../../core/core.object.storage.manager"

var minioClient: Client = null

export default class MinioObjectStorageProvider implements ObjectStorageProvider {
  configProvider: ConfigProvider
  constructor(configProvider: ConfigProvider) {
    this.configProvider = configProvider
    const minioURL = new URL(configProvider.objectStorageURL().replace('minio://', ''))
    minioClient = minioClient ||
    new Client(
      {
        endPoint: minioURL.hostname,
        port: parseInt(minioURL.port),
        useSSL: minioURL.protocol === 'https' ,
        accessKey: configProvider.objectStorageAccessKey(),
        secretKey: configProvider.objectStorageSecretKey()
      }
    )
    minioClient.setRequestOptions({ rejectUnauthorized: false })
  }
  async uploadFile(context: Context, namespace:string, objectId: string, file: Buffer | Stream, replaceOnExists?: boolean) {
    const data: Buffer | string = isStream(file) ? await streamToString(file as Stream) : file as Buffer
    if(!replaceOnExists){

      const [err, exists] =  await to(minioClient.getObject(namespace, objectId))
      if (!err) {
        let n = objectId.split('.') // spliting extension
        if(n.length > 1) {
          n[n.length - 2] += '-'
          objectId = n.join('.')
        }
        else objectId += '-'
      }
    }
    const [err, r] = await to(minioClient.putObject(namespace, objectId, data))
    if(err) {
      if((err as any).code !== 'NoSuchBucket') throw err
      await minioClient.makeBucket(namespace, 'id-west')
      return this.uploadFile(context, namespace, objectId, file)
    }
    return r
  }
  async deleteFile(context: Context, namespace:string, objectId: string): Promise<void> {
    const exists = await minioClient.getObject(namespace, objectId)
    if (!exists) throw NotFoundError(`No object to delete`)
    await minioClient.removeObject(namespace, objectId)
  }
  async detetePath(context: Context, namespace:string, pathId): Promise<void> {

  }
  listFile(context: Context, namespace:string, path: string): Promise<string[]> {
    return new Promise((r, j) => {
      const stream = minioClient.listObjectsV2(namespace, `${path}/`, true)
      console.log(path)
      const list: string[] = []
      stream.on('data', (obj) => {
        const n = obj.name.split('/')
        list.push(n[n.length - 1]) 
      })
      stream.on('error', (err) =>   j(err))
      
      stream.on('end', () => r(list) )
      stream.read()

    })
  }
  pipeFile(context: Context, namespace:string, objectId: string, pipe: PipeFunction): void {
    minioClient
      .presignedUrl(`GET`, namespace, objectId)
      .then(getObjectUrl => pipe(getObjectUrl))

  }
  getObjectUrl(context: Context, namespace: string, objectId: string): Promise<string> {
    return minioClient
    .presignedUrl(`GET`, namespace, objectId)
  }
  
} 