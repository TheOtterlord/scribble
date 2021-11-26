import Tokenizer from '.'
import Compiler from '..'

test('Valid number', () => {
  let config = require('../defaults.json')
  config.trace = false

  const compiler = new Compiler(config)
  const tokenizer = new Tokenizer(compiler, '1', 'REPL')
  const tokens = tokenizer.tokenize()

  expect(tokens).toEqual([
    { x: 0, y: 0, type: 'number', value: '1' }
  ])
})
