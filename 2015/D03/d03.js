/*
Advent Of Code 2015
Day 3: Perfectly Spherical Houses in a Vacuum part 1 & 2

https://adventofcode.com/2015/day/3
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2015';
const DAY = '03';

function readInput(filename) {
  const readRawIntput = () => {
    const data = fs.readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename));
    const input = data.toString().split('');
    return input;
  };

  const parseALine = (line) => {};

  try {
    return readRawIntput();
  } catch (err) {
    console.error(err);
  }
}

function part1(input) {
  const pos = { x: 0, y: 0 };
  // first position is always visited
  const map = new Map([['0:0', true]]);
  let vh = 1;

  input.forEach((d) => {
    switch (d) {
      case '>':
        pos.x += 1;
        break;
      case '^':
        pos.y -= 1;
        break;
      case '<':
        pos.x -= 1;
        break;
      case 'v':
        pos.y += 1;
        break;
    }

    const k = `${pos.x}:${pos.y}`;
    if (!map.has(k)) {
      map.set(k, true);
      vh += 1;
    }
  });

  return vh;
}

function part2(input) {
  let turn = 0;
  const pos = [
    { x: 0, y: 0 }, // santa
    { x: 0, y: 0 }, //robot
  ];

  // first position is always visited
  const map = new Map([['0:0', true]]);
  let vh = 1;

  input.forEach((d) => {
    const p = pos[turn];
    switch (d) {
      case '>':
        p.x += 1;
        break;
      case '^':
        p.y -= 1;
        break;
      case '<':
        p.x -= 1;
        break;
      case 'v':
        p.y += 1;
        break;
    }

    const k = `${p.x}:${p.y}`;
    if (!map.has(k)) {
      map.set(k, true);
      vh += 1;
    }
    turn = (turn + 1) % 2;
  });

  return vh;
}

const input = readInput(`d${DAY}-input.txt`);
console.log(`Part 1: ${part1(input)}`);
console.log(`Part 2: ${part2(input)}`);
