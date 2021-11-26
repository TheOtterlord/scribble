import Tokenizer from '.'
import Compiler from '..'

test('Valid string', () => {
  let config = require('../defaults.json')
  config.trace = false

  const compiler = new Compiler(config)
  const tokenizer = new Tokenizer(compiler, '"This is a string"', 'REPL')
  const tokens = tokenizer.tokenize()

  expect(tokens).toEqual([
    { x: 0, y: 0, type: 'string', value: 'This is a string' }
  ])
})

test('String with escaped quote', () => {
  let config = require('../defaults.json')
  config.trace = false

  const compiler = new Compiler(config)
  const tokenizer = new Tokenizer(compiler, '"\\""', 'REPL')
  const tokens = tokenizer.tokenize()

  expect(tokens).toEqual([
    { x: 0, y: 0, type: 'string', value: '"' }
  ])
})
