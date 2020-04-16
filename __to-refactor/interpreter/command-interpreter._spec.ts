import { evaluate, lex, parse } from './command-interpreter';

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

  it('throws error', () => {
    expect(() => lex('an identifier asd123 123 + under_scored')).toThrowError();
  });
});

describe('parse', () => {
  it('finds segments', () => {
    expect(parse(lex('[1 , 2]'))).toEqual([
      {
        type: 'segments',
        value: [
          {
            type: 'number',
            value: 1,
          },
          {
            type: 'number',
            value: 2,
          }
        ]
      }
    ]);
  });

  it('finds repeater', () => {
    expect(parse(lex('[1 , 2] * 2'))).toEqual([
      {
        type: 'segments',
        value: [
          {
            type: 'number',
            value: 1,
          },
          {
            type: 'number',
            value: 2,
          }
        ]
      },
      {
        type: '*',
        right: {
          type: 'number',
          value: 2,
        },
      },
    ]);
  });

  it('finds speed', () => {
    expect(parse(lex('[1 , 2] ^ 2'))).toEqual([
      {
        type: 'segments',
        value: [
          {
            type: 'number',
            value: 1,
          },
          {
            type: 'number',
            value: 2,
          }
        ]
      },
      {
        type: '^',
        right: {
          type: 'number',
          value: 2,
        },
      },
    ]);
  });

  it('finds directions', () => {
    expect(parse(lex('<><><> [1, 2]'))).toEqual([
      {
        type: 'direction',
        value: '<><><>',
      },
      {
        type: 'segments',
        value: [
          {
            type: 'number',
            value: 1,
          },
          {
            type: 'number',
            value: 2,
          }
        ]
      },
    ]);
  });

  it('errors when direction is not followed by segment', () => {
    expect(() => parse(lex('<><><> 1'))).toThrow(TypeError);
  });
});

describe('evaluate', () => {
  it('evaluates segments', () => {
    expect(evaluate(parse(lex('[1, 2][3, 4]')))).toEqual({
      segments: [[1, 2],[3, 4]],
      directions: ['forward'],
      speed: 1,
      multiplier: 1,
    });
  });

  it('evaluates directions', () => {
    expect(evaluate(parse(lex('><> [1, 2]')))).toEqual({
      segments: [[1, 2]],
      directions: ['forward', 'backwards', 'forward'],
      speed: 1,
      multiplier: 1,
    });
  });

  it('evaluates multipliers', () => {
    expect(evaluate(parse(lex('[1, 2] * 2 * 3')))).toEqual({
      segments: [[1, 2]],
      directions: ['forward'],
      speed: 1,
      multiplier: 6,
    });
  });

  it('evaluates speed', () => {
    expect(evaluate(parse(lex('[1, 2] ^ 2 ^ 3')))).toEqual({
      segments: [[1, 2]],
      directions: ['forward'],
      speed: 6,
      multiplier: 1,
    });
  });

  it('evaluates complex', () => {
    expect(evaluate(parse(lex('><> [1, 2][3, 4] ^ 2 ^ 3 * 4 * 5')))).toEqual({
      segments: [[1, 2], [3, 4]],
      directions: ['forward', 'backwards', 'forward'],
      speed: 6,
      multiplier: 20,
    });
  });
});
