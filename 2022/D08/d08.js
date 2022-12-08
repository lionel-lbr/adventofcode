/*
Advent Of Code 2022
Day 8: xx part 1 & 2

https://adventofcode.com/2022/day/8
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2022';
const DAY = '08';

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
    return lines.map((t) => t.split('').map((n) => Number(n)));
  } catch (err) {
    console.error(err);
  }
}

function part1(input) {
  const mapLength = input.length;
  const trees = new Set();

  const addTree = ({ x, y }) => {
    trees.add(`x:${x}-y:${y}-t:${input[y][x]}`);
  };

  for (let y = 0; y < mapLength; y += 1) {
    let localHigh = input[y][0];
    let localHighPos = { x: 0, y };
    addTree(localHighPos);
    for (let x = 0; x < mapLength; x += 1) {
      if (input[y][x] > localHigh) {
        localHigh = input[y][x];
        localHighPos = { x, y };
        addTree(localHighPos);
      }
    }
  }

  for (let y = 0; y < mapLength; y += 1) {
    let localHigh = input[y][mapLength - 1];
    let localHighPos = { x: mapLength - 1, y };
    addTree(localHighPos);
    for (let x = mapLength - 1; x > 0; x -= 1) {
      if (input[y][x] > localHigh) {
        localHigh = input[y][x];
        localHighPos = { x, y };
        addTree(localHighPos);
      }
    }
  }

  for (let x = 0; x < mapLength; x++) {
    let localHigh = input[0][x];
    let localHighPos = { x, y: 0 };
    addTree(localHighPos);
    for (let y = 0; y < mapLength; y++) {
      if (input[y][x] > localHigh) {
        localHigh = input[y][x];
        localHighPos = { x, y };
        addTree(localHighPos);
      }
    }
  }

  for (let x = 0; x < mapLength; x++) {
    let localHigh = input[mapLength - 1][x];
    let localHighPos = { x, y: mapLength - 1 };
    addTree(localHighPos);
    for (let y = mapLength - 1; y > 0; y -= 1) {
      if (input[y][x] > localHigh) {
        localHigh = input[y][x];
        localHighPos = { x, y };
        addTree(localHighPos);
      }
    }
  }

  return trees.size;
}

function part2(input) {
  const mapLength = input.length;
  let score = 0;
  const scenicScore = (x, y, tree = false) => {
    if (tree === false) tree = input[y][x];
    else {
      if (x === 0 || x === mapLength - 1 || y === 0 || y === mapLength - 1 || input[y][x] >= tree) return false;
      return true;
    }

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
