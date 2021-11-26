import Tokenizer, { Token } from '.'
import ScribbleError, { SyntaxError } from '../error'
import { STRING_CHARS, WORDBREAK } from './constants'

export interface StringToken extends Token {
  type: 'string'
  value: string
}

export function parseString(t: Tokenizer): StringToken {
  let word = t.nextExcept(WORDBREAK)

  let x = t.x
  let y = t.y

  if (!STRING_CHARS.includes(word)) t.compiler.error(new ScribbleError(t.file, t.code, `An internal engine error occured. Please report this error to https://github.com/TheOtterlord/scribble/issues`, {x,y}))

  let lastChar
  while (t.code.length > t.index + 1) {
    const char = t.next()
    if (word[0] === char && lastChar !== '\\') {
      break
    }
    if (word[0] == char && lastChar === '\\') {
      word = word.substr(0, word.length - 1)
    }
    word += char
    lastChar = char
  }
  return {
    x,
    y,
    type: 'string',
    value: word.substr(1)
  }
}
