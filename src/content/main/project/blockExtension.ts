import { generateHash } from "@/utils/utils"
import type { EntryBlock } from "@/types/main/entryjs"
import type { BlockSchema, LooseBlockSchema } from "@/types/main/entryjs/schema"

const BlockDeletable = {
  TRUE: 1,
  FALSE: 2,
  FALSE_LIGHTEN: 3
}

export interface ExtendedEntryBlock extends EntryBlock {
  conversionAlias: string[]
  onLoad: (schema: BlockSchema, thread: any, fieldParams?: string[]) => EntryBlock
  onExport: (block: EntryBlock) => BlockSchema
}

export interface BlockExtension {
  blockAdd?: Record<string, (EntryBlock & Partial<ExtendedEntryBlock>) | (() => EntryBlock & Partial<ExtendedEntryBlock>)>
  blockChange?: Record<string, Partial<ExtendedEntryBlock> | ((block: EntryBlock) => Partial<ExtendedEntryBlock> | void)>
}

export interface EntryFunctionSchema {
  id: string
  name: string
  nameTemplate: string
  variables?: { name: string, id: string }[]
  params?: { name: string, id: string }[]
  content: BlockSchema[]
  result?: BlockSchema
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

  private placeholders: Record<string, EntryFunctionSchema>

  private constructor() {
    this.placeholders = {}
  }

  static get instance() {
    if (!this._instance)
      throw new ReferenceError("BlockExtensionManager가 초기화되지 않았습니다.")
    return this._instance
  }

  addBlock(block: EntryBlock, category: any) {
    throw new Error("구현되지 않음")
  }

  makePlaceholderFunction(schema: EntryFunctionSchema) {
    if (this.placeholders[schema.id])
      return

    throw new Error("구현되지 않음")
  }
}

type BlockSchemaProxy = { [key: string]: (...args: any[]) => BlockSchemaToken }

class BlockSchemaToken {
  type: string
  params: any[]
  statements: BlockSchemaToken[][]

  constructor(type: string, params: any[]) {
    this.type = type
    this.params = params
    this.statements = []
  }

  statement(callback: (block: BlockSchemaProxy, operators: OperationHelper) => void) {
    const thread = new ThreadSchemaGenerator(callback)
    thread.evaluate()

    if (!thread.tokens)
      throw new Error("토큰이 생성되지 않았습니다")

    this.statements.push(thread.tokens)
    return this
  }

  export(): BlockSchema {
    const looseSchema: LooseBlockSchema = {
      type: this.type,
      params: this.params.map(x => x instanceof BlockSchemaToken ? x.export() : x),
      statements: this.statements.map(x => x.map(y => y.export()))
    }

    return makeBlockSchema(looseSchema)
  }
}

class OperationHelper {
  proxy: BlockSchemaProxy
  constructor(proxy: BlockSchemaProxy) {
    this.proxy = proxy
  }

  add(a: BlockSchemaToken, b: BlockSchemaToken) {
    return this.proxy.calc_basic(a, "PLUS", b)
  }

  sub(a: BlockSchemaToken, b: BlockSchemaToken) {
    return this.proxy.calc_basic(a, "MINUS", b)
  }

  mul(a: BlockSchemaToken, b: BlockSchemaToken) {
    return this.proxy.calc_basic(a, "MULTI", b)
  }

  div(a: BlockSchemaToken, b: BlockSchemaToken) {
    return this.proxy.calc_basic(a, "DIVIDE", b)
  }

  round(x: BlockSchemaToken) {
    return this.proxy.calc_operation(null, x, null, "round")
  }

  root(x: BlockSchemaToken) {
    return this.proxy.calc_operation(null, x, null, "root")
  }

  square(x: BlockSchemaToken) {
    return this.proxy.calc_operation(null, x, null, "square")
  }

  ln(x: BlockSchemaToken) {
    return this.proxy.calc_operation(null, x, null, "ln")
  }

  gt(a: BlockSchemaToken, b: BlockSchemaToken) {
    return this.proxy.boolean_basic_operator(a, "GREATER", b)
  }

  ge(a: BlockSchemaToken, b: BlockSchemaToken) {
    return this.proxy.boolean_basic_operator(a, "GREATER_OR_EQUAL", b)
  }

  eq(a: BlockSchemaToken, b: BlockSchemaToken) {
    return this.proxy.boolean_basic_operator(a, "EQUAL", b)
  }

  ne(a: BlockSchemaToken, b: BlockSchemaToken) {
    return this.proxy.boolean_basic_operator(a, "NOT_EQUAL", b)
  }

  le(a: BlockSchemaToken, b: BlockSchemaToken) {
    return this.proxy.boolean_basic_operator(a, "LESS", b)
  }

  lt(a: BlockSchemaToken, b: BlockSchemaToken) {
    return this.proxy.boolean_basic_operator(a, "LESS_OR_EQUAL", b)
  }
}

abstract class BlockSchemaGeneratorBase {
  protected static blockHandler(this: BlockSchemaGeneratorBase, data: BlockSchemaToken[], type: string, ...params: any[]) {
    params.forEach(param => {
      if (param instanceof BlockSchemaToken) {
        const idx = data.indexOf(param)

        if (idx !== -1)
          data.splice(idx, 1)
      }
    })

    const token = new BlockSchemaToken(type, params)

    data.push(token)

    return token
  }

  protected makeProxyHandler(data: BlockSchemaToken[]) {
    const handler: ProxyHandler<Object> = {}
    handler.get = (target, prop, receiver) => {
      if (typeof prop === 'symbol')
        throw new TypeError("string만 인자로 받을 수 있습니다")

      return (this.constructor as typeof BlockSchemaGeneratorBase).blockHandler.bind(this, data, prop)
    }

    return handler
  }

  abstract evaluate(): void

  // 구현은 필수, 타입은 자유
  abstract export(...arg: any[]): unknown
}

export class BlockSchemaGenerator extends BlockSchemaGeneratorBase {
  token?: BlockSchemaToken
  callback: (block: BlockSchemaProxy, operators: OperationHelper) => BlockSchemaToken
  constructor(callback: (block: BlockSchemaProxy, operators: OperationHelper) => BlockSchemaToken) {
    super()

    this.callback = callback
  }

  evaluate() {
    const _data: BlockSchemaToken[] = []

    const { proxy, revoke } = Proxy.revocable<BlockSchemaProxy>({}, this.makeProxyHandler(_data))
    const operationHelper = new OperationHelper(proxy)

    this.token = this.callback(proxy, operationHelper)

    revoke()
  }

  export(): BlockSchema {
    if (!this.token)
      throw new Error("평가되지 않은 블럭을 export할 수 없습니다")
    return this.token.export()
  }
}

export class ThreadSchemaGenerator extends BlockSchemaGeneratorBase {
  tokens?: BlockSchemaToken[]
  callback: (block: BlockSchemaProxy, operators: OperationHelper) => void
  constructor(callback: (block: BlockSchemaProxy, operators: OperationHelper) => void) {
    super()

    this.callback = callback
  }

  evaluate() {
    this.tokens = []

    const { proxy, revoke } = Proxy.revocable<BlockSchemaProxy>({}, this.makeProxyHandler(this.tokens))
    const operationHelper = new OperationHelper(proxy)

    this.callback(proxy, operationHelper)

    revoke()
  }


  export(): BlockSchema[] {
    if (!this.tokens)
      throw new Error("평가되지 않은 블럭을 export할 수 없습니다")
    return this.tokens.map(x => x.export())
  }
}

// 타입 추론 죽어도 안됨
interface FuncPlaceholderProxy {
  variable: Record<string, BlockSchemaToken>
  param: Record<string, BlockSchemaToken>
}

export type FunctionGeneratorCallback = (block: BlockSchemaProxy, operators: OperationHelper, func: FuncPlaceholderProxy) => BlockSchemaToken | void

export class FunctionSchemaGenerator extends BlockSchemaGeneratorBase {
  tokens?: BlockSchemaToken[]
  resultToken?: BlockSchemaToken

  variables?: string[]
  parameters?: string[]

  name: string
  nameTemplate: string

  callback: FunctionGeneratorCallback

  constructor(callback: FunctionGeneratorCallback, name: string, nameTemplate: string, variables?: string[], parameters?: string[]) {
    super()

    this.name = name
    this.nameTemplate = nameTemplate

    this.variables = variables ?? []
    this.parameters = parameters ?? []

    this.callback = callback
  }

  evaluate() {
    this.tokens = []

    const { proxy: blockProxy, revoke: blockProxyRevoke } = Proxy.revocable<BlockSchemaProxy>({}, this.makeProxyHandler(this.tokens))
    const operationHelper = new OperationHelper(blockProxy as BlockSchemaProxy)

    const { proxy: variableProxy, revoke: variableRevoke } = Proxy.revocable({}, {
      get: (target, prop, receiver) => {
        if (typeof prop === 'symbol')
          throw new TypeError("string만 인자로 받을 수 있습니다")

        if (this.variables?.includes(prop)) {
          return blockProxy.get_func_variable(prop)
        }

        throw new Error(`변수 ${prop}이 존재하지 않습니다`)
      },

      set: (target, prop, receiver) => {
        if (typeof prop === 'symbol')
          throw new TypeError("string만 인자로 받을 수 있습니다")

        blockProxy.set_func_variable(prop, receiver, null)

        return true
      }
    })

    const { proxy: paramProxy, revoke: paramRevoke } = Proxy.revocable({}, {
      get: (target, prop, receiver) => {
        if (typeof prop === 'symbol')
          throw new TypeError("string만 인자로 받을 수 있습니다")

        if (this.parameters?.includes(prop)) {
          return new BlockSchemaToken("stringParam", [prop])
        }

        throw new Error(`파라미터 ${prop}이 존재하지 않습니다`)
      },

      set: () => {
        throw new Error("파라미터의 값을 설정할 수 없습니다")
      }
    })

    const funcProxy: FuncPlaceholderProxy = {
      variable: variableProxy,
      param: paramProxy
    }

    const val = this.callback(blockProxy, operationHelper, funcProxy)

    if (val) {
      this.resultToken = val
      const idx = this.tokens.indexOf(val)
      if (idx >= 0)
        this.tokens.splice(idx, 1)
    }

    blockProxyRevoke()
    variableRevoke()
    paramRevoke()
  }

  export(): EntryFunctionSchema {
    if (!this.tokens)
      throw new Error("평가되지 않은 블럭을 export할 수 없습니다")

    const variableMap: Record<string, string> = {}

    if (this.variables)
      for (let v of this.variables) {
        variableMap[v] = generateHash()
      }

    const paramMap: Record<string, string> = {}

    if (this.parameters)
      for (let p of this.parameters) {
        paramMap[p] = generateHash()
      }

    const recursiveReplace = (block: BlockSchemaToken) => {
      switch (block.type) {
        case 'stringParam': {
          const paramId = paramMap[block.type]

          if (!paramId)
            throw new ReferenceError(`파라미터 ${block.type}는 존재하지 않습니다`)

          block.type = `stringParam_${paramId}`
          break
        }
        case 'get_func_variable':
        case 'set_func_variable': {
          const variableName = block.params[0]
          if (variableName)
            throw new ReferenceError(`변수명이 존재하지 않습니다`)

          const variableId = variableMap[variableName]

          if (!variableId)
            throw new ReferenceError(`변수 ${variableName}는 존재하지 않습니다`)

          block.params[0] = variableId
        }
      }

      block.params.forEach((param) => {
        if (param instanceof BlockSchemaToken)
          recursiveReplace(param)
      })

      block.statements.forEach(statement => statement.forEach(recursiveReplace))
    }

    this.tokens.forEach(recursiveReplace)

    if (this.resultToken)
      recursiveReplace(this.resultToken)

    return {
      id: generateHash(),
      name: this.name,
      nameTemplate: this.nameTemplate,
      variables: this.variables?.map(x => ({name: x, id: variableMap[x]})),
      params: this.parameters?.map(x => ({name: x, id: paramMap[x]})),
      content: this.tokens.map(x => x.export()),
      result: this.resultToken?.export()
    }
  }
}