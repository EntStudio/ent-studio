import { BlockExtension, BlockExtensionManager } from "../blockExtension";
import { FunctionSchemaGenerator } from "../blockExtension";
import { defaultBlockData } from "./default_calc";

const exportBlocks = {} as BlockExtension

exportBlocks.blockChange = {}

const additionalOptions = [
  ['지수함수', 'exp'],
  ['쌍곡 사인', 'sinh'],
  ['쌍곡 코사인', 'cosh'],
  ['쌍곡 탄젠트', 'tanh'],
  ['역쌍곡 사인', 'asinh'],
  ['역쌍곡 코사인', 'acosh'],
  ['역쌍곡 탄젠트', 'atanh'],
  ['부호', 'sign'],
] as const satisfies [string, string][]

type operationFunctionsKey = typeof additionalOptions[number][1]
export const operationEntryFunctions: {[key in operationFunctionsKey]: FunctionSchemaGenerator} = {
  exp: defaultBlockData.exp,
  sinh: defaultBlockData.sinh,
  cosh: defaultBlockData.cosh,
  tanh: defaultBlockData.tanh,
  asinh: defaultBlockData.asinh,
  acosh: defaultBlockData.acosh,
  atanh: defaultBlockData.atanh,
  sign: defaultBlockData.sign,
}

exportBlocks.blockChange.calc_operation = (block) => {
  const operatorOptions = block.params[3].options as [string, string][]

  block.params[3].options = operatorOptions.concat(additionalOptions)

  return {
    conversionAlias: additionalOptions.map(x => x[1]),
    onLoad: (schema, thread) => {
      return new Entry.Block(schema, thread)
    },
    onExport: (block) => {
      const json = (block as any)._toJSON()
      const operationType: string = json.params[3]

      const operatorKeys: string[] = additionalOptions.map(x => x[1])

      if (operatorKeys.includes(operationType)) {
        const schema = operationEntryFunctions[operationType as operationFunctionsKey].export()
        BlockExtensionManager.instance.makePlaceholderFunction(schema)
      }
        

      return json
    }
  }
}


export default exportBlocks
