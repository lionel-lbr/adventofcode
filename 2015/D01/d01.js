/*
Advent Of Code 2015
Day 1: Not Quite Lisp part 1 & 2

https://adventofcode.com/2015/day/1
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2015';
const DAY = '01';

function readInput(filename) {
  const readRawIntput = () => {
    const data = fs.readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename));
    return data.toString();
  };

  const parseALine = (line) => {};

  try {
    return readRawIntput();
  } catch (err) {
    console.error(err);
  }
}

function part1(input) {
  function findFinalFloor(instructions) {
    let floor = 0;

    for (let i = 0; i < instructions.length; i++) {
      if (instructions[i] === '(') {
        floor += 1;
      } else if (instructions[i] === ')') {
        floor -= 1;
      }

      if (floor === -1) {
        // Return the current instruction index (adding 1 for 1-based counting)
        return i + 1;
      }
    }

    return floor;
  }
  const result = findFinalFloor(input);
  return result;
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
