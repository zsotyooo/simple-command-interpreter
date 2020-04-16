import { SymbolNode } from '../interfaces';
import { evalNode, evalTree } from './evaluator-functions';
import { Evaluator, OperationResolver, ValueResolver } from '..';

describe('evalNode', () => {
  it('evals node', () => {
    const resolveNrFn = jest.fn().mockImplementation((v: any) => Number(v));

    const valueResolver = new ValueResolver();
    valueResolver.addResolverFunction('number', resolveNrFn);

    const evaluator = new Evaluator({ value: valueResolver });

    expect(evalNode({ type: 'number', value: '13' }, evaluator)).toEqual(13);
    expect(resolveNrFn).toHaveBeenCalledWith('13');
  });
});

describe('evalTree', () => {
  it('evals tree', () => {
    const resolveNrFn = jest.fn().mockImplementation((v: any) => Number(v));
    const resolvePlusFn = jest.fn().mockImplementation((a: number, b: number) => a + b);

    const valueResolver = new ValueResolver();
    valueResolver.addResolverFunction('number', resolveNrFn);

    const opResolver = new OperationResolver();
    opResolver.addResolverFunction('+', resolvePlusFn);

    const evaluator = new Evaluator({ value: valueResolver, oprator: opResolver });

    expect(evalTree([
      {
        type: 'number',
        value: '13',
      },
      {
        type: '+',
        left: { type: 'number', value: '1' },
        right: { type: 'number', value: '2' },
      }],
      evaluator
    )).toEqual([ 13, 3 ]);

    expect(resolveNrFn).toHaveBeenCalledWith('1');
    expect(resolveNrFn).toHaveBeenCalledWith('2');
    expect(resolvePlusFn).toHaveBeenCalledWith(1, 2);
  });
});
