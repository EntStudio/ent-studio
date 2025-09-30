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

  const resultBlock = { ...defaultSchema, ...block }

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

type BlockSchemaGeneratorProxy = {[key: string]: (...args: any[]) => BlockSchemaGeneratorToken}

class BlockSchemaGeneratorToken {
  type: string
  params: any[]
  statements: BlockSchemaGeneratorToken[][]

  constructor(type: string, params: any[]) {
    this.type = type
    this.params = params
    this.statements = []
  }

  statement(callback: (block: BlockSchemaGeneratorProxy) => void) {
    this.statements.push(new ThreadSchemaGenerator(callback).tokens)
  }

  export(): BlockSchema {
    const looseSchema: LooseBlockSchema = {
      type: this.type,
      params: this.params.map(x => x instanceof BlockSchemaGeneratorToken ? x.export() : x),
      statements: this.statements.map(x => x.map(y => y.export()))
    }

    return makeBlockSchema(looseSchema)
  }
}

abstract class BlockSchemaGeneratorBase {
  protected static blockHandler(this: BlockSchemaGeneratorBase, data: BlockSchemaGeneratorToken[], type: string, ...params: any[]) {
    params.forEach(param => {
      if (param instanceof BlockSchemaGeneratorToken) {
        const idx = data.indexOf(param)

        if (idx !== -1)
          data.splice(idx, 1)
      }
    })

    const token = new BlockSchemaGeneratorToken(type, params)

    data.push(token)

    return token
  }

  protected makeProxyHandler(data: BlockSchemaGeneratorToken[]) {
    const handler: ProxyHandler<Object> = {}
    handler.get = (target, prop, receiver) => {
      if (typeof prop === 'symbol')
        throw new TypeError("string만 인자로 받을 수 있습니다")

      return (this.constructor as typeof BlockSchemaGeneratorBase).blockHandler.bind(this, data, prop)
    }

    return handler
  }

  // 구현은 필수, 타입은 자유
  abstract export(...arg: any[]): unknown
}

export class BlockSchemaGenerator extends BlockSchemaGeneratorBase {
  token: BlockSchemaGeneratorToken
  constructor(callback: (block: BlockSchemaGeneratorProxy) => BlockSchemaGeneratorToken) {
    super()

    const _data: BlockSchemaGeneratorToken[] = []

    const { proxy, revoke } = Proxy.revocable({}, this.makeProxyHandler(_data))
    this.token = callback(proxy as BlockSchemaGeneratorProxy)

    revoke()
  }

  export(): BlockSchema {
    return this.token.export()
  }
}

export class ThreadSchemaGenerator extends BlockSchemaGeneratorBase {
  tokens: BlockSchemaGeneratorToken[]
  constructor(callback: (block: BlockSchemaGeneratorProxy) => void) {
    super()

    this.tokens = []

    const { proxy, revoke } = Proxy.revocable({}, this.makeProxyHandler(this.tokens))
    callback(proxy as BlockSchemaGeneratorProxy)

    revoke()
  }

  export(): BlockSchema[] {
    return this.tokens.map(x => x.export())
  }
}

export class FunctionSchemaGenerator extends BlockSchemaGeneratorBase {
  tokens: BlockSchemaGeneratorToken[]
  resultToken: BlockSchemaGeneratorToken
  constructor(callback: (block: BlockSchemaGeneratorProxy) => BlockSchemaGeneratorToken) {
    super()

    this.tokens = []

    const { proxy, revoke } = Proxy.revocable({}, this.makeProxyHandler(this.tokens))
    this.resultToken = callback(proxy as BlockSchemaGeneratorProxy)

    this.tokens.splice(this.tokens.indexOf(this.resultToken), 1)

    revoke()
  }

  export(): EntryFunctionSchema[] {
    // TODO: WIP
    return this.tokens.map(x => x.export())
  }
}