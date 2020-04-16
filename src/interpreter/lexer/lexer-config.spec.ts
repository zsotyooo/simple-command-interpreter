import { LexerConfig, Tokens } from '..';

let config: LexerConfig;

describe('LexerConfig', () => {
  beforeEach(() => {
    config = new LexerConfig();
  });

  it('processes adds and gets matcher', () => {
    config.addMatcher('test-type', /^\S+/);
    expect(config.getMatcher('test-type')).toEqual({ type: 'test-type', rx: /^\S+/ });
  });

  it('gets matchers', () => {
    config.addMatcher('test-type', /^\S+/);
    expect(config.getMatchers()).toEqual([{ type: 'test-type', rx: /^\S+/ }]);
  });

  it('it does not add matcher twice', () => {
    config.addMatcher('test-type', /^\S+/);
    expect(() => config.addMatcher('test-type', /^\S+/)).toThrowError();
  });

  it('it does not add matcher with bad RegExp', () => {
    expect(() => config.addMatcher('test-type2', /\S+/)).toThrowError();
  });
});
