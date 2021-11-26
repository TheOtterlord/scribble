import Compiler from '..'
import { NUMBER_CHARS, WORDBREAK } from './constants'
import type { SyntaxOptions, SyntaxOption } from '../types'
import { parseAssignment } from './assignment'
import { parseNumber } from './number'
import ScribbleError from '../error'

export interface Token {
  x: number
  y: number
  type: string
}

export default class Tokenizer {
  compiler: Compiler
  code: string
  file: string
  startKeywords: string[] = []
  keywordToOption: { [key: string]: keyof SyntaxOptions | (keyof SyntaxOptions)[] } = {}

  index = -1

  constructor(compiler: Compiler, code: string, file: string) {
    this.compiler = compiler
    this.code = code
    this.file = file
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
      this.compiler.trace(`Detected ${option}`)
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
      // detect remaining patterns
      // detect variable names
      // detect numbers
      // detect strings

      const char = this.nextExcept(WORDBREAK)
      this.index--

      if (NUMBER_CHARS.includes(char)) return parseNumber(this)
    }
  }

  tryMatch(keywords: string[]): string | undefined {
    let oldIndex = this.index

    let word = this.nextExcept(WORDBREAK)

    if (!word) {
      this.index = oldIndex
      return
    }

    while (this.code.length > this.index + 1) {
      for (let i = 0; i < keywords.length; i++) {
        if (!keywords[i].startsWith(word)) keywords.splice(i, 1)
      }
      if (keywords.length === 0) {
        this.index = oldIndex
        return
      }

      const char = this.next()
      if (WORDBREAK.includes(char)) {
        if (keywords.includes(word)) return word
        this.index = oldIndex
        return
      }
      word += char
    }

    this.index = oldIndex
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
    return this.code.substring(0, this.index).split('\n').length - 1
  }
}
