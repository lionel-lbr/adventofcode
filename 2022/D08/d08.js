/*
Advent Of Code 2022
Day 8: Treetop Tree House part 1 & 2

https://adventofcode.com/2022/day/8
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2022';
const DAY = '08';

function readInput(filename) {
  return fs
    .readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename))
    .toString()
    .split(`\n`)
    .filter((l) => l)
    .map((t) => t.split('').map((n) => Number(n)));
}

function part1(input) {
  const checkMax = (maxArr, t, x, y) => {
    const maxPos = maxArr[maxArr.length - 1];
    if (t > input[maxPos.y][maxPos.x]) maxArr.push({ x, y });
    return maxArr;
  };

  // parse left to right
  const ltr = input.reduce(
    (max, row, y) => row.reduce((max, t, x) => checkMax(max, t, x, y), [...max, { x: 0, y }]),
    []
  );

  // parse right to left
  const rtl = input.reduce(
    (max, row, y) => row.reduceRight((max, t, x) => checkMax(max, t, x, y), [...max, { x: row.length - 1, y }]),
    []
  );

  // top to bottom
  const ttb = input.reduce(
    (max, _, x) => input.reduce((max, row, y) => checkMax(max, row[x], x, y), [...max, { x, y: 0 }]),
    []
  );

  // bottom to top
  const btt = input.reduce(
    (max, _, x) =>
      input.reduceRight((max, row, y) => checkMax(max, row[x], x, y), [...max, { x, y: input.length - 1 }]),
    []
  );

  const trees = new Set([
    ...ltr.map(({ x, y }) => `x:${x} y:${y}`),
    ...rtl.map(({ x, y }) => `x:${x} y:${y}`),
    ...ttb.map(({ x, y }) => `x:${x} y:${y}`),
    ...btt.map(({ x, y }) => `x:${x} y:${y}`),
  ]);

  return trees.size;
}

function part2(input) {
  const mapLength = input.length;

  const scenicScore = (x, y, tree = false) => {
    if (tree === false) tree = input[y][x];
    else {
      if (x === 0 || x === mapLength - 1 || y === 0 || y === mapLength - 1 || input[y][x] >= tree) return false;
      return true;
    }

    // recurse in 4 directions
    let up = 1;
    while (scenicScore(x, y - up, tree)) up += 1;
    let right = 1;
    while (scenicScore(x + right, y, tree)) right += 1;
    let down = 1;
    while (scenicScore(x, y + down, tree)) down += 1;
    let left = 1;
    while (scenicScore(x - left, y, tree)) left += 1;

    return up * right * down * left;
  };

  let score = 0;
  for (let y = 1; y < mapLength - 1; y++) {
    for (let x = 1; x < mapLength - 1; x++) {
      score = Math.max(score, scenicScore(x, y));
    }
  }
  return score;
}

//const input = readInput(`d${DAY}-sample.txt`);
const input = readInput(`d${DAY}-input.txt`);
console.log(`Part 1: ${part1(input)}`);
console.log(`Part 2: ${part2(input)}`);
