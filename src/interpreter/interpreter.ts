import { Evaluator, Lexer, Parser } from './index';

export class Interpreter {
  /** @hidden */
  private lexer = new Lexer();
  /** @hidden */
  private parser = new Parser();
  /** @hidden */
  private evaluator = new Evaluator();
}
