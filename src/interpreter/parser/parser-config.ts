import { DenotationFunction, SymbolNode } from '..';
import { TreeBuilder } from './tree-builder';

export class ParserConfig {
  private functions: ((builder: TreeBuilder) => void)[] = [];

  configureBuilder(builder: TreeBuilder) {
    this.functions.forEach(fn => fn(builder));
  }

  symbol(
    type: string,
    nud?: DenotationFunction,
    lbp = 0,
    led?: DenotationFunction,
  ) {
    this.addFunction((builder: TreeBuilder) => builder.symbol(type, nud, lbp, led));
  }

  infix(
    type: string,
    lbp: number,
    rbp?: number,
    led?: DenotationFunction
  ) {
    this.addFunction(
      (builder: TreeBuilder) => builder.symbol(
        type,
        undefined,
        lbp,
        led || ((left?: SymbolNode) => ({ type, left, right: builder.expression(rbp || lbp) }))
      )
    );
  }

  prefix(type: string, rbp: number) {
    this.addFunction(
      (builder: TreeBuilder) => builder.symbol(type, () => ({ type, right: builder.expression(rbp) }))
    );
  }

  encapsulation(openType: string, closeType: string, rbp: number, nud?: DenotationFunction) {
    this.addFunction((builder: TreeBuilder) => {
      builder.symbol(openType, nud || (() => {
        const value = builder.expression(rbp);
        if (closeType !== builder.token().type) {
          throw new TypeError(`Expected closing tag '${closeType}'`);
        }
        builder.advance();
        return value;
      }));
      builder.symbol(closeType);
    });
  }

  constant(name: string, value: any) {
    this.addFunction(
      (builder: TreeBuilder) => builder.symbol(name, () => ({ type: 'constant', value }), 1000000)
    );
  }

  /** @hidden */
  private addFunction(fn: (builder: TreeBuilder) => void) {
    this.functions.push(fn);
  }
}
