/*
Advent Of Code 2024
Day 3: Mull It Over part 1 & 2

https://adventofcode.com/2024/day/3
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2024';
const DAY = '03';

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
    const input = data.toString();
    return input;
  };
  try {
    return readRawInput();
  } catch (err) {
    console.error(err);
  }
}

function part1(input) {
  // use a regex to fin the mul(1 to 3 digit, 1 to 3 digit)
  const pattern = /mul\((\d{1,3}),\s*(\d{1,3})\)/g;

  const matches = [];
  let match;
  while ((match = pattern.exec(input)) !== null) {
    matches.push([parseInt(match[1]), parseInt(match[2])]);
  }

  const result = matches.reduce((r, v) => (r += v[0] * v[1]), 0);
  return result;
}

function part2(input) {
  let remainingText = input;
  let filteredText = '';
  // identify segment between don't() and do()
  while ((startIndex = remainingText.indexOf("don't()")) !== -1) {
    filteredText += remainingText.slice(0, startIndex);

    // Find the end of this "don't()" segment if any
    const endIndex = remainingText.indexOf('do()', startIndex);
    if (endIndex === -1)
      // no more do, stop here and skip the rest
      break;

    remainingText = remainingText.slice(endIndex + 'do()'.length);
  }
  // then apply regex of the part 1
  return part1(filteredText);
}

//const input = readInput(`d${DAY}-sample.txt`);
const input = readInput(`d${DAY}-input.txt`);
elapsedTime('Part 1', part1, input);
elapsedTime('Part 2', part2, input);
