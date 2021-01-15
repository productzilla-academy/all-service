import Context from "../context"

export interface PipeFunction {
  (file: string): void
}

export interface ObjectStorageManager {
  pipeFile (context: Context, namespace: string, objectId: string, pipe: PipeFunction): void
  getObjectUrl(context: Context, namespace: string, objectId: string): Promise<string>
}

export default ObjectStorageManager