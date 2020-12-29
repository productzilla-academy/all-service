import { Stream } from "stream";
import Context from "../../context";

export interface ObjectStorageProvider {
  uploadFile(context: Context, namespace:string, objectId: string, file: Buffer | Stream, replaceOnExists?: boolean)
  deleteFile(context: Context, namespace:string, objectId): Promise<void>
  detetePath(context: Context, namespace:string, pathId): Promise<void>
  listFile(context: Context, namespace:string, pathId: string): Promise<string[]>
  pipeFile(context: Context, namespace:string, objectId, pipe: any): void
}
export default ObjectStorageProvider