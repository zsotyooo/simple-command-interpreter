import { Token, TokenType } from './command-interpreter-interface';

interface TokenMatcher { type: TokenType; rx: RegExp; }
interface TokenConverter { type: TokenType; fn: ((match: TokenMatcherMachResult, lexer?: Lexer) => Token) | false; }

interface TokenMatcherMachResult { matcher: TokenMatcher; value: string; }

class Lexer {
  private remaining = '';
  private tokens: Token[] = [];

  process(): Token[] {
    while (0 < this.remaining.length) {
      const match = this.advance();
      const converter = this.converters.find((c) => match.matcher.type === c.type);
      if (converter) {
        if (false !== converter.fn) {
          const token = converter.fn(match, this);
          this.addToken(token.type, token.value);
        }
      } else {
        this.addToken(match.matcher.type, match.value);
      }
    }
    this.addToken('(end)', null);
    return this.tokens;
  }

  private advance(): TokenMatcherMachResult {
    for (const matcher of this.matchers) {
       const matches = this.remaining.match(matcher.rx);
       if (matches) {
         this.remaining = this.remaining.slice(matches[0].length);
         return {
           matcher,
           value: matches[0],
         };
       }
    }
    throw new Error(`Invalid character in command at: ${this.remaining}`);
  }

  private addToken = (type: TokenType, value?: any) => {
    this.tokens.push({
      type,
      value,
    });
  }

  constructor(
    input: string,
    public matchers: TokenMatcher[],
    public converters: TokenConverter[] = [],
  ) {
    this.remaining = input;
  }
}

const lex = (input: string) => {
  return (new Lexer(input, lex.matchers, lex.converters)).process();
};

lex.matchers = [];
lex.converters = [];

export default lex;
