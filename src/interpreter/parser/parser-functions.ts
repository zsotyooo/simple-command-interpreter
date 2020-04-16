import { Tokens } from '..';

/** @hidden */
export const processTokens = (tokens: Tokens, processor: () => void) => {
  tokens.init();
  const processNextToken = (tokens: Tokens) => {
    if (!tokens.current() || '(end)' !== tokens.current().type) {
      processor();
      processNextToken(tokens);
    }
  };
  processNextToken(tokens);
};
