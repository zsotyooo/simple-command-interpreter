import { FunctionResolverFunction, NodeResolverFunction, Operation, SymbolNode, ValueResolverFunction } from '../interfaces';
import { Evaluator } from './evaluator';

export interface Resolver<ResolverFunctionType> {
  addResolverFunction(type: string, resolver: ResolverFunctionType): void;
  getResolverFunction(type: string): ResolverFunctionType;
  hasResolverFunction(type: string): boolean;
  resolve(node: SymbolNode, evaluator: Evaluator): any;
}

export abstract class ResolverAbstract<ResolverFunctionType> implements Resolver<ResolverFunctionType> {
  private resolvers: { [index: string]: ResolverFunctionType } = {};

  addResolverFunction(type: string, resolver: ResolverFunctionType) {
    this.resolvers[type] = resolver;
  }

  getResolverFunction(type: string): ResolverFunctionType {
    return this.resolvers[type];
  }

  hasResolverFunction(type: string): boolean {
    return undefined !== this.resolvers[type];
  }

  abstract resolve(node: SymbolNode, evaluator: Evaluator): any;
}

let args: { [index: string]: SymbolNode } = {};

export class ValueResolver extends ResolverAbstract<ValueResolverFunction> {
  resolve(node: SymbolNode, evaluator: Evaluator): any {
    if (!this.hasResolverFunction(node.type)) {
      throw new Error(`No resolver specified for: "${node.type}"`);
    }
    return this.getResolverFunction(node.type)(node.value);
  }
}

export class OperationResolver extends ResolverAbstract<Operation> {
  resolve(node: SymbolNode, evaluator: Evaluator): any {
    if (!this.hasResolverFunction(node.type)) {
      throw new Error(`No resolver specified for: "${node.type}"`);
    }
    const operation = this.getResolverFunction(node.type);
    if (node.left) {
      return operation(evaluator.evalNode(node.left), evaluator.evalNode(node.right as SymbolNode));
    }
    return operation(evaluator.evalNode(node.right as SymbolNode));
  }
}

export class IdentifierResolver extends ResolverAbstract<null> {
  resolve(node: SymbolNode, evaluator: Evaluator): any {
    if (!this.hasResolverFunction(node.type)) {
      throw new Error(`No resolver specified for: "${node.type}"`);
    }
    const value = args.hasOwnProperty(node.value) ? args[node.value] : evaluator.getVar(node.value);
    if (undefined === value) {
      throw new Error(`${node.value} is undefined`);
    }
    return value;
  }
}

export class AssignResolver extends ResolverAbstract<null> {
  resolve(node: SymbolNode, evaluator: Evaluator): any {
    if (!this.hasResolverFunction(node.type)) {
      throw new Error(`No resolver specified for: "${node.type}"`);
    }
    if (undefined === node.details || undefined === node.details.name) {
      throw new Error(`No variable name specified!`);
    }
    evaluator.setVar(node.details.name, evaluator.evalNode(node.value as SymbolNode));
  }
}

export class CallResolver extends ResolverAbstract<NodeResolverFunction> {
  resolve(node: SymbolNode, evaluator: Evaluator): any {
    if (!this.hasResolverFunction(node.type)) {
      throw new Error(`No resolver specified for: "${node.type}"`);
    }
    if (undefined === node.details) {
      throw new Error(`No node details found!`);
    }
    if (!(node.details.args instanceof Array)) {
      throw new Error(`No arguments array found!`);
    }
    if (!(node.details.name instanceof String)) {
      throw new Error(`No function name found!`);
    }

    for (let i = 0; i < node.details.args.length; i++) {
      node.details.args[i] = evaluator.evalNode(node.details.args[i] as SymbolNode);
    }
    return evaluator.getFunction(node.details.name as string).apply(null, node.details.args as []);
  }
}

export class FunctionResolver extends ResolverAbstract<FunctionResolverFunction> {
  resolve(node: SymbolNode, evaluator: Evaluator): any {
    if (!this.hasResolverFunction(node.type)) {
      throw new Error(`No resolver specified for: "${node.type}"`);
    }
    if (undefined === node.details) {
      throw new Error(`No node details found!`);
    }
    if (!(node.details.args instanceof Array)) {
      throw new Error(`No arguments array found!`);
    }
    if (!(node.details.name instanceof String)) {
      throw new Error(`No function name found!`);
    }

    evaluator.addFunction(node.details.name as string, (...fnArgs) => {
      (node.details as { name: string, args: SymbolNode[] }).args.forEach((arg, i) => {
        args[arg.value] = fnArgs[i];
      });
      // for (let i = 0; i < (node.details as { name: string, args: SymbolNode[]}).args.length; i++) {
      //   args[(node.details as { name: string, args: SymbolNode[]}).args[i].value] = fnArgs[i];
      // }
      const ret = evaluator.evalNode(node.value);
      args = {};
      return ret;
    });
  }
}
