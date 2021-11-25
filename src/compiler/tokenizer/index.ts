import Compiler from '..'
import { WORDBREAK } from './constants'
import type { SyntaxOptions, SyntaxOption } from '../types'
import { parseAssignment } from './assignment'

export interface Token {
  x: number
  y: number
  type: string
}

export default class Tokenizer {
  compiler: Compiler
  code: string
  startKeywords: string[] = []
  keywordToOption: { [key: string]: keyof SyntaxOptions | (keyof SyntaxOptions)[] } = {}

  index = -1

  constructor(compiler: Compiler, code: string) {
    this.compiler = compiler
    this.code = code
  }

  tokenize() {
    for (let key in this.compiler.options.syntax) {
      let option: SyntaxOption = this.compiler.options.syntax[(key as keyof SyntaxOptions)]
      if (typeof option[0] === 'string') option = [(option as string[])]
      for (const pattern of option) {
        if (pattern[0].startsWith(':')) continue
        this.startKeywords.push(pattern[0])
        if (this.keywordToOption[pattern[0]]) this.keywordToOption[pattern[0]] = [(this.keywordToOption[pattern[0]] as keyof SyntaxOptions), (key as keyof SyntaxOptions)]
        else this.keywordToOption[pattern[0]] = (key as keyof SyntaxOptions)
      }
    }

    const tokens: Token[] = []
    while (this.code.length > this.index) {
      const token = this.parseAction()
      if (!token) break
      tokens.push(token)
    }

    return tokens
  }

  parseAction() {
    const match = this.tryMatch(this.startKeywords)
    if (match) {
      let option = this.keywordToOption[match]
      if (typeof option !== 'string') return console.log('TODO: Add support for full pattern match')
      switch (option) {
        case 'assignment'
          || 'additionAssignment'
          || 'subtractionAssignment'
          || 'multiplicationAssignment'
          || 'divisionAssignment' ||
          'moduloAssignment' ||
          'exponentialAssignment':

          return parseAssignment(this, option, match)

        default:
          console.error(`Unknown statement: ${match}`)
          break
      }
    } else {
      // TODO: Implement default handling (e.g. detect expressions that don't start with keywords)
    }
  }

  tryMatch(keywords: string[]): string | undefined {
    let word = this.nextExcept(WORDBREAK)
    while (this.code.length > this.index + 1) {
      for (let i = 0; i < keywords.length; i++) {
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

    this.index -= word.length
    return
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

  get x() {
    return this.code.substring(0, this.index).split('\n').pop()?.length ?? 0
  }

  get y() {
    return this.code.substring(0, this.index).split('\n').length
  }
}
