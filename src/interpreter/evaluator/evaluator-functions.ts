import { SymbolNode } from '../interfaces';
import { Evaluator, Resolver } from '..';

export const getResolverForType = (type: string, resolvers: { [index: string]: Resolver<any> }): Resolver<any> | undefined => {
  return Object.values(resolvers).find(resolver => resolver.hasResolverFunction(type));
};

/** @hidden */
export const evalNode = (node: SymbolNode, evaluator: Evaluator): any => {
  const resolver = getResolverForType(node.type, evaluator.getResolvers());
  if (undefined === resolver) {
    throw new Error(`No resolver found for ${node.type}`);
  }
  return resolver.resolve(node, evaluator);
};

/** @hidden */
export const evalTree = (parseTree: SymbolNode[], evaluator: Evaluator): any[] => {
  const outputs: any[] = [];
  parseTree.forEach(node => {
    const value = evalNode(node, evaluator);
    outputs.push(value);
  });
  return outputs;
};
