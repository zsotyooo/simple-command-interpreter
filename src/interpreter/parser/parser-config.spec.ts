import { DenotationFunction, SymbolNode } from '../interfaces';
import { Tokens } from '../lexer';
import { Parser } from './parser';
import { ParserConfig } from './parser-config';

describe('ParserConfig', () => {
  const selfDf = ((val: SymbolNode) => val) as DenotationFunction;
  describe('prefix', () => {
    it('gets tree nodes', () => {
      const tokens = new Tokens([
        { type: 'test-token-prefix', value: null },
        { type: 'test-token', value: 1 },
        { type: '(end)', value: null },
      ]);

      const config = new ParserConfig();
      config.prefix('test-token-prefix', 7);
      config.symbol('test-token', selfDf);

      const parser = new Parser();

      expect(parser.parse(tokens, config)).toEqual([{
        type: 'test-token-prefix',
        right: {
          lbp: 0,
          nud: selfDf,
          type: 'test-token',
          value: 1,
        },
      }]);
    });
  });

  describe('infix', () => {
    it('gets tree nodes', () => {
      const tokens = new Tokens([
        { type: 'test-token', value: 1 },
        { type: 'test-token-in', value: null },
        { type: 'test-token', value: 2 },
        { type: '(end)', value: null },
      ]);

      const config = new ParserConfig();
      config.symbol('test-token', selfDf);
      config.infix('test-token-in', 3);

      const parser = new Parser();

      expect(parser.parse(tokens, config)).toEqual([{
        type: 'test-token-in',
        left: {
          lbp: 0,
          nud: selfDf,
          type: 'test-token',
          value: 1,
        },
        right: {
          lbp: 0,
          nud: selfDf,
          type: 'test-token',
          value: 2,
        },
      }]);
    });
  });

  describe('encapsulation', () => {
    it('gets tree nodes', () => {
      const tokens = new Tokens([
        { type: 'enc-open', value: null },
        { type: 'test-token', value: 1 },
        { type: 'enc-close', value: null },
        { type: '(end)', value: null },
      ]);

      const config = new ParserConfig();
      config.symbol('test-token', selfDf);
      config.encapsulation('enc-open', 'enc-close', 2);

      const parser = new Parser();

      expect(parser.parse(tokens, config)).toEqual([{
        lbp: 0,
        nud: selfDf,
        type: 'test-token',
        value: 1,
      }]);
    });
  });

  describe('constant', () => {
    it('gets tree nodes', () => {
      const tokens = new Tokens([
        { type: 'test-token-const', value: null },
        { type: '(end)', value: null },
      ]);

      const config = new ParserConfig();
      config.constant('test-token-const', 'FIXED VALUE');

      const parser = new Parser();

      expect(parser.parse(tokens, config)).toEqual([{
        type: 'constant',
        value: 'FIXED VALUE',
      }]);
    });
  });
});
