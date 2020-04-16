import { Direction, SegmentInterval } from '../../segment';

export type Operator = '*' | '^' | '[' | ']' | ',';

export type TokenType = Operator | 'operator' | 'number' | 'identifier' | 'whitespace' | 'direction' | 'segments' | 'unit-ms' | 'unit-f' |  'unit-tc' | '(end)';

export interface Token {
  type: TokenType;
  value?: number | string | Token | Token[];
}

export interface ParseSymbol {
  nud: (val?: Token) => Token;
  led: (val?: Token) => Token;
  lbp: number;
}

export interface ParseNode extends ParseSymbol, Token {

}

export interface ParseTreeNode extends Token {
  left?: ParseTreeNode;
  right?: ParseTreeNode;
}

export interface EvaluationResult {
  segments: SegmentInterval[];
  directions: Direction[];
  speed: number;
  multiplier: number;
}
