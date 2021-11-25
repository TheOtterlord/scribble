import { Token } from '.'
import Tokenizer from '.'
import { SyntaxOptions } from '../types'
import { parseVariable } from './utils'

export interface Assignment extends Token {
  type: 'assignment'
  operator: string
  name: string
  value: Token // TODO: replace with expression
}

export function parseAssignment(t: Tokenizer, option: keyof SyntaxOptions, match: string): Assignment {
  let name
  let value

  const patterns = t.compiler.options.syntax[option]
  let pattern
  if (typeof patterns[0] === 'string') pattern = patterns as string[]
  else {
    for (let i = 0; i < patterns.length; i++) {
      let p = patterns[i]
      if (p[0] === match) pattern = match
    }
  }
  if (!pattern) throw Error('TODO: Add error handling')

  let x = t.x - pattern[0].length

  for (let i = 1; i<pattern.length; i++) {
    const component = pattern[i]
    if (component.startsWith(':')) {
      if (component === ':name') {
        name = parseVariable(t)
      } else if (component === ':value') {
        value = t.parseAction()
      }
    } else {
      // TODO: handle error
      if (!t.tryMatch([component])) throw Error(`Cannot find "${component}" at word ${i} in statement`)
    }
  }

  if (!name || !value) throw Error(`Misssing ${name ? 'value' : 'name'} in assignment`)

  return {
    x,
    y: t.y,
    type: 'assignment',
    name,
    operator: '=',
    value
  }
}
