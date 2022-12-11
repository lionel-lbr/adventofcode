/*
Advent Of Code 2022
Day 15: xx part 1 & 2

https://adventofcode.com/2022/day/15
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2022';
const DAY = '15';

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
    return lines;
  } catch (err) {
    console.error(err);
  }
}

function part1(input) {
  return 0;
}

function part2(input) {
  return 0;
}

//const input = readInput(`d${DAY}-sample.txt`);
const input = readInput(`d${DAY}-input.txt`);
console.log(`Part 1: ${part1(input)}`);
console.log(`Part 2: ${part2(input)}`);
