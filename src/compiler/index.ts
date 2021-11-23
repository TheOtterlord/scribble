import Tokenizer from './tokenizer'
import type { CompilerOptions } from './types'

export default class Compiler {
  options: CompilerOptions

  constructor(options: CompilerOptions) {
    this.options = options
  }

  compile(code: string) {
    const tokenizer = new Tokenizer(this, code);
    const tokens = tokenizer.tokenize();
  }
}
