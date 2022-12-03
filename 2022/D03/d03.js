/*
Advent Of Code 2022
Day 3: Rucksack Reorganization part 1 & 2

https://adventofcode.com/2022/day/3
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2022';
const DAY = '03';

function readInput(filename) {
  const readRawIntput = () => {
    const data = fs.readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename));
    const lines = data
      .toString()
      .split(`\n`)
      .filter((l) => l);

    return lines;
  };

  const parseALine = (line) => {};

  try {
    const lines = readRawIntput();
    return lines.map((l) => l.split(''));
  } catch (err) {
    console.error(err);
  }
}

const ASCII = ' abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function part1(input) {
  const result = input.reduce((s, r) => {
    const s1 = new Set(r.slice(0, Math.floor(r.length / 2)));
    const s2 = new Set(r.slice(Math.floor(r.length / 2)));

    const v = [...s1].filter((c) => s2.has(c)).pop();
    return s + ASCII.findIndex((c) => c === v);
  }, 0);

  return result;
}

function part2(input) {
  let result = 0;
  for (let i = 0; i < input.length; i += 3) {
    const s1 = new Set(input[i]);
    const s2 = new Set(input[i + 1]);
    const s3 = new Set(input[i + 2]);

    const v = [...s1].filter((c) => s2.has(c) && s3.has(c)).pop();
    result += ASCII.findIndex((c) => c === v);
  }

  return result;
}

//const input = readInput(`d${DAY}-sample.txt`);
const input = readInput(`d${DAY}-input.txt`);
console.log(`Part 1: ${part1(input)}`);
console.log(`Part 2: ${part2(input)}`);
