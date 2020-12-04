import ConfigProvider from "../config"
import CoreManager from "./core.manager"

export default class CoreManagerDefault implements CoreManager {
  c: ConfigProvider
  constructor(c: ConfigProvider){
    this.c = c
  }
} 