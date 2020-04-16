export const matchers = [
  { type: 'whitespace', rx: /^\s+/ },
  { type: 'unit-f', rx: /^\d+f/ },
  { type: 'unit-ms', rx: /^\d+ms/ },
  { type: 'unit-tc', rx: /^\d{2}:\d{2}:\d{2}:\d{2}/ },
  { type: 'identifier', rx: /^[A-Za-z_][A-Za-z_-\d]*/ },
  { type: 'number', rx: /^[+-]?\d+(\.\d+)?/ },
  { type: 'operator', rx: /^[\*\^\[\],]/ },
  { type: 'direction', rx: /^[><]+/ },
];

export const converters = [
  { type: 'whitespace', fn: false },
  { type: 'operator', fn: (match) => {
      return { type: match.value, value: null };
    }
  },
  { type: 'number', fn: (match) => {
      const num = parseFloat(match.value);
      if (!isFinite(num)) throw new TypeError('Number is too large or too small for a 64-bit double.');
      return { type: 'number', value: num };
    }
  },
];
