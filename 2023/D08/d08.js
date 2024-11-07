/*
Advent Of Code 2023
Day 08: Haunted Wasteland part 1 & 2

https://adventofcode.com/2023/day/8
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2023';
const DAY = '08';

function readInput(filename) {
  const readRawInput = () => {
    const data = fs.readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename));
    const allLines = data
      .toString()
      .split('\n')
      .filter((s) => s.length > 0);
    const directions = allLines.slice(0, 1);
    const input = allLines.slice(1).reduce((map, e) => {
      const [org, dst] = e.split(' = (');
      const [left, right] = dst.split(', ');
      map[org] = { L: left, R: right.trim().slice(0, -1) };
      return map;
    }, {});
    return { directions: directions[0], map: input };
  };

  const parseALine = (line) => {};

  try {
    return readRawInput();
  } catch (err) {
    console.error(err);
  }
}

function part1(input) {
  const { directions, map } = input;
  let pos = 'AAA';
  let i = 0;
  while (pos !== 'ZZZ') {
    const d = directions[i % directions.length];
    pos = map[pos][d];
    i++;
  }

  return i;
}

function lcm(input) {
  // Function to calculate the Greatest Common Divisor (GCD)
  function gcd(a, b) {
    if (!b) {
      return a;
    }
    return gcd(b, a % b);
  }

  // Function to calculate the Least Common Multiple (LCM) of two numbers
  function lcmOfTwoNumbers(a, b) {
    return (a * b) / gcd(a, b);
  }

  // Function to calculate the LCM of an array of numbers

  let result = input[0];
  for (let i = 1; i < input.length; i++) {
    result = lcmOfTwoNumbers(result, input[i]);
  }
  return result;
}

function part2(input) {
  const { directions, map } = input;
  const keys = Object.keys(map);

  let currentPos = keys
    .filter((e) => e[2] === 'A')
    .map((k) => ({ origin: k, current: k, found: false, size: 0, count: 0, path: [] }));
  console.log(`starting from: ${currentPos.map((p) => p.origin)}`);
  let i = 0;

  while (!currentPos.every(({ found }) => found)) {
    const directionIndex = i % directions.length;
    const d = directions[directionIndex];
    i++;

    // move to the next pos
    currentPos.forEach((pos) => {
      if (!pos.found) {
        pos.current = map[pos.current][d];
        // check potential circuit
        if (pos.current[2] === 'Z') {
          pos.found = true;
          pos.size = i;
          if (i % directions.length !== 0) {
            console.log('wrong circuit ???');
            return;
          }
          pos.count = i / directions.length;
          console.log(`found a circuit for :${pos.origin} -> ${pos.current} for i:${i} inout loop count:${pos.count}`);
        }
      }
    });
  }
  // get the biggest loop size:
  const steps = currentPos.map(({ size }) => size);
  const result = lcm(steps);
  return result;
}

// Example usage
const numbers = [12, 15, 20];
const result = lcm(numbers);
console.log(`The LCM of [${numbers.join(', ')}] is ${result}`);

//const input = readInput(`d${DAY}-sample.txt`);
const input = readInput(`d${DAY}-input.txt`);
console.log(`Part 1: ${part1(input)}`);
console.log(`Part 2: ${part2(input)}`);
