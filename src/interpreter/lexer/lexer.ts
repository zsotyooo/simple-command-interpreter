import { Token } from '..';
import { Tokens } from './tokens';
import { LexerConfig } from './lexer-config';
import { addToken, findMatcherForType, findNextMatchInString, getProcessorFunction, processInput } from './lexer-functions';

/**
 * It creates a lexicon of `Tokens` by processing an input string based on the `LexerConfig` configuration.
 *
 * Usage:
 * ```ts
 * config = new LexerConfig();
 * config.addMatcher('whitespace', /^\s+/, match => null);
 * config.addMatcher('identifier', /^[A-Za-z_].[A-Za-z0-9_]+/, match => ({ type: 'identifier', value: match.match }));
 * lexer = new Lexer(config);
 * ```
 */
export class Lexer {
  /** the method to process the input string */
  process(input: string): Tokens {
    let tokens: Token[] = [];

    processInput(input, getProcessorFunction(this.config.getMatchers(), (type: string, value?: any) => {
      tokens = addToken(tokens, type, value);
    }));

    tokens = addToken(tokens, '(end)', null);

    return new Tokens(tokens);
  }

  constructor(
    /** @hidden */
    private config = new LexerConfig()
  ) {}
}
