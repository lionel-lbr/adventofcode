/*
Advent Of Code 2022
Day 17: xx part 1 & 2

https://adventofcode.com/2022/day/17
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2022';
const DAY = '17';

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
    return lines[0].split('');
  } catch (err) {
    console.error(err);
  }
}

const EMPTY = '|.......|'.split('');
const ROCKS = [
  [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 3, y: 0 },
  ],
  [
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
    { x: 1, y: 2 },
  ],
  [
    { x: 2, y: 0 },
    { x: 2, y: 1 },
    { x: 0, y: 2 },
    { x: 1, y: 2 },
    { x: 2, y: 2 },
  ],
  [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: 2 },
    { x: 0, y: 3 },
  ],
  [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
  ],
];

function solve(input, MAX_ROCK_COUNT) {
  let rockY = 0;
  let rockX = 3;

  const canMoveRight = (rock) => {
    for ({ x, y } of rock) {
      if (map[rockY + y][rockX + x + 1] !== '.') return false;
    }
    return true;
  };

  const canMoveLeft = (rock) => {
    for ({ x, y } of rock) {
      if (map[rockY + y][rockX + x - 1] !== '.') return false;
    }
    return true;
  };

  const canMoveDown = (rock) => {
    for ({ x, y } of rock) {
      if (map[rockY + y + 1][rockX + x] !== '.') return false;
    }
    return true;
  };

  const map = ['|-------|'.split('')];

  let count = 0;
  let gazIndex = -1;
  let height = 0;
  let topRow = 0;

  while (count < MAX_ROCK_COUNT) {
    // insert rock
    const rock = ROCKS[count % ROCKS.length];
    const needed = rock[rock.length - 1].y + 1 + 3;
    if (needed < topRow) {
      map.splice(0, topRow - needed);
      topRow -= topRow - needed;
    } else if (needed > topRow) {
      const blankLInes = new Array(needed - topRow).fill(1).map((v) => [...EMPTY]);
      map.splice(0, 0, ...blankLInes);
      topRow += blankLInes.length;
    }

    // map.splice(0, 0, ...[EMPTY.split(''), EMPTY.split(''), EMPTY.split('')]);
    // map.splice(0, 0, ...[EMPTY.split(''), EMPTY.split(''), EMPTY.split('')]);
    // topRow += 6;

    rockY = 0;
    rockX = 3;
    while (1) {
      gazIndex = (gazIndex + 1) % input.length;
      const direction = input[gazIndex];
      if (direction === '>' && canMoveRight(rock)) rockX += 1;
      if (direction === '<' && canMoveLeft(rock)) rockX -= 1;
      if (canMoveDown(rock)) {
        rockY += 1;
      } else {
        // "freeze" the block
        for ({ x, y } of rock) {
          map[rockY + y][rockX + x] = '#';
        }
        break;
      }
    }

    //part 2 ...
    for ({ y } of rock) {
      if (map[rockY + y].slice(1, -1).every((c) => c === '#')) {
        const index = rockY + y + 1;
        height += map.length - index - 1;
        map.splice(index, map.length - index - 1);
        break;
      }
    }

    topRow = Math.min(topRow, rockY);
    count += 1;
  }

  return map.length - 1 + height - topRow;
}

//const input = readInput(`d${DAY}-sample.txt`);
const input = readInput(`d${DAY}-input.txt`);
console.log(`Part 1: ${solve(input, 2022)}`);
console.log(`Part 2: ${solve(input, 1_000_000_000_000)}`);
