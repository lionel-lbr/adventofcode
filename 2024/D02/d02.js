/*
Advent Of Code 2024
Day 2: --- part 1 & 2

https://adventofcode.com/2024/day/2
*/

const fs = require('fs');
const path = require('path');
const { report } = require('process');

const YEAR = '2024';
const DAY = '02';

function elapsedTime(name, fct, input) {
  const startTime = performance.now();
  const result = fct(input);
  const elapsed = performance.now() - startTime;
  console.log(`${name} time: ${Math.floor(elapsed / 60000)}:${Math.floor((elapsed % 60000) / 1000)}:${Math.floor(elapsed % 1000)}`);
  console.log(`${name} result: ${result}`);
}

function readInput(filename) {
  const readRawInput = () => {
    const data = fs.readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename));
    const input = data
      .toString()
      .split('\n')
      .filter((l) => l.length > 0)
      .map((l) => l.split(' ').map((v) => parseInt(v)));
    return input;
  };
  try {
    return readRawInput();
  } catch (err) {
    console.error(err);
  }
}

const isSafe = (levels) => {
  let last = levels[0];
  let incOrDec = '';
  for (l of levels.slice(1)) {
    if (l > last) {
      if (l - last > 3) return false; // not different by more than 3
      if (incOrDec === '') incOrDec = 'inc';
      if (incOrDec !== 'inc') return false; // always increasing
      last = l;
      continue;
    }

    if (l < last) {
      if (last - l > 3) return false; // not different by more than 3
      if (incOrDec === '') incOrDec = 'dec';
      if (incOrDec !== 'dec') return false; // always decreasing
      last = l;
      continue;
    }

    // 2 values are equal ...
    return false;
  }
  return true;
};

function part1(input) {
  const result = input.reduce((_result, report) => (_result += isSafe(report) ? 1 : 0), 0);
  return result;
}

function part2(input) {
  const result = input.reduce((_result, report, index) => {
    // try the array as it is
    if (isSafe(report)) return _result + 1;

    // brut force, try every combination of the array until found one safe
    let i = 0;
    while (i < report.length && !isSafe(report.toSpliced(i, 1))) i++;
    if (i === report.length) return _result;

    return _result + 1;
  }, 0);
  return result;
}

//const input = readInput(`d${DAY}-sample.txt`);
const input = readInput(`d${DAY}-input.txt`);
elapsedTime('Part 1', part1, input);
elapsedTime('Part 2', part2, input);
