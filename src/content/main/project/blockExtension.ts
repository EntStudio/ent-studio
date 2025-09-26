import { EntryBlock } from "types/main/entryjs"

export interface ExtendedEntryBlock extends EntryBlock {

}

export class BlockExtensionManager {
  private static _instance: BlockExtensionManager

  static init() {
    if (!this._instance)
      this._instance = new BlockExtensionManager()
  }

  static get instance() {
    if (!this._instance)
      throw new ReferenceError("BlockExtensionManager가 초기화되지 않았습니다.")
    return this._instance
  }

  addBlock(block: EntryBlock, category: any) {

  }
}

