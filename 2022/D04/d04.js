/*
Advent Of Code 2022
Day 4: Camp Cleanup part 1 & 2

https://adventofcode.com/2022/day/4
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2022';
const DAY = '04';

const readInput = (filename) =>
  fs
    .readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename))
    .toString()
    .split(`\n`)
    .filter((l) => l)
    .map((line) =>
      line
        .split(',')
        .map((p) => p.split('-'))
        .flat()
        .map((c) => Number(c))
    );

const part1 = (input) => input.reduce((c, [ls, le, rs, re]) => ((rs >= ls && re <= le) || (ls >= rs && le <= re) ? c + 1 : c), 0);

const part2 = (input) =>
  input.reduce(
    (c, [ls, le, rs, re]) =>
      (rs >= ls && rs <= le) || (re >= ls && re <= le) || (ls >= rs && ls <= re) || (le >= rs && le <= re) ? c + 1 : c,
    0
  );

const input = readInput(`d${DAY}-input.txt`);
console.log(`Part 1: ${part1(input)}`);
console.log(`Part 2: ${part2(input)}`);
