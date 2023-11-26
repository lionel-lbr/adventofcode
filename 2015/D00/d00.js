/*
Advent Of Code 2015
Day x: --- part 1 & 2

https://adventofcode.com/2015/day/x
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2015';
const DAY = '0x';

function readInput(filename) {
  const readRawIntput = () => {
    const data = fs.readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename));
    const input = data.toString();
    return input;
  };

  const parseALine = (line) => {};

  try {
    return readRawIntput();
  } catch (err) {
    console.error(err);
  }
}

function part1(input) {}

function part2(input) {}

const input = readInput(`d${DAY}-input.txt`);
console.log(`Part 1: ${part1(input)}`);
console.log(`Part 2: ${part2(input)}`);
