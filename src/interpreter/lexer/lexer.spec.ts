import { Lexer, LexerConfig, Tokens } from '..';

let config: LexerConfig;
let lexer: Lexer;

describe('Lexer', () => {
  // it('has config', () => {
  //   lexer = new Lexer();
  //   expect(lexer.getConfig()).toBeInstanceOf(LexerConfig);
  // });

  describe('process', () => {
    beforeEach(() => {
      config = new LexerConfig();
      config.addMatcher('test-whitespace', /^\s+/, match => null);
      config.addMatcher('test-str', /^[A-Za-z]+/, match => ({ type: 'test-str', value: match.match }));
      lexer = new Lexer(config);
    });

    it('processes input', () => {
      expect(lexer.process('asd ASD')).toEqual(new Tokens([
        { type: 'test-str', value: 'asd' },
        { type: 'test-str', value: 'ASD' },
        { type: '(end)', value: null },
      ]));
    });

    it('throws error', () => {
      expect(() => lexer.process('throw me an error!')).toThrowError();
    });
  });
});
