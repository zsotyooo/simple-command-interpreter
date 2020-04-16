import { EvaluationResult, Operator, ParseNode, ParseSymbol, ParseTreeNode, Token, TokenType } from './command-interpreter-interface';
import { Direction } from '../../segment';

export const lex = (input: string): Token[] => {
  const tokens: Token[] = [];
  let c: string;
  let i = 0;

  const isOperator = (c: string) => /[\*\^\[\],]/.test(c);

  const isDigit = (c: string) => /[0-9]/.test(c);

  const isWhiteSpace = (c: string) => /\s/.test(c);

  const isIdentifier = (c: string) => /[a-z_-]/.test(c) && !isOperator(c) && !isDigit(c) && !isWhiteSpace(c);

  const isDirection = (c: string) => /[><]/.test(c) && !isOperator(c) && !isDigit(c) && !isWhiteSpace(c);

  const advance = () => c = input[++i];

  const addToken = (type: TokenType, value?: any) => {
    tokens.push({
      type,
      value,
    });
  };

  while (i < input.length) {
    c = input[i];

    if (isWhiteSpace(c)) {
      advance();
    } else if (isOperator(c)) {
      addToken(c as Operator);
      advance();
    } else if (isDigit(c)) {
      let numStr = c;
      while (isDigit(advance()) && i < input.length) {
        numStr += c;
      }
      if (c === '.') {
        do {
          numStr += c;
        } while (isDigit(advance()) && i < input.length);
      }
      const num = parseFloat(numStr);
      if (!isFinite(num)) throw new TypeError('Number is too large or too small for a 64-bit double.');
      addToken('number', num);
    } else if (isIdentifier(c)) {
      let idn = c;
      while ((isIdentifier(advance()) || isDigit(c)) && i < input.length) {
        idn += c;
      }
      addToken('identifier', idn);
    } else if (isDirection(c)) {
      let dir = c;
      while (isDirection(advance()) && i < input.length) {
        dir += c;
      }
      addToken('direction', dir);
    } else {
      throw new TypeError(`Unrecognized token: "${c}"`);
    }
  }
  addToken('(end)');
  return tokens;
};

export const parse = (tokens: Token[]): ParseTreeNode[] => {
  const parseTree: ParseTreeNode[] = [];

  const symbols: { [index: string]: ParseSymbol } = {};

  const symbol = (type: TokenType, nud?: (val?: Token) => Token, lbp?: number, led?: (val?: Token) => Token) => {
    symbols[type] = {
      lbp,
      nud,
      led,
    };
  };

  const interpretToken = (token: Token): ParseNode => {
    const sym = Object.create(symbols[token.type]);
    sym.type = token.type;
    sym.value = token.value;
    return sym;
  };

  let i = 0;
  const token = () => interpretToken(tokens[i]);
  const advance = () => { i++; return token(); };

  const expression = (rbp: number): Token => {
    let left;
    let t = token();

    advance();
    if (!t.nud) {
      throw new TypeError('Unexpected token: ' + t.type);
    }
    left = t.nud(t);
    while (rbp < token().lbp) {
      t = token();
      advance();
      if (!t.led) {
        throw new TypeError('Unexpected token: ' + t.type);
      }
      left = t.led(left);
    }
    return left;
  };

  // const infix = (id: TokenType, lbp: number, rbp?: number, led?) => {
  //   rbp = rbp || lbp;
  //   if (!led) {
  //     led = (left) => {
  //       return {
  //         type: id,
  //         left,
  //         right: expression(rbp)
  //       };
  //     };
  //   }
  //   symbol(id, null, lbp, led);
  // };

  const prefix = (id: TokenType, rbp: number) => {
    symbol(id, () => {
      return {
        type: id,
        right: expression(rbp)
      };
    });
  };

  // prefix('-', 7);
  prefix('^', 5);
  prefix('*', 4);
  // infix('/', 4);
  // infix('%', 4);
  // infix('+', 3);
  // infix('-', 3);
  symbol(',');
  symbol(']');
  symbol('(end)');

  symbol('[', () => {
    const value1 = expression(2);
    if (token().type !== ',') {
      throw new TypeError(`Segments has to have two units '[ FROM, TO ]'`);
    }
    advance();
    const value2 = expression(2);
    if (token().type !== ']') {
      throw new TypeError(`Segments has to have two units '[ FROM, TO ]'`);
    }
    advance();
    return {
      type: 'segments',
      value: [ value1, value2 ],
    };
  });

  symbol('number', (nmb) => {
    return nmb;
  });

  symbol('direction', (dir) => {
    if (token().type !== '[') {
      throw new TypeError(`Direction has to be followed by segments '${dir.value} [ FROM, TO ]'`);
    }
    return dir;
  });

  // symbol('identifier', (name) => {
  //   if (token().type === '[') {
  //     const args = [];
  //     if (tokens[i + 1].type === ']') {
  //       advance();
  //     } else {
  //       do {
  //         advance();
  //         args.push(expression(2));
  //       } while (token().type === ',');
  //       if (token().type !== ']') {
  //         throw new TypeError(`Expected closing parenthesis ']'`);
  //       }
  //     }
  //     advance();
  //     return {
  //       type: 'call',
  //       args,
  //       name: name.value
  //     };
  //   }
  //   return name;
  // });

  while (token().type !== '(end)') {
    parseTree.push(expression(0));
  }

  return parseTree;
};

export const evaluate = (parseTree: ParseTreeNode[]): EvaluationResult => {
  const output: EvaluationResult = {
    segments: [],
    directions: [],
    speed: 1,
    multiplier: 1,
  };

  const directionMap: { [index: string]: Direction } = {
    '>': 'forward',
    '<': 'backwards',
  };

  const parseNode = (node: ParseTreeNode) => {
    switch (node.type) {
      case 'segments':
        output.segments.push([node.value[0].value, node.value[1].value]);  
      break;
      case 'direction':
        for (let dir of (node.value as string).split('')) {
          output.directions.push(directionMap[dir]);
        }
      break;
      case '*':
        output.multiplier = output.multiplier * (node.right.value as number);
      break;
      case '^':
        output.speed = output.speed * (node.right.value as number);
      break;
    }
  };
  
  for (let i = 0; i < parseTree.length; i++) {
    parseNode(parseTree[i]);
  }

  if (0 === output.directions.length) {
    output.directions.push('forward');
  }

  return output;
};
