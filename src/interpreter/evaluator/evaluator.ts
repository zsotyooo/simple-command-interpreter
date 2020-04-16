import { SymbolNode } from '../interfaces';
import { Resolver } from '..';
import { evalNode, evalTree } from './evaluator-functions';

/**
 * It evaluates the tree porvided by the [[Parser]].
 */
export class Evaluator {
  /** @hidden */
  private variables: { [index: string]: any } = {};

  /** Evaluates a node */
  evalNode(node: SymbolNode): any {
    return evalNode(node, this);
  }

  /** does the evaluation */
  evaluate(parseTree: SymbolNode[]): any[] {
    return evalTree(parseTree, this);
  }

  /** adds an eval function. Use it to resolve the different node types. */
  getResolvers(): { [index: string]: Resolver<any> } {
    return this.resolvers;
  }

  /** adds an eval function. Use it to resolve the different node types. */
  addResolver(name: string, resolver: Resolver<any>) {
    this.resolvers[name] = resolver;
  }

  /** gets the eval function for a node type */
  getResolver(name: string): Resolver<any> {
    return this.resolvers[name];
  }

  /** adds an eval function. Use it to resolve the different node types. */
  addFunction(name: string, fn: (...args: []) => any) {
    this.functions[name] = fn;
  }

  /** gets the eval function for a node type */
  getFunction(name: string): (...args: []) => any {
    return this.functions[name];
  }

  /** adds an eval function. Use it to resolve the different node types. */
  getVars(): { [index: string]: any } {
    return this.variables;
  }

  /** sets variable */
  setVar(name: string, variable: any) {
    this.variables[name] = variable;
  }

  /** gets variable */
  getVar(name: string): any {
     return this.variables[name];
  }

  constructor(
    /** @hidden */
    private resolvers: { [index: string]: Resolver<any> } = {},
    /** @hidden */
    private functions: { [index: string]: (...args: []) => any } = {},
  ) {}
}
