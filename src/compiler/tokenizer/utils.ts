import Tokenizer from '.'
import { NAME_CHARS, NUMBER_CHARS, WORDBREAK } from './constants'

export function parseVariable(t: Tokenizer) {
  let word = t.nextExcept(WORDBREAK)

  if (!NAME_CHARS.includes(word[0]) || NUMBER_CHARS.includes(word[0])) throw Error(`Invalid variable name: ${word}`)

  while (t.code.length < t.index) {
    const char = t.next()
    if (WORDBREAK.includes(char)) return word

    // TODO: handle error
    if (!NAME_CHARS.includes(char)) throw Error(`Invalid character ${char}`)
    word += char
  }

  return word
}
