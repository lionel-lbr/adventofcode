/*
Advent Of Code 2022
Day 13: Distress Signal part 1 & 2

https://adventofcode.com/2022/day/13
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2022';
const DAY = '13';

function readInput(filename) {
  return fs
    .readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename))
    .toString()
    .split(`\n`)
    .filter((l) => l)
    .reduce((result, l, index) => {
      if (index % 2 === 0) result.push([eval(l)]);
      else result[result.length - 1].push(eval(l));
      return result;
    }, []);
}

const compare = (left, right) => {
  let i = 0;
  while (1) {
    if (i === left.length && i === right.length) return 0;
    if (i >= left.length) return 1;
    if (i >= right.length) return -1;

    const leftV = left[i];
    const rightV = right[i];
    if (Number.isInteger(leftV) && Number.isInteger(rightV)) {
      if (leftV < rightV) return 1;
      if (leftV > rightV) return -1;
      i += 1;
      continue;
    }

    if (Number.isInteger(leftV)) {
      const r = compare([leftV], rightV);
      if (r !== 0) return r;
      i += 1;
      continue;
    }

    if (Number.isInteger(rightV)) {
      const r = compare(leftV, [rightV]);
      if (r !== 0) return r;
      i += 1;
      continue;
    }

    const r = compare(leftV, rightV);
    if (r !== 0) return r;
    i += 1;
  }
};

function part1(input) {
  const result = input.reduce((result, [left, right], index) => {
    if (compare(left, right) === 1) result.push(index + 1);
    return result;
  }, []);

  return result.reduce((sum, i) => sum + i);
}

function part2(input) {
  const dk1 = [[2]];
  const dk2 = [[6]];

  input.push([dk1, dk2]);
  // sort ascending order ...
  const result = input.flat().sort((left, right) => compare(right, left));
  const index1 = result.findIndex((l) => compare(l, dk1) === 0) + 1;
  const index2 = result.findIndex((l) => compare(l, dk2) === 0) + 1;
  return index1 * index2;
}

//const input = readInput(`d${DAY}-sample.txt`);
const input = readInput(`d${DAY}-input.txt`);
console.log(`Part 1: ${part1(input)}`);
console.log(`Part 2: ${part2(input)}`);
