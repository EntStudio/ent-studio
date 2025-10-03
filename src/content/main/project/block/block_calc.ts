import { BlockSchema } from "types/main/entryjs/schema";
import { BlockExtension } from "../blockExtension";
import { FunctionSchemaGenerator } from "../blockExtension";
import { defaultBlockData } from "./default_calc";

const exportBlocks = {} as BlockExtension

exportBlocks.blockChange = {}

const additionalOptions = [
  ['지수함수', 'exp'],
  ['쌍곡 사인', 'sinh'],
  ['쌍곡 코사인', 'cosh'],
  ['쌍곡 탄젠트', 'tanh'],
  ['역쌍곡 사인', 'arsinh'],
  ['역쌍곡 코사인', 'arcosh'],
  ['역쌍곡 탄젠트', 'artanh'],
  ['부호', 'sign'],
] as const satisfies [string, string][]

const operationEntryFuctions: {[key in typeof additionalOptions[number][1]]: FunctionSchemaGenerator} = {
  exp: defaultBlockData.exp,
  sinh: defaultBlockData.sinh,
  cosh: defaultBlockData.cosh,
  tanh: defaultBlockData.tanh,
  arsinh: defaultBlockData.arsinh,
  arcosh: defaultBlockData.arcosh,
  artanh: defaultBlockData.artanh,
  sign: defaultBlockData.sign,
}

exportBlocks.blockChange.calc_operation = (block) => {
  const operatorOptions = block.params[3].options as [string, string][]

  operatorOptions.splice(-1, 0, ...additionalOptions)

  return {
    onExport: (block) => {
      const json = (block as any)._toJSON()
      const operationType: string = json.params[3]

      const operatorKeys: string[] = additionalOptions.map(x => x[1])

      if (operatorKeys.includes(operationType))

      return json
    }
  }
}


export default exportBlocks
