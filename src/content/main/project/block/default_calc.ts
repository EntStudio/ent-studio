import { FunctionSchemaGenerator } from "../blockExtension";

const defaultBlockData: Record<string, FunctionSchemaGenerator> = {
  exp: new FunctionSchemaGenerator((bl, op, fn) => {
    // "절대" 압축한다고 const 등으로 저장해서 사용하지 마시오

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
  ['x'])
}

export default defaultBlockData