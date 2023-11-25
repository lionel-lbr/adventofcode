/*
Advent Of Code 2015
Day 2: I Was Told There Would Be No Math part 1 & 2

https://adventofcode.com/2015/day/2
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2015';
const DAY = '02';

function readInput(filename) {
  const readRawIntput = () => {
    const data = fs.readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename));
    const input = data.toString();
    return input.split('\n').map((box) => {
      const [l, w, h] = box.split('x');
      return {
        l: parseInt(l),
        w: parseInt(w),
        h: parseInt(h),
      };
    });
  };

  const parseALine = (line) => {};

  try {
    return readRawIntput();
  } catch (err) {
    console.error(err);
  }
}

function part1(input) {
  const result = input.reduce((r, { l, w, h }) => {
    const s1 = l * w;
    const s2 = w * h;
    const s3 = h * l;
    return r + 2 * s1 + 2 * s2 + 2 * s3 + Math.min(s1, s2, s3);
  }, 0);
  return result;
}

function part2(input) {
  const result = input.reduce((r, { l, w, h }) => {
    const [d1, d2, _] = [l, w, h].sort((a, b) => a - b);
    const l1 = 2 * d1 + 2 * d2;
    const l2 = l * w * h;

    return r + l1 + l2;
  }, 0);
  return result;
}

const input = readInput(`d${DAY}-input.txt`);
console.log(`Part 1: ${part1(input)}`);
console.log(`Part 2: ${part2(input)}`);
