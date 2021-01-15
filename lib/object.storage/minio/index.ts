import ConfigProvider, { Config } from "../../../config";
import { Client} from 'minio'
import ObjectStorageProvider from "../object.storage.provider";
import Context from "../../../context";
import { InternalServerError, NotFoundError } from "../../../errors"
import { Stream } from "stream";
import { URL } from "url";
import { isStream, streamToString } from '../../services/stream'
import {to} from 'await-to-js'
export default class MinioObjectStorageProvider implements ObjectStorageProvider {
  configProvider: ConfigProvider
  minioClient: Client
  constructor(configProvider: ConfigProvider) {
    this.configProvider = configProvider
    const minioURL = new URL(configProvider.objectStorageURL().replace('minio://', ''))
    // console.log({
    //   endPoint: minioURL.hostname,
    //   port: parseInt(minioURL.port),
    //   accessKey: configProvider.objectStorageAccessKey(),
    //   secretKey: configProvider.objectStorageSecretKey()
    // })

    this.minioClient = new Client(
      {
        endPoint: minioURL.hostname,
        port: parseInt(minioURL.port),
        useSSL: minioURL.protocol === 'https' ,
        accessKey: configProvider.objectStorageAccessKey(),
        secretKey: configProvider.objectStorageSecretKey()
      }
    )
    this.minioClient.setRequestOptions({rejectUnauthorized: false})
  }
  async uploadFile(context: Context, namespace:string, objectId: string, file: Buffer | Stream, replaceOnExists?: boolean) {
    const data: Buffer | string = isStream(file) ? await streamToString(file as Stream) : file as Buffer
    console.log('disini')
    if(!replaceOnExists){
      const exists = await this.minioClient.getObject(namespace, objectId)
      if (exists) {
        let n = objectId.split('.') // spliting extension
        if(n.length > 1) {
          n[n.length - 2] += '-'
          objectId = n.join('.')
        }
        else objectId += '-'
      }
    }
    console.log('disini')
    const [err, r] = await to(this.minioClient.putObject(namespace, objectId, data))
    console.log(err)
    if(err) {
      // console.log(typeof err)
    }
    return r
  }
  async deleteFile(context: Context, namespace:string, objectId: string): Promise<void> {
    const exists = await this.minioClient.getObject(namespace, objectId)
    if (!exists) throw NotFoundError(`No object to delete`)
    await this.minioClient.removeObject(namespace, objectId)
  }
  async detetePath(context: Context, namespace:string, pathId): Promise<void> {

  }
  listFile(context: Context, namespace:string, path: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const stream = this.minioClient.listObjects(namespace, path)
      const objectsList = []
      stream.on('data', (obj) => {
        objectsList.push(obj)
      })
      stream.on('error', (e) => {
        reject(InternalServerError(`Error while fetching data`, e))
      })
      stream.on('end', () => {
        resolve(objectsList)
      })

    })
  }
  pipeFile(context: Context, namespace:string, objectId, pipe: Function): void {
    const getObjectURL = this.minioClient.presignedUrl(`GET`, namespace, objectId)
    pipe(getObjectURL)
  }
  
} 