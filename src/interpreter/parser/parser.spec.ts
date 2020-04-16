import { DenotationFunction, SymbolNode } from '../interfaces';
import { Tokens } from '../lexer';
import { ParserConfig } from './parser-config';
import { Parser } from './parser';

const selfDf = ((val: SymbolNode) => val) as DenotationFunction;

describe('Parser', () => {
  it('parses', () => {
    const tokens = new Tokens([
      { type: 'enc-open', value: null },
      { type: 'test-token', value: 1 },
      { type: 'test-token-in', value: null },
      { type: 'test-token-prefix', value: null },
      { type: 'test-token', value: 2 },
      { type: 'enc-close', value: null },
      { type: '(end)', value: null },
    ]);

    const parser = new Parser();

    const config = new ParserConfig();

    config.symbol('test-token', selfDf);
    config.prefix('test-token-prefix', 7);
    config.infix('test-token-in', 3);
    config.encapsulation('enc-open', 'enc-close', 2);

    expect(parser.parse(tokens, config)).toEqual([{
      type: 'test-token-in',
      left: {
        lbp: 0,
        nud: selfDf,
        type: 'test-token',
        value: 1,
      },
      right: {
        type: 'test-token-prefix',
        right: {
          lbp: 0,
          nud: selfDf,
          type: 'test-token',
          value: 2,
        },
      },
    }]);
  });
});
