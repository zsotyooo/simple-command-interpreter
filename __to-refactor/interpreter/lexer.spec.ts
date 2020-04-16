import lex from './lexer';
import { converters, matchers } from '../config';

lex.matchers = matchers;
lex.converters = converters;

describe('lex', () => {
  it('finds operators', () => {
    expect(lex('* ^ [ ] ,')).toEqual([
      { type: '*', value: null, },
      { type: '^', value: null, },
      { type: '[', value: null, },
      { type: ']', value: null, },
      { type: ',', value: null, },
      { type: '(end)', value: null, },
    ]);
  });

  it('finds numbers', () => {
    expect(lex('1 20 23.45')).toEqual([
      { type: 'number', value: 1, },
      { type: 'number', value: 20, },
      { type: 'number', value: 23.45, },
      { type: '(end)', value: null, },
    ]);
  });

  it('finds identifiers', () => {
    expect(lex('an identifier asd123 under_scored')).toEqual([
      { type: 'identifier', value: 'an', },
      { type: 'identifier', value: 'identifier', },
      { type: 'identifier', value: 'asd123', },
      { type: 'identifier', value: 'under_scored', },
      { type: '(end)', value: null, },
    ]);
  });

  it('finds units', () => {
    expect(lex('123ms 456f 00:12:33:44')).toEqual([
      { type: 'unit-ms', value: '123ms', },
      { type: 'unit-f', value: '456f', },
      { type: 'unit-tc', value: '00:12:33:44', },
      { type: '(end)', value: null, },
    ]);
  });

  it('throws error', () => {
    expect(() => lex('an identifier asd123 123 $ # under_scored')).toThrowError();
  });
});
