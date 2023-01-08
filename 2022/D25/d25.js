/*
Advent Of Code 2022
Day 25: Full of Hot Air part 1 & 2

https://adventofcode.com/2022/day/25
*/

const { assert } = require('console');
const fs = require('fs');
const path = require('path');

const YEAR = '2022';
const DAY = '25';

function readInput(filename) {
  return fs
    .readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename))
    .toString()
    .split(`\n`)
    .filter((l) => l);
}

const SNAFU = {
  2: 2,
  1: 1,
  0: 0,
  '-': -1,
  '=': -2,
};

function snafu2int(snafu) {
  return [...[...snafu].reverse()].reduce((r, c, index) => {
    const p = Math.pow(5, index);
    r += SNAFU[c] * p;
    return r;
  }, 0);
}

function int2snafu(value) {
  let p = 0;
  while (value / Math.pow(5, p) >= 1) p += 1;

  result = [];
  const calculate = (val, pow) => {
    if (Math.abs(val / 5 ** pow) >= 3) return false;

    for (let i = 0; Math.abs(i) < 3; i += val > 0 ? 1 : -1) {
      if ((pow > 0 && calculate(val - 5 ** pow * i, pow - 1)) || (pow === 0 && val - 5 ** pow * i === 0)) {
        result.push(i);
        return true;
      }
    }
    return false;
  };

  calculate(value, p);
  // remove left side 0s
  while (result[result.length - 1] === 0) result.pop();
  const snafu = result.reduce((s, i) => (i === -1 ? `-${s}` : i === -2 ? `=${s}` : `${i}${s}`), '');
  return snafu;
}

testSnafuInt = [
  { i: 1, snafu: '1' },
  { i: 2, snafu: '2' },
  { i: 3, snafu: '1=' },
  { i: 4, snafu: '1-' },
  { i: 5, snafu: '10' },
  { i: 6, snafu: '11' },
  { i: 7, snafu: '12' },
  { i: 8, snafu: '2=' },
  { i: 9, snafu: '2-' },
  { i: 10, snafu: '20' },
  { i: 15, snafu: '1=0' },
  { i: 20, snafu: '1-0' },
  { i: 2022, snafu: '1=11-2' },
  { i: 12345, snafu: '1-0---0' },
  { i: 1747, snafu: '1=-0-2' },
  { i: 906, snafu: '12111' },
  { i: 198, snafu: '2=0=' },
  { i: 11, snafu: '21' },
  { i: 201, snafu: '2=01' },
  { i: 31, snafu: '111' },
  { i: 1257, snafu: '20012' },
  { i: 32, snafu: '112' },
  { i: 353, snafu: '1=-1=' },
  { i: 107, snafu: '1-12' },
  { i: 7, snafu: '12' },
  { i: 3, snafu: '1=' },
  { i: 37, snafu: '122' },
  { i: 314_159_265, snafu: '1121-1110-1=0' },
];

function part1(input) {
  testSnafuInt.forEach(({ i, snafu }) => {
    console.log(`check int2snafu for ${i} ${snafu}`);
    assert(int2snafu(i) === snafu);
    console.log(`check snafu2int for ${snafu} ${i}`);
    assert(snafu2int(snafu) === i);
  });

  const result = input.reduce((sum, snafu) => sum + snafu2int(snafu), 0);
  console.log(`result: ${result}`);
  const snafu = int2snafu(result);
  return snafu;
}

function part2(input) {
  return 0;
}

//const input = readInput(`d${DAY}-sample.txt`);
const input = readInput(`d${DAY}-input.txt`);
console.log(`Part 1: ${part1(input)}`);
console.log(`Part 2: ${part2(input)}`);
