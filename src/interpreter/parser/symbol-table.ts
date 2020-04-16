import { DenotationFunction, SymbolItem, Token } from '../interfaces';
import { addSymbol, interpretToken } from './symbol-table-functions';

/**
 * @hidden
 */
export class SymbolTable {
  private symbols: { [index: string]: SymbolItem } = {};

  interpretToken(token: Token): SymbolItem {
    return interpretToken(token, this.symbols);
  }

  addSymbol(
    type: string,
    nud?: DenotationFunction,
    lbp = 0,
    led?: DenotationFunction,
  ) {
    this.symbols = addSymbol(this.symbols, type, nud, lbp, led);
  }

  constructor() {
    this.addSymbol('(end)');
  }
}

