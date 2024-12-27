/*
Advent Of Code 2024
Day 25: Code Chronicle part 1 & 2

https://adventofcode.com/2024/day/25
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2024';
const DAY = '25';

function readInput(filename) {
  const readRawInput = () => {
    const data = fs.readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename));
    const input = data
      .toString()
      .split('\n')
      .filter((l) => l.length > 0)
      .map((l) => l.split(''));
    return input;
  };
  try {
    return readRawInput();
  } catch (err) {
    console.error(err);
  }
}

const drawMap = (map, filePath = null) => {
  let output = '';
  let index = 0;
  for (const row of map) {
    const line = `${index}`.padStart(3, '0') + ' ' + row.join('');
    output += line + '\n';
    index++;
  }

  if (filePath) {
    fs.writeFileSync(path.join(`${YEAR}`, `D${DAY}`, filePath), output, 'utf8');
  } else {
    console.log(output);
  }
};

const getKeysAndLocks = (input) => {
  const keys = [];
  const locks = [];

  let pattern = [];
  index = 0;
  while (true) {
    if (index % 7 === 0 && pattern.length > 0) {
      const heights = pattern.reduce((height, row) => {
        row.forEach((c, index) => (c === '#' ? height[index]++ : ''));
        return height;
      }, new Array(pattern[0].length).fill(-1));

      if (pattern[0].every((s) => s === '#')) locks.push(heights);
      else keys.push(heights);
      pattern = [];
    }

    if (index === input.length) break;
    pattern.push(input[index]);
    index++;
  }

  return { locks, keys };
};
function solution1(input, width, height) {
  const { locks, keys } = getKeysAndLocks(input);
  // for each lock try each key
  let matches = 0;
  for (const lock of locks) {
    for (const key of keys) {
      if (key.every((h, index) => h + lock[index] < 6)) matches++;
    }
  }
  let result = matches;
  return result;
}

function solution2(input, width, height) {
  let result = 0;
  return result;
}

function part1(mode) {
  const input = readInput(`d${DAY}-${mode}.txt`);
  const width = input[0].length;
  const height = input.length;
  const startTime = performance.now();
  const result = solution1(input, width, height);
  const elapsed = performance.now() - startTime;
  console.log(`Part 1 ${mode} time: ${Math.floor(elapsed / 60000)}:${Math.floor((elapsed % 60000) / 1000)}:${Math.floor(elapsed % 1000)}`);
  console.log(`Part 1 ${mode} result: ${result}`);
}

function part2(mode) {
  const input = readInput(`d${DAY}-${mode}.txt`);
  const width = input[0].length;
  const height = input.length;
  const startTime = performance.now();
  const result = solution2(input, width, height);
  const elapsed = performance.now() - startTime;
  console.log(`Part 2 ${mode} time: ${Math.floor(elapsed / 60000)}:${Math.floor((elapsed % 60000) / 1000)}:${Math.floor(elapsed % 1000)}`);
  console.log(`Part 2 ${mode} result: ${result}`);
}

part1('sample');
part1('input');
part2('sample');
part2('input');
