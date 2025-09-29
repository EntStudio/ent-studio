export interface BlockSchema {
  id: string | null
  x: number
  y: number
  type: string
  params: any[]
  statements: BlockSchema[][]
  movable: bool | null
  deletable: typeof BlockDeletable[string] | null
  emphasized: bool
  readOnly: bool | null
  copyable: bool
  assemble: bool
  extensions: []
}

export interface LooseBlockSchema extends Partial<BlockSchema> {
  type: string
  statements?: LooseBlockSchema[][]
}

// TODO: 나중에 Entry.Block.Deletable로 이동
// 별로 이러고 싶진 않았는데
export const BlockDeletable = {
  TRUE: 1,
  FALSE: 2,
  FALSE_LIGHTEN: 3
} as const

