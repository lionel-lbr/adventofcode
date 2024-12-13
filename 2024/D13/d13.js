/*
Advent Of Code 2024
Day 13: Claw Contraption part 1 & 2

https://adventofcode.com/2024/day/13
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2024';
const DAY = '13';

function elapsedTime(name, fct, input) {
  const startTime = performance.now();
  const { result } = fct(input);
  const elapsed = performance.now() - startTime;
  console.log(`${name} time: ${Math.floor(elapsed / 60000)}:${Math.floor((elapsed % 60000) / 1000)}:${Math.floor(elapsed % 1000)}`);
  console.log(`${name} result: ${result}`);
}

function readInput(filename) {
  const readRawInput = () => {
    const data = fs.readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename));
    const input = [];
    const lines = data.toString().split('\n');
    let p = {};
    for (l of lines) {
      if (l.length === 0) {
        if (p.A) input.push(p);
        p = {};
      }
      if (l.startsWith('Button A')) {
        const [x, y] = l
          .split(':')[1]
          .split(',')
          .map((v) => parseInt(v.split('+')[1]));
        p.A = { x, y };
        continue;
      }
      if (l.startsWith('Button B')) {
        const [x, y] = l
          .split(':')[1]
          .split(',')
          .map((v) => parseInt(v.split('+')[1]));
        p.B = { x, y };
        continue;
      }
      if (l.startsWith('Prize')) {
        const [x, y] = l
          .split(':')[1]
          .split(',')
          .map((v) => parseInt(v.split('=')[1]));
        p.P = { x, y };
        continue;
      }
    }
    return input;
  };
  try {
    return readRawInput();
  } catch (err) {
    console.error(err);
  }
}

function part1(input) {
  let cost = 0;
  for (const { A, B, P } of input) {
    // calculate determinant
    const deter = A.x * B.y - A.y * B.x;
    if (deter === 0) continue;

    //         By  -Bx           Px
    // Matrix:          * Vector
    //         -Ay   Ax          Py
    const op1 = B.y * P.x - B.x * P.y;
    const op2 = -A.y * P.x + A.x * P.y;
    if (op1 % deter !== 0 || op2 % deter !== 0) continue;

    const n = (B.y * P.x - B.x * P.y) / deter;
    const m = (-A.y * P.x + A.x * P.y) / deter;
    cost += n * 3 + m;
  }
  let result = cost;
  return { result };
}

function part2(input) {
  for (const i of input) {
    i.P.x += 10_000_000_000_000;
    i.P.y += 10_000_000_000_000;
  }
  const { result } = part1(input);
  return { result };
}

//const input = readInput(`d${DAY}-sample.txt`);
const input = readInput(`d${DAY}-input.txt`);
elapsedTime('Part 1', part1, input);
elapsedTime('Part 2', part2, input);
