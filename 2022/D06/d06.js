/*
Advent Of Code 2022
Day 6: Tuning Trouble part 1 & 2

https://adventofcode.com/2022/day/6
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2022';
const DAY = '06';

function readInput(filename) {
  return fs
    .readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename))
    .toString()
    .trim()
    .split('');
}

function solve(message, packetSize) {
  const index = message.findIndex((_, i) => [...new Set(message.slice(i, i + packetSize))].length === packetSize);
  return index + packetSize;
}

const input = readInput(`d${DAY}-input.txt`);
console.log(`Part 1: ${solve(input, 4)}`);
console.log(`Part 2: ${solve(input, 14)}`);
