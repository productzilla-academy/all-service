import CoreRegistry from "../core/core.registry"

export default interface HandlerProvider extends CoreRegistry {
  serve(): void
}