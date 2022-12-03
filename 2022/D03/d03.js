/*
Advent Of Code 2022
Day 3: Rucksack Reorganization part 1 & 2

https://adventofcode.com/2022/day/3
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2022';
const DAY = '03';

function readInput(filename) {
  const readRawIntput = () => {
    const data = fs.readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename));
    const lines = data
      .toString()
      .split(`\n`)
      .filter((l) => l);

    return lines;
  };

  const parseALine = (line) => {};

  try {
    const lines = readRawIntput();
    return lines.map((l) => l.split(''));
  } catch (err) {
    console.error(err);
  }
}
const ASCII_A = 'A'.charCodeAt(0); // 65
const ASCII_a = 'a'.charCodeAt(0); // 97

function part1(input) {
  const duplicate = input.reduce((d, r) => {
    const r1 = r.slice(0, Math.floor(r.length / 2));
    const r2 = r.slice(Math.floor(r.length / 2));

    for (c of r1) {
      if (r2.some((c2) => c2 === c)) return [...d, c];
    }

    return d;
  }, []);

  return duplicate.reduce((s, c) => {
    const code = c.charCodeAt(0);
    return code >= ASCII_a ? s + 1 + code - ASCII_a : s + 27 + code - ASCII_A;
  }, 0);
}

function part2(input) {
  const tags = [];
  for (let i = 0; i < input.length; i += 3) {
    const r1 = input[i];
    const r2 = input[i + 1];
    const r3 = input[i + 2];

    for (c of r1) {
      if (r2.some((c2) => c2 === c) && r3.some((c3) => c3 === c)) {
        tags.push(c);
        break;
      }
    }
  }

  return tags.reduce((s, c) => {
    const code = c.charCodeAt(0);
    return code >= ASCII_a ? s + 1 + code - ASCII_a : s + 27 + code - ASCII_A;
  }, 0);
}

//const input = readInput(`d${DAY}-sample.txt`);
const input = readInput(`d${DAY}-input.txt`);
console.log(`Part 1: ${part1(input)}`);
console.log(`Part 2: ${part2(input)}`);
