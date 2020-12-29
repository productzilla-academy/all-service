import ConfigProvider from "../../config";
import ObjectStorageProvider from "./object.storage.provider";
import MinioObjectStorageProvider from "./minio";
export * from './object.storage.provider'
const ObjectStorage = (c: ConfigProvider): ObjectStorageProvider => {
  const protocol = c.getProtocol(c.objectStorageURL())
  if(protocol === 'minio') return new MinioObjectStorageProvider(c)
  throw new Error(`Object storage protocol not implemented`)
}

export default ObjectStorage