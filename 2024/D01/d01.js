/*
Advent Of Code 2024
Day 1: Historian Hysteria part 1 & 2

https://adventofcode.com/2024/day/1
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2024';
const DAY = '01';

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
      .map((l) => l.split('   ').map((v) => parseInt(v)));
    return input;
  };
  try {
    return readRawInput();
  } catch (err) {
    console.error(err);
  }
}

function part1(input) {
  // reduce the input in 2 arrays of int
  const [arr1, arr2] = input.reduce(
    (arr, v) => {
      arr[0].push(v[0]);
      arr[1].push(v[1]);
      return arr;
    },
    [[], []]
  );

  // sort them
  arr1.sort();
  arr2.sort();

  // reduce arr1 and calculate distance
  const result = arr1.reduce((r, v, index) => r + Math.abs(v - arr2[index]), 0);
  return result;
}

function part2(input) {
  // reduce the input in 2 arrays of int
  const [arr1, arr2] = input.reduce(
    (arr, v) => {
      arr[0].push(v[0]);
      arr[1].push(v[1]);
      return arr;
    },
    [[], []]
  );

  // reduce arr1 and check number of occurrence in arr2
  const result = arr1.reduce((r, v) => r + v * arr2.filter((e) => e === v).length, 0);
  return result;
}

//const input = readInput(`d${DAY}-sample.txt`);
const input = readInput(`d${DAY}-input.txt`);
elapsedTime('Part 1', part1, input);
elapsedTime('Part 2', part2, input);
