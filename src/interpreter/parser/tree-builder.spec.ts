import { DenotationFunction, SymbolNode } from '../interfaces';
import { Tokens } from '../lexer';
import { Parser } from './parser';
import { ParserConfig } from './parser-config';
import { TreeBuilder } from './tree-builder';

describe('TreeBuilder', () => {
  it('advances the next token', () => {
    const tokens = new Tokens([
      { type: 'test-str', value: 1 },
      { type: '(end)', value: null },
    ]);

    const builder = new TreeBuilder(tokens, new ParserConfig());
    builder.advance();

    expect(tokens.current()).toEqual({ type: 'test-str', value: 1 });
  });

  it('adds symbol', () => {
    const tokens = new Tokens([
      { type: 'test-str', value: 1 },
      { type: '(end)', value: null },
    ]);

    const builder = new TreeBuilder(tokens, new ParserConfig());
    builder.symbol('test-str');
    builder.advance();

    expect(builder.token()).toEqual({ lbp: 0, led: undefined, nud: undefined, type: 'test-str', value: 1 });
  });

  it('gets interpreted token', () => {
    const tokens = new Tokens([
      { type: 'test-str', value: 1 },
      { type: '(end)', value: null },
    ]);

    const builder = new TreeBuilder(tokens, new ParserConfig());
    builder.symbol('test-str');
    builder.advance();

    expect(builder.token()).toEqual({ lbp: 0, led: undefined, nud: undefined, type: 'test-str', value: 1 });
  });

  describe('expression', () => {
    const selfDf = ((val: SymbolNode) => val) as DenotationFunction;

    it('gets standalone', () => {
      const tokens = new Tokens([
        { type: 'test-token', value: 1 },
        { type: '(end)', value: null },
      ]);

      const builder = new TreeBuilder(tokens, new ParserConfig());

      builder.symbol('test-token', selfDf);

      builder.advance();

      expect(builder.expression(0)).toEqual({
        lbp: 0,
        nud: selfDf,
        type: 'test-token',
        value: 1,
      });
    });

    it('gets with node to the left', () => {
      const tokens = new Tokens([
        { type: 'test-token', value: 1 },
        { type: 'test-token-right', value: null },
        { type: '(end)', value: null },
      ]);

      const builder = new TreeBuilder(tokens, new ParserConfig());

      builder.symbol('test-token', selfDf);
      builder.symbol('test-token-right', undefined, 3, (left?: SymbolNode) => ({
          type: 'test-token-right',
          value: null,
          left,
        })
       );

      builder.advance();

      expect(builder.expression(0)).toEqual({
        type: 'test-token-right',
        value: null,
        left: {
          lbp: 0,
          nud: selfDf,
          type: 'test-token',
          value: 1,
        }
      });
    });

    it('gets with node to the right', () => {
      const tokens = new Tokens([
        { type: 'test-token', value: 1 },
        { type: 'test-token-right', value: null },
        { type: '(end)', value: null },
      ]);

      const builder = new TreeBuilder(tokens, new ParserConfig());

      builder.symbol('test-token', selfDf);
      builder.symbol('test-token-right', undefined, 3, (left?: SymbolNode) => ({
          type: 'test-token-right',
          value: null,
          left,
        })
      );

      builder.advance();

      expect(builder.expression(0)).toEqual({
        type: 'test-token-right',
        value: null,
        left: {
          lbp: 0,
          nud: selfDf,
          type: 'test-token',
          value: 1,
        }
      });
    });

    it('gets with node to the left and right', () => {
      const tokens = new Tokens([
        { type: 'test-token', value: 1 },
        { type: 'test-token-in', value: null },
        { type: 'test-token', value: 2 },
        { type: '(end)', value: null },
      ]);

      const builder = new TreeBuilder(tokens, new ParserConfig());

      builder.symbol('test-token', selfDf);
      builder.symbol('test-token-in', undefined, 3, (left?: SymbolNode) => ({
          type: 'test-token-in',
          left,
          right: builder.expression(3),
        })
      );

      builder.advance();

      expect(builder.expression(0)).toEqual({
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
      });
    });
  });
});
