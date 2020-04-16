import { SymbolTable } from '..';

describe('SymbolTable', () => {

  it('adds symbol and iterprets', () => {
    const table = new SymbolTable();
    table.addSymbol('test-token');

    expect(table.interpretToken({ type: 'test-token' })).toEqual({ lbp: 0, type: 'test-token' });
  });

  it('adds end symbol', () => {
    const table = new SymbolTable();

    expect(table.interpretToken({ type: '(end)' })).toEqual({ lbp: 0, type: '(end)' });
  });
});
