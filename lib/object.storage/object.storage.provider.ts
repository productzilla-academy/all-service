import { Stream } from "stream"
import Context from "../../context"
import ObjectStorageManager from "../../core/core.object.storage.manager"

export interface ObjectStorageProvider extends ObjectStorageManager {
  uploadFile(context: Context, namespace:string, objectId: string, file: Buffer | Stream, replaceOnExists?: boolean)
  deleteFile(context: Context, namespace:string, objectId): Promise<void>
  detetePath(context: Context, namespace:string, pathId): Promise<void>
  listFile(context: Context, namespace:string, pathId: string): Promise<string[]>
}
export default ObjectStorageProvider