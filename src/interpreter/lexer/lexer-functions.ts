import { Token, TokenConverter, TokenMatcher, TokenMatcherResult, Tokens } from '..';

/** @hidden */
export const findMatcherForType = (type: string, matchers: TokenMatcher[]): TokenMatcher | undefined => {
  return matchers.find(m => type === m.type);
};

/** @hidden */
export const findNextMatchInString = (matchers: TokenMatcher[], str: string): TokenMatcherResult | false => {
  for (const matcher of matchers) {
    const matches = str.match(matcher.rx);
    if (matches) {
      return { matcher, match: matches[0] };
    }
  }
  return false;
};

/** @hidden */
export const getProcessorFunction = (matchers: TokenMatcher[], addTokenFn: (type: string, value?: any) => void): (s: string) => string => {
  return (input: string) => {
    const matched = findNextMatchInString(matchers, input);

    if (!matched) {
      throw new Error(`Invalid character at: ${input}`);
    }

    if (matched.matcher.converter) {
      const token = (matched.matcher.converter as TokenConverter)(matched);
      if (token) {
        addTokenFn(token.type, token.value);
      }
    } else {
      addTokenFn(matched.matcher.type, matched.match);
    }

    return input.slice(matched.match.length);
  };
};

/** @hidden */
export const addToken = (tokens: Token[], type: string, value?: any): Token[] => {
  const ret = [ ...tokens ];
  ret.push({ type, value });
  return ret;
};

/** @hidden */
export const processInput = (input: string, processor: (s: string) => string) => {
  const str = processor(input);
  if (0 < str.length) {
    processInput(str, processor);
  }
};
