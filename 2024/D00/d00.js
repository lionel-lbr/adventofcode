/*
Advent Of Code 2024
Day x: --- part 1 & 2

https://adventofcode.com/2024/day/x
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2024';
const DAY = '0x';

function elapsedTime(name, fct, input) {
  const startTime = performance.now();
  const result = fct(input);
  const elapsed = performance.now() - startTime;
  console.log(
    `${name} time: ${Math.floor(elapsed / 60000)}:${Math.floor((elapsed % 60000) / 1000)}:${Math.floor(elapsed % 1000)}`
  );
  console.log(`${name} result: ${result}`);
}

function readInput(filename) {
  const readRawInput = () => {
    const data = fs.readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename));
    const input = data
      .toString()
      .split('\n')
      .filter((l) => l.length > 0)
      .map((l) => l);
    return input;
  };
  try {
    return readRawInput();
  } catch (err) {
    console.error(err);
  }
}

function part1(input) {}

function part2(input) {}

//const input = readInput(`d${DAY}-sample.txt`);
const input = readInput(`d${DAY}-input.txt`);
elapsedTime('Part 1', part1, input);
elapsedTime('Part 2', part2, input);
