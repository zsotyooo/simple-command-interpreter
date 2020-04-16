import * as main from './simple-command-interpreter';

describe('the library', () => {
  it('exports the necessary members', () => {
    expect(main.Lexer).toBeDefined();
  });
});
