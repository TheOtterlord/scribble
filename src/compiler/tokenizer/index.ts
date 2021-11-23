import Compiler from '..'

export default class Tokenizer {
  compiler: Compiler
  code: string

  index = 0

  constructor(compiler: Compiler, code: string) {
    this.compiler = compiler
    this.code = code
  }

  tokenize() {}

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
