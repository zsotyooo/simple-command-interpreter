import { TokenConverter, TokenMatcher } from '../interfaces';
import { findMatcherForType } from './lexer-functions';

/**
 * Use it to specify regular expressions and to convert the matches to tokens
 *
 * usage:
 * ```ts
 * config = new LexerConfig();
 * config.addMatcher('whitespace', /^\s+/, match => null);
 * config.addMatcher('identifier', /^[A-Za-z_].[A-Za-z0-9_]+/, match => ({ type: 'identifier', value: match.match }));
 * ```
 */
export class LexerConfig {
  private matchers: TokenMatcher[] = [];

  /** adds matcher for a token type */
  /**
   * [addMatcher description]
   * @param {string}         type      the future type of the [[Token]]
   * @param {RegExp}         rx        Since the processing of the string always removes the already processed part, always start you RegExp with `^` to ensure that you are grabbing the beginning of the remaining string!
   * @param {TokenConverter} converter It receives an object with the match, and the martcher itself: {match, matcher}. You have to make sure you reture abject with { type, value } which will become the token!
   */
  addMatcher(
    type: string,
    rx: RegExp,
    converter?: TokenConverter,
  ) {
    if (0 !== rx.source.indexOf('^')) {
      throw new Error(`Matcher RegExp has to start with ^: "${rx}"`);
    }
    if (undefined !== findMatcherForType(type, this.matchers)) {
      throw new Error(`Matcher already exists: "${type}"`);
    }
    this.matchers.push({ type, rx, converter });
  }

  getMatcher(type: string): TokenMatcher | undefined {
    return findMatcherForType(type, this.matchers);
  }

  getMatchers(): TokenMatcher[] {
    return this.matchers;
  }
}
