import { DenotationFunction, SymbolItem, Token } from '../interfaces';
import { Tokens } from '..';

/** @hidden */
export const addSymbol = (
  symbols: { [index: string]: SymbolItem },
  type: string,
  nud?: DenotationFunction,
  lbp = 0,
  led?: DenotationFunction,
): { [index: string]: SymbolItem } => {
  const symbol: SymbolItem = symbols[type] || {};
  const ret = symbols;
  ret[type] = {
    type,
    lbp: symbol.lbp || lbp,
    nud: symbol.nud || nud,
    led: symbol.led || led,
  };
  return ret;
};

/** @hidden */
export const interpretToken = (token: Token, symbols: { [index: string]: SymbolItem }): SymbolItem => {
  const symbol = Object.assign({}, symbols[token.type]);
  symbol.type = token.type;
  symbol.value = token.value;
  return symbol;
};
