import ConfigProvider, { Config } from "../../../config";
import { Client } from 'minio'
import ObjectStorageProvider from "../object.storage.provider";
import Context from "../../../context";
import { InternalServerError, NotFoundError } from "../../../errors"
import { Stream } from "stream";

export default class MinioObjectStorageProvider implements ObjectStorageProvider {
  configProvider: ConfigProvider
  minioClient: Client
  constructor(configProvider: ConfigProvider) {
    this.configProvider = configProvider
    this.minioClient = new Client(
      {
        endPoint: configProvider.objectStorageURL().replace('minio://', ''),
        accessKey: configProvider.objectStorageAccessKey(),
        secretKey: configProvider.objectStorageSecretKey()
      }
    )
  }
  async uploadFile(context: Context, namespace:string, objectId: string, file: Buffer | Stream) {
    const exists = await this.minioClient.getObject(namespace, objectId)
    if (exists) {
      let n = objectId.split('.') // spliting extension
      if(n.length > 1) {
        n[n.length - 2] += '-'
        objectId = n.join('.')
      }
      else objectId += '-'
    }
    await this.minioClient.putObject(namespace, objectId, file as Buffer)
    
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