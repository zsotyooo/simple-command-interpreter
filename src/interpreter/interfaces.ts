/** An array of Tokens are the result of the lexing process. Later converted to [[SymbolItem]]s and [[SymbolNodes]] */
export interface Token {
  type: string;
  value?: any;
}

/** It receives an object with the match, and the martcher itself: {match, matcher}. You have to make sure you reture abject with { type, value } which will become the token */
export type TokenConverter = (match: TokenMatcherResult) => Token | null;

/**
 * Interface to specify a RegExp to convert the matching part of the string an covert it to a token.
 */
export interface TokenMatcher {
  type: string;
  rx: RegExp;
  converter?: TokenConverter;
}

/**
 * The matching mechanism passes a matcher result to to the [[TokenConverter]].
 */
export interface TokenMatcherResult {
  matcher: TokenMatcher;
  match: string;
}

/**
 * A token with extended information for building the node tree.
 * `nud` is for resolving the actual value token
 * `led` is for resolving to the left
 * `lbp` is the left binding power
 */
export interface SymbolItem extends Token {
  nud?: DenotationFunction;
  led?: DenotationFunction;
  lbp: number;
}

/** Used in the tree building process to specify the `nud`, and `led` */
export type DenotationFunction = (val?: SymbolNode) => SymbolNode;

/**
 * After parsing you end up with a tree of nodes like this.
 * It has the [[Token]], plus extra information.
 * Optionally every node has a left and/or right node, and could have some extra details
 */
export interface SymbolNode extends Token {
  left?: SymbolNode;
  right?: SymbolNode;
  details?: { [index: string]: any };
}

export type Operation = (a: any, b?: any) => any;

export type FunctionResolverFunction = (...args: []) => any;
export type NodeResolverFunction = (node: SymbolNode) => any;
export type ValueResolverFunction = (value: any) => any;
