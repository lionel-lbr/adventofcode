/*
Advent Of Code 2023
Day 6: Wait For It part 1 & 2

https://adventofcode.com/2023/day/6
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2023';
const DAY = '0x';

function readInput(filename) {
  const readRawIntput = () => {
    const data = fs.readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename));
    const input = data.toString();
    return input;
  };

  const parseALine = (line) => {};

  try {
    return readRawIntput();
  } catch (err) {
    console.error(err);
  }
}

function executionTime(msg, fct, args) {
  const startTime = performance.now();
  const result = fct(args);
  const endTime = performance.now();
  console.log(`Execution time for ${msg}: ${((endTime - startTime) / 1000).toFixed(3)}`);
  return result;
}

function solution1BrutForce(input) {
  const result = input.reduce((_r, { time, distance }) => {
    let victories = 0;
    for (let i = 1; i < time; i++) {
      if (i * (time - i) > distance) victories++;
    }
    return (_r *= victories > 0 ? victories : 1);
  }, 1);
  return result;
}

function solution2Palindrome(input) {
  const result = input.reduce((_r, { time, distance }) => {
    let victories = 0;
    let limit;

    // check if time is even
    if (time % 2 === 0) {
      limit = time / 2;
      victories = limit * limit > distance ? 1 : 0;
    } else limit = Math.floor(time / 2) + 1;

    for (let i = 1; i < limit; i++) {
      if (i * (time - i) > distance) victories += 2;
    }
    return (_r *= victories > 0 ? victories : 1);
  }, 1);
  return result;
}

function solution3Math(input) {
  const result = input.reduce((_r, { time, distance }) => {
    let victories = 0;

    let i = 0;
    let last = 0;
    while (true) {
      const r = time - 1 + i * (time - 2) - i * i;
      if (r <= last) return (_r *= victories > 0 ? (time % 2 === 0 ? victories - 1 : victories) : 1);
      if (r > distance) victories += 2;
      last = r;
      i += 1;
    }
  }, 1);
  return result;
}

const sampleInputP1 = [
  { time: 7, distance: 9 },
  { time: 15, distance: 40 },
  { time: 30, distance: 200 },
];
console.log(`Sample Part 1: ${executionTime('Sol 1 with brut force', solution1BrutForce, sampleInputP1)}`);
console.log(`Sample Part 1: ${executionTime('Sol 1 with palindrome', solution2Palindrome, sampleInputP1)}`);
console.log(`Sample Part 1: ${executionTime('Sol 1 with math', solution3Math, sampleInputP1)}`);

const inputP1 = [
  { time: 40, distance: 277 },
  { time: 82, distance: 1338 },
  { time: 91, distance: 1349 },
  { time: 66, distance: 1063 },
];
console.log(`Part 1: ${executionTime('Sol 1 with brut force', solution1BrutForce, inputP1)}`);
console.log(`Part 1: ${executionTime('Sol 1 with palindrome', solution2Palindrome, inputP1)}`);
console.log(`Part 1: ${executionTime('Sol 1 with math', solution3Math, inputP1)}`);

// just brut force it ...
const sampleInputP2 = [{ time: 71530, distance: 940200 }];
console.log(`Sample Part 2: ${executionTime('Sol 1 with brut force', solution1BrutForce, sampleInputP2)}`);
console.log(`Sample Part 2: ${executionTime('Sol 1 with palindrome', solution2Palindrome, sampleInputP2)}`);
console.log(`Sample Part 2: ${executionTime('Sol 1 with math', solution3Math, sampleInputP2)}`);

const inputP2 = [{ time: 40829166, distance: 277133813491063 }];
console.log(`Part 2: ${executionTime('Sol 1 with brut force', solution1BrutForce, inputP2)}`);
console.log(`Part 2: ${executionTime('Sol 1 with palindrome', solution2Palindrome, inputP2)}`);
console.log(`Part 2: ${executionTime('Sol 1 with math', solution3Math, inputP2)}`);
