export type SyntaxOption = string[] | string[][]

export interface SyntaxOptions {
  assignment: SyntaxOption
  additionAssignment: SyntaxOption
  subtractionAssignment: SyntaxOption
  multiplicationAssignment: SyntaxOption
  divisionAssignment: SyntaxOption
  moduloAssignment: SyntaxOption
  exponentialAssignment: SyntaxOption
}

export interface CompilerOptions {
  syntax: SyntaxOptions
  trace: boolean
}
