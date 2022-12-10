/*
Advent Of Code 2022
Day 10: Cathode-Ray Tube part 1 & 2

https://adventofcode.com/2022/day/10
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2022';
const DAY = '10';

function readInput(filename) {
  return fs
    .readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename))
    .toString()
    .split(`\n`)
    .filter((l) => l)
    .map((i) => {
      if (i.startsWith('noop')) return { inst: 'noop', arg: null };
      else {
        const inc = i.split(' ')[1];
        return { inst: 'addx', arg: Number(inc) };
      }
    });
}

function part1(input) {
  let cycle = 0,
    strength = 0;

  const incCycleAndStrength = (x) => {
    cycle += 1;
    if ((cycle + 20) % 40 === 0) strength += cycle * x;
  };

  input.reduce((regX, { inst, arg }) => {
    switch (inst) {
      case 'noop':
        incCycleAndStrength(regX);
        break;
      case 'addx':
        incCycleAndStrength(regX);
        incCycleAndStrength(regX);
        regX += arg;
        break;
    }
    return regX;
  }, 1);
  return strength;
}

function part2(input) {
  const image = [];
  let cycle = 0;

  const incCycleAndDrawPixel = (x) => {
    cycle += 1;
    const pos = (cycle - 1) % 40;
    if (pos === 0) image.push('\n');
    if (pos >= x - 1 && pos <= x + 1) image.push('#');
    else image.push('.');
  };

  input.reduce((regX, { inst, arg }) => {
    switch (inst) {
      case 'noop':
        incCycleAndDrawPixel(regX);
        break;
      case 'addx':
        incCycleAndDrawPixel(regX);
        incCycleAndDrawPixel(regX);
        regX += arg;
        break;
    }
    return regX;
  }, 1);
  return image.join('');
}

//const input = readInput(`d${DAY}-sample.txt`);
const input = readInput(`d${DAY}-input.txt`);
console.log(`Part 1: ${part1(input)}`);
console.log(`Part 2: ${part2(input)}`);
