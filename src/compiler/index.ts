import Tokenizer from './tokenizer'
import type { CompilerOptions } from './types'
import type ScribbleError from './error'

export default class Compiler {
  options: CompilerOptions

  constructor(options: CompilerOptions) {
    this.options = options
  }

  compile(code: string, file: string) {
    const tokenizer = new Tokenizer(this, code, file)
    const tokens = tokenizer.tokenize()
    console.log(tokens)
  }

  error(error: ScribbleError, fatal=true) {
    console.error(error.toString())
    if (fatal) process.exit(1)
  }
}
