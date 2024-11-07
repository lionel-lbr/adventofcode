/*
Advent Of Code 2023
Day 09: Mirage Maintenance part 1 & 2

https://adventofcode.com/2023/day/9
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2023';
const DAY = '09';

function readInput(filename) {
  const readRawInput = () => {
    const data = fs.readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename));
    const input = data
      .toString()
      .split('\n')
      .filter((l) => l != '')
      .map((l) => l.split(' ').map((e) => parseInt(e)));

    return input;
  };

  const parseALine = (line) => {};

  try {
    return readRawInput();
  } catch (err) {
    console.error(err);
  }
}

function part1(input, part1 = true) {
  const result = input.reduce((_r, line) => {
    const interpolations = [[...line]];
    let lastInterpolation = interpolations[interpolations.length - 1];
    while (!lastInterpolation.every((e) => e === 0)) {
      const nextInterpolation = [];
      for (let i = 1; i < lastInterpolation.length; i++) {
        nextInterpolation.push(lastInterpolation[i] - lastInterpolation[i - 1]);
      }
      interpolations.push(nextInterpolation);
      lastInterpolation = nextInterpolation;
    }

    // first interpolation is all 0 now
    interpolations.reverse();
    const lastValue = interpolations.reduce((lastValue, interpolation) => {
      //  part1: X + l[-1] = oldX
      //  part2: l[0] - X = oldX
      const newLastValue = part1 ? lastValue + interpolation[interpolation.length - 1] : interpolation[0] - lastValue;
      return newLastValue;
    }, 0);

    return _r + lastValue;
  }, 0);

  return result;
}

//const input = readInput(`d${DAY}-sample.txt`);
const input = readInput(`d${DAY}-input.txt`);
console.log(`Part 1: ${part1(input)}`);
console.log(`Part 2: ${part1(input, false)}`);
