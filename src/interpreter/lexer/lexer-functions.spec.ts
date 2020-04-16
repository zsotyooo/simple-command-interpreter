import { Token, TokenConverter, TokenMatcher, TokenMatcherResult } from '../interfaces';
import { Tokens } from './tokens';
import { addToken, findMatcherForType, findNextMatchInString, getProcessorFunction, processInput } from './lexer-functions';

describe('findMatcherForType', () => {
  it('finds matcher', () => {
    const matcher = { type: 'test-type', rx: /^\S+/ };
    expect(findMatcherForType('test-type', [matcher])).toEqual(matcher);
  });

  it('finds no matcher', () => {
    const matcher = { type: 'test-type', rx: /^\S+/ };
    expect(findMatcherForType('test-type-non-exist', [matcher])).toEqual(undefined);
  });
});

describe('findNextMatchInString', () => {
  it('finds matcher', () => {
    const matcher = { type: 'test-type', rx: /^\S+/ };
    expect(findNextMatchInString([ matcher ], '123 asadas')).toEqual({
      matcher,
      match: '123',
    });
  });
});

describe('processorFunction', () => {
  it('finds next token and returns the reduced string', () => {
    const tokenAdderFn = jest.fn();
    const processorFunction = getProcessorFunction([ { type: 'test-type', rx: /^\S+/ } ], tokenAdderFn);

    const remainingStr = processorFunction('test text with words');

    expect(tokenAdderFn).toHaveBeenCalledWith('test-type', 'test');
    expect(remainingStr).toEqual(' text with words');
  });

  it('finds next token and converts it', () => {
    const tokenAdderFn = jest.fn();
    const processorFunction = getProcessorFunction([ { type: 'test-type', rx: /^\S+/, converter: (match: TokenMatcherResult) => ({ type: 'new-type', value: match.match.toUpperCase() }) } ], tokenAdderFn);

    processorFunction('test text with words');

    expect(tokenAdderFn).toHaveBeenCalledWith('new-type', 'TEST');
  });

  it('skips over a token', () => {
    const tokenAdderFn = jest.fn();
    const processorFunction = getProcessorFunction([ { type: 'test-type', rx: /^\s+/, converter: (match: TokenMatcherResult) => null } ], tokenAdderFn);

    const remainingStr = processorFunction(' test text whitespace');

    expect(tokenAdderFn).not.toHaveBeenCalled();
    expect(remainingStr).toEqual('test text whitespace');
  });

  it('throws error', () => {
    const tokenAdderFn = jest.fn();
    const processorFunction = getProcessorFunction([ { type: 'test-type', rx: /^[a-z]+/ } ], tokenAdderFn);

    expect(() => processorFunction('!error')).toThrowError();
  });
});

describe('addToken', () => {
  it('adds token', () => {
    expect(addToken([], 'test-token', 'test-value')).toEqual([{ type: 'test-token', value: 'test-value', }]);
  });
});

describe('processInput', () => {
  it('calls processorFunction the right amount of times', () => {
    const mockProcess = jest.fn().mockImplementation((s: string) => s.slice(1));
    const testStr = 'teststring';
    processInput(testStr, mockProcess);

    expect(mockProcess).toHaveBeenCalledTimes(testStr.length);
  });
});
