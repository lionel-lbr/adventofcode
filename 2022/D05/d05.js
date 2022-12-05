/*
Advent Of Code 2022
Day 5: Supply Stacks part 1 & 2

https://adventofcode.com/2022/day/5
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2022';
const DAY = '05';

function readInput(filename) {
  return fs
    .readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename))
    .toString()
    .split(`\n`)
    .filter((l) => l)
    .map((l) =>
      l
        .split(' ')
        .filter((c) => c >= '0' && c <= '9')
        .map((c) => Number(c))
    );
}

const INITIAL_CRATE = [
  'FHBVRQDP'.split(''),
  'LDZQWV'.split(''),
  'HLZQGRPC'.split(''),
  'RDHFJVB'.split(''),
  'ZWLC'.split(''),
  'JRPNTGVM'.split(''),
  'JRLVMBS'.split(''),
  'DPJ'.split(''),
  'DCNWV'.split(''),
];

function part1(input) {
  const crate = INITIAL_CRATE.map((p) => [...p]);
  input.forEach((move) => {
    const [count, from, to] = move;
    crate[to - 1].push(...crate[from - 1].splice(crate[from - 1].length - count, count).reverse());
  });

  return crate.map((c) => c.pop()).join('');
}

function part2(input) {
  const crate = INITIAL_CRATE.map((p) => [...p]);
  input.forEach((move) => {
    const [count, from, to] = move;
    crate[to - 1].push(...crate[from - 1].splice(crate[from - 1].length - count, count));
  });

  return crate.map((c) => c.pop()).join('');
}

const input = readInput(`d${DAY}-input.txt`);
console.log(`Part 1: ${part1(input)}`);
console.log(`Part 2: ${part2(input)}`);
