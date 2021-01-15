import Context from "../../context"
import Asset from "./asset"

export default interface AssetManager {
  upload(context: Context, asset: Asset): Promise<void>
  delete(context: Context, asset: Asset): Promise<void>
  get(context: Context, asset: Asset): Promise<Buffer>
}