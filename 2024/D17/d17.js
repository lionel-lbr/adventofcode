/*
Advent Of Code 2024
Day 17: Chronospatial Computer part 1 & 2

https://adventofcode.com/2024/day/17
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2024';
const DAY = '17';

function readInput(filename) {
  const readRawInput = () => {
    const data = fs.readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename));
    const lines = data.toString().split('\n');

    let readProgram = false;
    let program;
    let registers = { A: 0, B: 0, C: 0 };
    for (const l of lines) {
      if (l.length === 0) {
        readProgram = true;
        continue;
      }
      if (readProgram) {
        program = l
          .split(': ')[1]
          .split(',')
          .map((v) => parseInt(v));
        continue;
      }

      if (l.startsWith('Register A')) registers.A = parseInt(l.split(': ')[1]);
      if (l.startsWith('Register B')) registers.B = parseInt(l.split(': ')[1]);
      if (l.startsWith('Register C')) registers.C = parseInt(l.split(': ')[1]);
    }
    return { registers, program };
  };
  try {
    return readRawInput();
  } catch (err) {
    console.error(err);
  }
}

const REG_A = 4;
const REG_B = 5;
const REG_C = 6;
const COMBO_OP = [0, 1, 2, 3, 0, 0, 0];
const output = [];
const OP_CODES = [
  (op, ip) => {
    // ADV
    const numerator = COMBO_OP[REG_A];
    const denominator = Math.pow(2, COMBO_OP[op]);
    COMBO_OP[REG_A] = Math.floor(numerator / denominator);
    ip += 2;
    return ip;
  },
  (op, ip) => {
    // BXL  B xor OP
    COMBO_OP[REG_B] = Number(BigInt(COMBO_OP[REG_B]) ^ BigInt(op));
    ip += 2;
    return ip;
  },
  (op, ip) => {
    // BST  B % 8
    COMBO_OP[REG_B] = COMBO_OP[op] % 8;
    ip += 2;
    return ip;
  },
  (op, ip) => {
    // JNZ
    if (COMBO_OP[REG_A] === 0) {
      ip += 2;
      return ip;
    }
    ip = op;
    return ip;
  },
  (op, ip) => {
    // BXC  B xor C
    COMBO_OP[REG_B] = Number(BigInt(COMBO_OP[REG_B]) ^ BigInt(COMBO_OP[REG_C]));
    ip += 2;
    return ip;
  },
  (op, ip) => {
    // OUT
    const v = COMBO_OP[op] % 8;
    output.push(v);
    ip += 2;
    return ip;
  },
  (op, ip) => {
    // bdv  B = A div 2** combo op
    const numerator = COMBO_OP[REG_A];
    const denominator = Math.pow(2, COMBO_OP[op]);
    COMBO_OP[REG_B] = Math.floor(numerator / denominator);
    ip += 2;
    return ip;
  },
  (op, ip) => {
    // cdv  C = A div 2** combo op
    const numerator = COMBO_OP[REG_A];
    const denominator = Math.pow(2, COMBO_OP[op]);
    COMBO_OP[REG_C] = Math.floor(numerator / denominator);
    ip += 2;
    return ip;
  },
];

function solution1(input) {
  const { program, registers } = input;
  COMBO_OP[REG_A] = registers.A;
  COMBO_OP[REG_B] = registers.B;
  COMBO_OP[REG_C] = registers.C;
  let ip = 0;
  output.length = 0;
  while (ip < program.length) {
    const opcode = program[ip];
    const op = program[ip + 1];
    ip = OP_CODES[opcode](op, ip);
  }
  return output;
}

function solution2(input) {
  const { program } = input;

  const DFS = () => {
    const recurse = (currentRegA, level) => {
      if (level < 0) return currentRegA / 8;

      for (let v = 0; v < 8; v++) {
        const regA = Number(BigInt(currentRegA) | BigInt(v));
        const output = solution1({ program, registers: { A: regA, B: 0, C: 0 } });
        if (program.slice(level, program.length).every((v, index) => v === output[index])) {
          const result = recurse(regA * 8, level - 1);
          if (result > -1) return result;
        }
      }
      return -1;
    };

    return recurse(0, program.length - 1);
  };

  let result = DFS();
  return result;
}

function part1(mode) {
  const input = readInput(`d${DAY}-${mode}.txt`);
  const startTime = performance.now();
  const result = solution1(input);
  const elapsed = performance.now() - startTime;
  console.log(`Part 1 ${mode} time: ${Math.floor(elapsed / 60000)}:${Math.floor((elapsed % 60000) / 1000)}:${Math.floor(elapsed % 1000)}`);
  console.log(`Part 1 ${mode} result: ${result}`);
}

function part2(mode) {
  const input = readInput(`d${DAY}-${mode}.txt`);
  const startTime = performance.now();
  const result = solution2(input);
  const elapsed = performance.now() - startTime;
  console.log(`Part 2 ${mode} time: ${Math.floor(elapsed / 60000)}:${Math.floor((elapsed % 60000) / 1000)}:${Math.floor(elapsed % 1000)}`);
  console.log(`Part 2 ${mode} result: ${result}`);
}

part1('sample');
part1('input');

part2('sample2');
part2('input');
