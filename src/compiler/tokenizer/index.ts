import Compiler from '..'
import { WORDBREAK } from './constants'

export default class Tokenizer {
  compiler: Compiler
  code: string

  index = 0

  constructor(compiler: Compiler, code: string) {
    this.compiler = compiler
    this.code = code
  }

  tokenize() {}

  tryMatch(keywords: string[]): string | undefined {
    let word = this.nextExcept(WORDBREAK)
    while (this.code.length > this.index+1) {
      for (let i=0; i<keywords.length; i++) {
        if (!keywords[i].startsWith(word)) keywords.splice(i, 1)
      }
      if (keywords.length === 0) return

      const char = this.next()
      if (WORDBREAK.includes(char)) {
        if (keywords.includes(word)) return word
        this.index -= word.length
        return
      }
      word += char
    }
  }

  next() {
    this.index++
    return this.code[this.index]
  }

  nextExcept(exceptions: string) {
    let char = this.next()
    while (exceptions.includes(char)) {
      char = this.next()
    }
    return char
  }
}
