import Tokenizer from '.'
import { NAME_CHARS, NUMBER_CHARS, WORDBREAK } from './constants'
import { SyntaxError } from '../error'

export function parseVariable(t: Tokenizer) {
  let word = t.nextExcept(WORDBREAK)

  if (!NAME_CHARS.includes(word[0]) || NUMBER_CHARS.includes(word[0])) {
    t.compiler.error(new SyntaxError(t.file, t.code, `Expected variable`, {x: t.x, y: t.y}))
  }

  while (t.code.length > t.index + 1) {
    const char = t.next()
    if (WORDBREAK.includes(char)) return word

    // TODO: handle error
    if (!NAME_CHARS.includes(char)) t.compiler.error(new SyntaxError(t.file, t.code, `Invalid character '${char}' in variable name`, {x: t.x, y: t.y}))
    word += char
  }

  return word
}
