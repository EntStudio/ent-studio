import { FunctionSchemaGenerator } from "../blockExtension";

export const defaultBlockData: Record<string, FunctionSchemaGenerator> = {
  exp: new FunctionSchemaGenerator((bl, op, fn) => {
    // "절대" 압축한다고 const 등으로 저장해서 사용하지 마시오
    // 응그래

    fn.variable['n'] = op.div(fn.param['x'], op.round(bl.number(2.302585092994045684)))
    fn.variable['r'] = op.sub(fn.param['x'], op.mul(fn.variable['n'], bl.number(2.302585092994045684)))
    fn.variable['result'] = op.square(op.square(op.square(op.square(op.square(op.square(op.square(op.square(op.add(bl.number(1), op.div(fn.variable['r'], bl.number(1)))))))))))
    fn.variable['result'] = op.mul(fn.variable['result'], op.add(bl.number(1), op.sub(fn.variable['r'], op.ln(fn.variable['return']))))
    fn.variable['result'] = op.mul(fn.variable['result'], op.add(bl.number(1), op.sub(fn.variable['r'], op.ln(fn.variable['return']))))
    fn.variable['result'] = op.mul(fn.variable['result'], op.add(bl.number(1), op.sub(fn.variable['r'], op.ln(fn.variable['return']))))
    fn.variable['result'] = op.mul(fn.variable['result'], op.add(bl.number(1), op.sub(fn.variable['r'], op.ln(fn.variable['return']))))
    fn.variable['result'] = bl.replace_string(null, bl.combine_string(null, bl.text('1e+'), null, fn.variable['n'], null), null, bl.text('+-'), null, bl.text('-'))

    return fn.variable['result']
  },
  ['n', 'r', 'result'],
  ['x']),
  sinh: new FunctionSchemaGenerator((bl, op, fn) => {
    fn.variable['n'] = op.div(fn.param['x'], op.round(bl.number(2.302585092994045684)))
    fn.variable['r'] = op.sub(fn.param['x'], op.mul(fn.variable['n'], bl.number(2.302585092994045684)))
    fn.variable['result'] = op.square(op.square(op.square(op.square(op.square(op.square(op.square(op.square(op.add(bl.number(1), op.div(fn.variable['r'], bl.number(1)))))))))))
    fn.variable['result'] = op.mul(fn.variable['result'], op.add(bl.number(1), op.sub(fn.variable['r'], op.ln(fn.variable['return']))))
    fn.variable['result'] = op.mul(fn.variable['result'], op.add(bl.number(1), op.sub(fn.variable['r'], op.ln(fn.variable['return']))))
    fn.variable['result'] = op.mul(fn.variable['result'], op.add(bl.number(1), op.sub(fn.variable['r'], op.ln(fn.variable['return']))))
    fn.variable['result'] = op.mul(fn.variable['result'], op.add(bl.number(1), op.sub(fn.variable['r'], op.ln(fn.variable['return']))))
    fn.variable['result'] = bl.replace_string(null, bl.combine_string(null, bl.text('1e+'), null, fn.variable['n'], null), null, bl.text('+-'), null, bl.text('-'))
    fn.variable['result'] = op.div(op.sub(fn.variable['result'], op.div(bl.number(1), fn.variable['result'])), bl.number(2))

    return fn.variable['result']
  },
  ['n', 'r', 'result'],
  ['x']),
  cosh: new FunctionSchemaGenerator((bl, op, fn) => {
    fn.variable['n'] = op.div(fn.param['x'], op.round(bl.number(2.302585092994045684)))
    fn.variable['r'] = op.sub(fn.param['x'], op.mul(fn.variable['n'], bl.number(2.302585092994045684)))
    fn.variable['result'] = op.square(op.square(op.square(op.square(op.square(op.square(op.square(op.square(op.add(bl.number(1), op.div(fn.variable['r'], bl.number(1)))))))))))
    fn.variable['result'] = op.mul(fn.variable['result'], op.add(bl.number(1), op.sub(fn.variable['r'], op.ln(fn.variable['return']))))
    fn.variable['result'] = op.mul(fn.variable['result'], op.add(bl.number(1), op.sub(fn.variable['r'], op.ln(fn.variable['return']))))
    fn.variable['result'] = op.mul(fn.variable['result'], op.add(bl.number(1), op.sub(fn.variable['r'], op.ln(fn.variable['return']))))
    fn.variable['result'] = op.mul(fn.variable['result'], op.add(bl.number(1), op.sub(fn.variable['r'], op.ln(fn.variable['return']))))
    fn.variable['result'] = bl.replace_string(null, bl.combine_string(null, bl.text('1e+'), null, fn.variable['n'], null), null, bl.text('+-'), null, bl.text('-'))
    fn.variable['result'] = op.div(op.add(fn.variable['result'], op.div(bl.number(1), fn.variable['result'])), bl.number(2))

    return fn.variable['result']
  },
  ['n', 'r', 'result'],
  ['x']),
  tanh: new FunctionSchemaGenerator((bl, op, fn) => {
    fn.variable['n'] = op.div(fn.param['x'], op.round(bl.number(2.302585092994045684)))
    fn.variable['r'] = op.sub(fn.param['x'], op.mul(fn.variable['n'], bl.number(2.302585092994045684)))
    fn.variable['result'] = op.square(op.square(op.square(op.square(op.square(op.square(op.square(op.square(op.add(bl.number(1), op.div(fn.variable['r'], bl.number(1)))))))))))
    fn.variable['result'] = op.mul(fn.variable['result'], op.add(bl.number(1), op.sub(fn.variable['r'], op.ln(fn.variable['return']))))
    fn.variable['result'] = op.mul(fn.variable['result'], op.add(bl.number(1), op.sub(fn.variable['r'], op.ln(fn.variable['return']))))
    fn.variable['result'] = op.mul(fn.variable['result'], op.add(bl.number(1), op.sub(fn.variable['r'], op.ln(fn.variable['return']))))
    fn.variable['result'] = op.mul(fn.variable['result'], op.add(bl.number(1), op.sub(fn.variable['r'], op.ln(fn.variable['return']))))
    fn.variable['result'] = bl.replace_string(null, bl.combine_string(null, bl.text('1e+'), null, fn.variable['n'], null), null, bl.text('+-'), null, bl.text('-'))
    fn.variable['result'] = op.div(op.sub(fn.variable['result'], op.div(bl.number(1), fn.variable['result'])), op.add(fn.variable['result'], op.div(bl.number(1), fn.variable['result'])))

    return fn.variable['result']
  },
  ['n', 'r', 'result'],
  ['x']),
  sign: new FunctionSchemaGenerator((bl, op, fn) => {
    // 뒤를 부탁한다

    return fn.variable['result']
  },
  ['n', 'r', 'result'],
  ['x'])
}