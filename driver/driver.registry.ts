import CoreRegistry from "../core/core.registry"
import HandlerProvider from "../handler/provider"

export interface Registry extends CoreRegistry{
  init(): void
  handler(): HandlerProvider
}

export default Registry