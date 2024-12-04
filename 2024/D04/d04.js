/*
Advent Of Code 2024
Day 4: Ceres Search part 1 & 2

https://adventofcode.com/2024/day/4
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2024';
const DAY = '04';

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
    const input = data
      .toString()
      .split('\n')
      .filter((l) => l.length > 0)
      .map((l) => l.split(''));
    return input;
  };
  try {
    return readRawInput();
  } catch (err) {
    console.error(err);
  }
}

function part1(input) {
  const DIR8 = [
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [-1, -1],
  ];
  const XMAS = ['X', 'M', 'A', 'S'];

  const WIDTH = input[0].length;
  const HEIGHT = input.length;

  const getXmasDirection = (x, y) => {
    const result = [];
    for (const [accX, accY] of DIR8) {
      const nX = x + accX;
      const nY = y + accY;
      if (nX < 0 || nX >= WIDTH || nY < 0 || nY >= HEIGHT) continue;
      if (input[nY][nX] === 'M') result.push([accX, accY]);
    }
    return result;
  };

  const findXmas = (x, y, [accX, accY]) => {
    let index = 0;
    let nX = x;
    let nY = y;
    while (index < XMAS.length) {
      if (nX < 0 || nX >= WIDTH || nY < 0 || nY >= HEIGHT) return false;
      if (input[nY][nX] !== XMAS[index]) return false;
      index++;
      nX += accX;
      nY += accY;
    }
    return true;
  };

  let result = 0;
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const l = input[y][x];
      if (l != XMAS[0]) continue;
      const pos = getXmasDirection(x, y);
      for (const p of pos) {
        if (findXmas(x, y, p)) result++;
      }
    }
  }
  return result;
}

function part2(input) {
  const DIR = [
    [
      [-1, -1, 'M'],
      [1, 1, 'S'],
      [-1, 1, 'M'],
      [1, -1, 'S'],
    ],
    [
      [-1, -1, 'S'],
      [1, 1, 'M'],
      [-1, 1, 'M'],
      [1, -1, 'S'],
    ],
    [
      [-1, -1, 'M'],
      [1, 1, 'S'],
      [-1, 1, 'S'],
      [1, -1, 'M'],
    ],
    [
      [-1, -1, 'S'],
      [1, 1, 'M'],
      [-1, 1, 'S'],
      [1, -1, 'M'],
    ],
  ];

  const WIDTH = input[0].length;
  const HEIGHT = input.length;

  const isXmas = (x, y) => {
    for (const dir of DIR) {
      let foundOne = false;
      for (const [accX, accY, l] of dir) {
        const nX = x + accX;
        const nY = y + accY;
        if (nX < 0 || nX >= WIDTH || nY < 0 || nY >= HEIGHT) {
          foundOne = false;
          break;
        }
        if (input[y + accY][x + accX] !== l) {
          foundOne = false;
          break;
        }
        foundOne = true;
      }
      if (foundOne) return true;
    }
    return false;
  };

  let result = 0;
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const l = input[y][x];
      if (l !== 'A') continue;
      if (isXmas(x, y)) result++;
    }
  }
  return result;
}

//const input = readInput(`d${DAY}-sample.txt`);
const input = readInput(`d${DAY}-input.txt`);
elapsedTime('Part 1', part1, input);
elapsedTime('Part 2', part2, input);
