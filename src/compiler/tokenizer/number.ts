import Tokenizer, { Token } from '.'
import { SyntaxError } from '../error'
import { NUMBER_CHARS, WORDBREAK } from './constants'

export interface NumberToken extends Token {
  type: 'number'
  value: string
}

export function parseNumber(t: Tokenizer): NumberToken {
  let word = t.nextExcept(WORDBREAK)

  let x = t.x
  let y = t.y

  while (t.code.length > t.index + 1) {
    const char = t.next()
    if (WORDBREAK.includes(char)) {
      break
    } else if (!NUMBER_CHARS.includes(char)) {
      t.compiler.error(new SyntaxError(t.file, t.code, `Unexpected character "${char}"`, {x: t.x, y}))
    }
    word += char
  }
  return {
    x,
    y,
    type: 'number',
    value: word
  }
}
