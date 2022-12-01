/*
Advent Of Code 2022
Day 1: Calorie Counting part 1 & 2

https://adventofcode.com/2022/day/1
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2022';
const DAY = '01';

function readInput(filename) {
  const readRawIntput = () => {
    const data = fs.readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename));
    const lines = data.toString().split(`\n`);
    return lines;
  };

  const parseALine = (line) => {};

  try {
    const lines = readRawIntput();
    const r = lines.map((l) => (l ? Number(l) : ''));
    return r;
  } catch (err) {
    console.error(err);
  }
}

function part1(input) {
  const { max } = input.reduce(
    ({ max, sum }, n) => (Number.isInteger(n) ? { max, sum: sum + n } : { max: Math.max(max, sum), sum: 0 }),
    { max: 0, sum: 0 }
  );
  return max;
}

function part2(input) {
  const { maxThree } = input.reduce(
    ({ maxThree, sum }, n) => {
      if (Number.isInteger(n)) return { maxThree, sum: sum + n };

      if (sum > maxThree[2]) {
        maxThree.push(sum);
        maxThree.sort((a, b) => b - a);
        maxThree.pop();
      }
      return { maxThree, sum: 0 };
    },
    { maxThree: [0, 0, 0], sum: 0 }
  );
  return maxThree.reduce((sum, n) => sum + n, 0);
}

const input = readInput(`d${DAY}-input.txt`);
console.log(`Part 1: ${part1(input)}`);
console.log(`Part 2: ${part2(input)}`);
