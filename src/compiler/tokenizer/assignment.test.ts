import Tokenizer from '.'
import Compiler from '..'

test('Assign number to variable', () => {
  let config = require('../defaults.json')
  config.trace = false

  const compiler = new Compiler(config)
  const tokenizer = new Tokenizer(compiler, 'set x to 1', 'REPL')
  const tokens = tokenizer.tokenize()

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
