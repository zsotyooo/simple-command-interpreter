import { Operator, ParseNode, ParseSymbol, ParseTreeNode, Token, TokenType } from './command-interpreter-interface';

class Parser {
  private symbols: { [index: string]: ParseSymbol } = {};
  private token: Token;
  private currentPosition = 0;

  symbol = (type: TokenType, nud?: (val?: Token) => Token, lbp?: number, led?: (val?: Token) => Token) => {
    symbols[type] = {
      lbp,
      nud,
      led,
    };
  }

  private advance() {
    this.currentPosition++;
  }

  private token(): Token {
    return this.tokens[this.currentPosition];
  }

  constructor(private tokens: Token[]) {}
}
