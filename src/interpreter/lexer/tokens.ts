import { Token } from '../interfaces';

export class Tokens implements IterableIterator<Token | null> {

  private pointer = -1;

  items(): Token[] {
    return this.tokens;
  }

  reset() {
    return this.pointer = -1;
  }

  init() {
    return this.pointer = 0;
  }

  current(): Token {
    if (0 > this.pointer) {
      throw new Error(`The first token is not initialised yet! Try calling next first!`);
    }
    return this.tokens[this.pointer];
  }

  next(): IteratorResult<Token | null> {
    let ret: IteratorResult<Token | null>;
    this.pointer ++;
    if (this.tokens.length > this.pointer) {
      ret = {
        done: false,
        value: this.current(),
      };
    } else {
      ret = {
        done: true,
        value: null,
      };
    }
    return ret;
  }

  [Symbol.iterator](): IterableIterator<Token | null> {
    return this;
  }

  constructor(public tokens: Token[]) {}
}
