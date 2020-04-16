import { Evaluator, LexerConfig, Parser } from '..';

export class Configurator {


  constructor(
    /** hidden */
    private name: string,
    private configureFn: (lexer: Lexer, parser: Parser, evaluator: Evaluator),
  ) {}
}
