import { DenotationFunction, SymbolItem, SymbolNode, Token, Tokens } from '..';
import { ParserConfig } from './parser-config';
import { TreeBuilder } from './tree-builder';
import { processTokens } from './parser-functions';

export class Parser {
  parse(tokens: Tokens, config: ParserConfig): SymbolNode[] {
    const parseTree: SymbolNode[] = [];
    const builder = new TreeBuilder(tokens, config);

    processTokens(tokens, () => {
      parseTree.push(builder.expression(0));
    });

    return parseTree;
  }
}
