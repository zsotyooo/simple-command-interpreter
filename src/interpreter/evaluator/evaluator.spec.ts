import { Evaluator, SymbolNode } from '..';
import { OperationResolver, ValueResolver } from './resolvers';

const evalNrFn = (node: SymbolNode) => Number(node.value);
const evalStrFn = (node: SymbolNode) => String(node.value);

let evaluator: Evaluator;

describe('Evaluator', () => {
  beforeAll(() => {
    evaluator = new Evaluator();
  });

  describe('variables', () => {
    it('sets and gets variable', () => {
      evaluator.setVar('testVar', 1);
      expect(evaluator.getVar('testVar')).toEqual(1);
    });
  });

  describe('resolvers', () => {
    it('sets and gets resolvers', () => {
      const resolver = new ValueResolver();

      evaluator.addResolver('test-resolver', resolver);
      expect(evaluator.getResolver('test-resolver')).toEqual(resolver);
    });
  });

  describe('evalNode', () => {
    it('evals node', () => {
      const resolveNrFn = jest.fn().mockImplementation((v: any) => Number(v));

      const valueResolver = new ValueResolver();
      valueResolver.addResolverFunction('number', resolveNrFn);

      const evaluator = new Evaluator({ value: valueResolver });

      expect(evaluator.evalNode({ type: 'number', value: '13' })).toEqual(13);
      expect(resolveNrFn).toHaveBeenCalledWith('13');
    });
  });

  describe('evaluate', () => {
    it('evaluates', () => {
      const resolveNrFn = jest.fn().mockImplementation((v: any) => Number(v));
      const resolvePlusFn = jest.fn().mockImplementation((a: number, b: number) => a + b);

      const valueResolver = new ValueResolver();
      valueResolver.addResolverFunction('number', resolveNrFn);

      const opResolver = new OperationResolver();
      opResolver.addResolverFunction('+', resolvePlusFn);

      const evaluator = new Evaluator({ value: valueResolver, oprator: opResolver });

      expect(evaluator.evaluate([
        {
          type: 'number',
          value: '13',
        },
        {
          type: '+',
          left: { type: 'number', value: '1' },
          right: { type: 'number', value: '2' },
        }]
      )).toEqual([ 13, 3 ]);

      expect(resolveNrFn).toHaveBeenCalledWith('1');
      expect(resolveNrFn).toHaveBeenCalledWith('2');
      expect(resolvePlusFn).toHaveBeenCalledWith(1, 2);
    });
  });

});
