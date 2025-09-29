import { generateHash } from "@/utils/utils"
import { EntryBlock } from "types/main/entryjs"
import { BlockDeletable, BlockSchema, LooseBlockSchema } from "types/main/entryjs/schema"

export interface ExtendedEntryBlock extends EntryBlock {
  onLoad: (schema: BlockSchema, thread: any, fieldParams?: string[]) => EntryBlock
  onExport: (block: EntryBlock) => BlockSchema
}

export interface BlockExtension {
  blockAdd?: Record<string, (EntryBlock & Partial<ExtendedEntryBlock>) | (() => EntryBlock & Partial<ExtendedEntryBlock>)>
  blockChange?: Record<string, Partial<ExtendedEntryBlock> | ((block: EntryBlock) => Partial<ExtendedEntryBlock> | void)>
}

export interface EntryFunctionSchema {
  variables?: string[]
  content: BlockSchema[]
  result?: BlockSchema
}

export class ReservedLocalVariable {
  name: string
  constructor(name: string) {
    this.name = name
  }
}

export function makeBlockSchema(block: LooseBlockSchema): BlockSchema {
  const defaultSchema = {
    x: 0,
    y: 0,
    params: [],
    statements: [],
    movable: null,
    deletable: BlockDeletable.TRUE,
    emphasized: false,
    readOnly: null,
    copyable: true,
    assemble: true,
    extensions: [],
  } satisfies Partial<BlockSchema>

  if (!('type' in block))
    throw new Error("블럭에 type 속성이 없습니다")

  const resultBlock = {...defaultSchema, ...block}

  if (!resultBlock.id)
    resultBlock.id = generateHash()

  resultBlock.statements = resultBlock.statements.map(x => x.map(y => makeBlockSchema(y)))

  // 내용물 복사
  resultBlock.params = [...resultBlock.params]
  
  for (let i = 0; i < resultBlock.params.length; i++) {
    const param = resultBlock.params[i]
    if (param != null && typeof param === 'object' && typeof param.type === 'string') {
      resultBlock.params[i] = makeBlockSchema(param)
    }
  }

  // TODO: id 설정했는데 왜 undefined일 수 있다고 하지?
  return resultBlock as BlockSchema
}

export class BlockExtensionManager {
  private static _instance: BlockExtensionManager

  static init() {
    if (!this._instance)
      this._instance = new BlockExtensionManager()
  }

  private constructor() {

  }

  static get instance() {
    if (!this._instance)
      throw new ReferenceError("BlockExtensionManager가 초기화되지 않았습니다.")
    return this._instance
  }

  addBlock(block: EntryBlock, category: any) {

  }

  makePlaceholderFunction(id: string, content?: BlockSchema, result?: BlockSchema) {

  }
}