import { Evaluator, SymbolNode } from '..';
import { IdentifierResolver, OperationResolver, ValueResolver } from './resolvers';

let valResolver: ValueResolver;
let opResolver: OperationResolver;
let idResolver: IdentifierResolver;
let evaluator: Evaluator;

describe('Resolvers', () => {
  describe('ValueResolver', () => {
    const resolveFn = jest.fn();

    beforeEach(() => {
      valResolver = new ValueResolver();
      evaluator = new Evaluator({ valResolver });
    });

    describe('function handling', () => {
      it('sets and gets resolver fn', () => {
        valResolver.addResolverFunction('test-type', resolveFn);
        expect(valResolver.hasResolverFunction('test-type')).toEqual(true);
        expect(valResolver.getResolverFunction('test-type')).toEqual(resolveFn);
      });
    });

    describe('resolve', () => {
      it('calls resolver fn', () => {
        valResolver.addResolverFunction('test-type', resolveFn);
        valResolver.resolve({ type: 'test-type', value: 'TEST-VALUE' }, evaluator);
        expect(resolveFn).toHaveBeenCalledWith('TEST-VALUE');
      });

      it('throws error for non existing resolver fn-s', () => {
        expect(() => valResolver.resolve({ type: 'test-type2', value: 'TEST-VALUE' }, evaluator)).toThrowError();
      });
    });
  });

  describe('OperationResolver', () => {
    const resolveNrFn = jest.fn().mockImplementation((v: any) => Number(v));
    const resolvePlusFn = jest.fn().mockImplementation((a: number, b: number) => a + b);
    const resolveNegFn = jest.fn().mockImplementation((a: number) => -1 * a);

    beforeEach(() => {
      opResolver = new OperationResolver();
      valResolver = new ValueResolver();
      valResolver.addResolverFunction('number', resolveNrFn);
      opResolver.addResolverFunction('+', resolvePlusFn);
      opResolver.addResolverFunction('-', resolveNegFn);
      evaluator = new Evaluator({ valResolver, opResolver });
    });

    describe('function handling', () => {
      it('sets and gets resolver fn', () => {
        const resolveFn = jest.fn();
        opResolver.addResolverFunction('test-type', resolveFn);
        expect(opResolver.hasResolverFunction('test-type')).toEqual(true);
        expect(opResolver.getResolverFunction('test-type')).toEqual(resolveFn);
      });
    });

    describe('resolve', () => {
      it('calls resolver fn with right', () => {
        opResolver.resolve({ type: '-', right: { type: 'number', value: 1 } }, evaluator);
        expect(resolveNegFn).toHaveBeenCalledWith(1);
      });

      it('calls resolver fn with left and right', () => {
        opResolver.resolve({ type: '+', right: { type: 'number', value: 1 }, left: { type: 'number', value: 2 } }, evaluator);
        expect(resolvePlusFn).toHaveBeenCalledWith(2, 1);
      });

      it('throws error for non existing resolver fn-s', () => {
        expect(() => opResolver.resolve({ type: 'test-type2', value: 'TEST-VALUE' }, evaluator)).toThrowError();
      });
    });
  });

  describe('IdentifierResolver', () => {
    const resolveNrFn = jest.fn().mockImplementation((v: any) => Number(v));
    const resolvePlusFn = jest.fn().mockImplementation((a: number, b: number) => a + b);
    const resolveNegFn = jest.fn().mockImplementation((a: number) => -1 * a);

    beforeEach(() => {
      idResolver = new IdentifierResolver();
      valResolver = new ValueResolver();
      valResolver.addResolverFunction('number', resolveNrFn);
      idResolver.addResolverFunction('identifier', null);
      evaluator = new Evaluator({ valResolver, idResolver });
    });

    describe('function handling', () => {
      it('sets and gets resolver fn', () => {
        const resolveFn = jest.fn();
        idResolver.addResolverFunction('test-type', null);
        expect(idResolver.hasResolverFunction('test-type')).toEqual(true);
        expect(idResolver.getResolverFunction('test-type')).toEqual(null);
      });
    });

    describe('resolve', () => {
      it('resolves with node value', () => {
        evaluator.setVar('myVar', 1);
        expect(idResolver.resolve({ type: 'identifier', value: 'myVar' }, evaluator))
        .toEqual(1);
      });

      it('throws error if no such var exists', () => {
        expect(() => idResolver.resolve({ type: 'identifier', value: 'myVar2' }, evaluator)).toThrowError();
      });

      // it('calls resolver fn with left and right', () => {
      //   opResolver.resolve({ type: '+', right: { type: 'number', value: 1 }, left: { type: 'number', value: 2 }  }, evaluator);
      //   expect(resolvePlusFn).toHaveBeenCalledWith(2, 1);
      // });

      it('throws error for non existing resolver fn-s', () => {
        expect(() => idResolver.resolve({ type: 'test-type2', value: 'TEST-VALUE' }, evaluator)).toThrowError();
      });
    });
  });
});
