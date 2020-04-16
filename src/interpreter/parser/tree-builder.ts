import { DenotationFunction, SymbolItem, SymbolNode, Token, Tokens } from '..';
import { ParserConfig } from './parser-config';
import { SymbolTable } from './symbol-table';

export class TreeBuilder {
  /** @hidden */
  private symbols = new SymbolTable();

  advance() {
    this.tokens.next();
  }

  token(): SymbolItem {
    return this.symbols.interpretToken(this.tokens.current());
  }

  expression(rbp: number): SymbolNode {
    let left: SymbolNode;
    let token = this.token();

    this.advance();
    if (!token.nud) {
      throw new TypeError(`Unexpected token: ${token.type}. Missing nud!`);
    }
    left = token.nud(token);

    while (rbp < this.token().lbp) {
      token = this.token();
      this.advance();
      if (!token.led) {
        throw new TypeError(`Unexpected token: ${token.type}. Missing led!`);
      }
      left = token.led(left);
    }

    return left;
  }

  symbol(
    type: string,
    nud?: DenotationFunction,
    lbp = 0,
    led?: DenotationFunction,
  ) {
    this.symbols.addSymbol(type, nud, lbp, led);
  }

  constructor(
    private tokens: Tokens,
    private config: ParserConfig,
  ) {
    this.symbol('(end)');
    this.config.configureBuilder(this);
  }
}
