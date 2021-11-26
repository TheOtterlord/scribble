import Tokenizer from '.'
import Compiler from '..'

let config = require('../defaults.json')
config.trace = false

function tokenize(code: string) {
  const compiler = new Compiler(config)
  const tokenizer = new Tokenizer(compiler, code, 'REPL')
  return tokenizer.tokenize()
}

test('Assign number to variable', () => {
  const tokens = tokenize('set x to 1')

  expect(tokens).toEqual([
    {
      x: 0,
      y: 0,
      type: 'assignment',
      name: 'x',
      operator: '=',
      value: { x: 9, y: 0, type: 'number', value: '1' }
    }
  ])
})
