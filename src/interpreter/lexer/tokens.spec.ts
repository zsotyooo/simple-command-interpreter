import { Tokens } from '..';

describe('Tokens', () => {
  const tokenArr = [
    { type: 'test-type1', value: 1 },
    { type: 'test-type2', value: 2 },
  ];

  let tokens: Tokens;

  beforeEach(() => {
    tokens = new Tokens(tokenArr);
  });

  it('gets items', () => {
    expect(tokens.items()).toEqual(tokenArr);
  });

  it('throws error before the first next call', () => {
    expect(() => tokens.current()).toThrowError();
  });

  it('gets current item', () => {
    tokens.next();
    expect(tokens.current()).toEqual(tokenArr[0]);
    tokens.next();
    expect(tokens.current()).toEqual(tokenArr[1]);
  });

  it('inits', () => {
    tokens.init();
    expect(tokens.current()).toEqual(tokenArr[0]);
  });

  it('resets', () => {
    tokens.next();
    tokens.reset();
    expect(() => tokens.current()).toThrowError();
  });

  it('iterates with next', () => {
    expect(tokens.next()).toEqual({ done: false, value: { type: 'test-type1', value: 1 } });
    expect(tokens.next()).toEqual({ done: false, value: { type: 'test-type2', value: 2 } });
    expect(tokens.next()).toEqual({ done: true, value: null });
  });

  it('iterates with for loop', () => {
    let i = 0;
    for (const t of tokens) {
      expect(t).toEqual(tokenArr[i]);
      i++;
    }
  });
});
