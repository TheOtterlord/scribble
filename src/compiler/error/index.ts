// Matches to existing `Token` values
export interface CodeLocation {
  x: number;
  y: number;
}

export default class ScribbleError {
  type = 'Error'

  filename: string
  code: string
  message: string
  location: CodeLocation

  constructor(filename: string, code: string, message: string, location: CodeLocation) {
    this.filename = filename
    this.code = code
    this.message = message
    this.location = location
  }

  toString() {
    return `${this.filename}:${this.location.y+1}:${this.location.x+1}:\n${this.format(this.code)}\n${this.type} ${this.message}`
  }

  format(code: string) {
    let line = code.split('\n')[this.location.y]
    return `${this.location.y+1} | ${line}\n${(this.location.y+1).toString().split('').map(() => ' ').join('')}   ${line.split('').map((c,i) => i === this.location.x ? '^' : ' ').join('')}`
  }
}

export class SyntaxError extends ScribbleError {
  type = 'SyntaxError'
}
