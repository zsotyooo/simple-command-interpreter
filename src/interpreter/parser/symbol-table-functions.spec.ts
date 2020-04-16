import { DenotationFunction, SymbolNode } from '../interfaces';
import { addSymbol, interpretToken } from './symbol-table-functions';

const mockNud = jest.fn();
const mockLed = jest.fn();

const selfDf = ((val: SymbolNode) => val) as DenotationFunction;

describe('addSymbol', () => {
  it('adds symbol', () => {
    expect(addSymbol({}, 'test-token', mockNud, 1, mockLed)).toEqual({
      'test-token': {
        lbp: 1,
        led: mockLed,
        nud: mockNud,
        type: 'test-token',
      },
    });
  });
});

describe('interpretToken', () => {
  it('iterprets token into a symbol', () => {
    const symbols = {
      'test-token': {
        lbp: 1,
        led: mockLed,
        nud: mockNud,
        type: 'test-token'
      },
      'test-token2': {
        lbp: 1,
        led: mockLed,
        nud: mockNud,
        type: 'test-token2'
      },
      'test-token3': {
        lbp: 1,
        led: mockLed,
        nud: mockNud,
        type: 'test-token3'
      },
    };

    expect(interpretToken({ type: 'test-token3', value: 'TEST-VALUE' }, symbols)).toEqual({
      lbp: 1,
      led: mockLed,
      nud: mockNud,
      type: 'test-token3',
      value: 'TEST-VALUE',
    });
  });
});
