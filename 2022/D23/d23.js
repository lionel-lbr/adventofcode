/*
Advent Of Code 2022
Day 23: Unstable Diffusion part 1 & 2

https://adventofcode.com/2022/day/23
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2022';
const DAY = '23';

function readInput(filename) {
  const readRawIntput = () => {
    const data = fs.readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename));
    const lines = data
      .toString()
      .split(`\n`)
      .filter((l) => l)
      .map((l) => l.split(''));
    return lines;
  };

  const parseALine = (line) => {};

  try {
    const lines = readRawIntput();
    return lines;
  } catch (err) {
    console.error(err);
  }
}

function part1(input) {
  const map = input.map((l) => [...l]);
  const height = map.length;
  const width = map[0].length;

  const canGoNorth = ({ x, y }) => {
    if (y === 0 || x === 0 || x + 1 === width) return false;
    return map[y - 1][x - 1] === '.' && map[y - 1][x] === '.' && map[y - 1][x + 1] === '.';
  };
  const canGoSouth = ({ x, y }) => {
    if (y >= height - 1 || x === 0 || x + 1 === width) return false;
    return map[y + 1][x - 1] === '.' && map[y + 1][x] === '.' && map[y + 1][x + 1] === '.';
  };
  const canGoWest = ({ x, y }) => {
    if (x === 0 || y === 0 || y + 1 == height) return false;
    return map[y + 1][x - 1] === '.' && map[y][x - 1] === '.' && map[y + 1][x - 1] === '.';
  };
  const canGoEast = ({ x, y }) => {
    if (x >= width - 1 || y === 0 || y + 1 === height) return false;
    return map[y + 1][x + 1] === '.' && map[y][x + 1] === '.' && map[y + 1][x + 1] === '.';
  };

  const canMoveFcts = [canGoNorth, canGoSouth, canGoWest, canGoEast];
  const moveFcts = [
    ({ x, y }) => ({ x, y: y - 1 }),
    ({ x, y }) => ({ x, y: y + 1 }),
    ({ x, y }) => ({ x: x - 1, y }),
    ({ x, y }) => ({ x: x + 1, y }),
  ];

  let iter = 0;
  while (true) {
    // increase map size
    // insert top and bottom row
    // map.splice(0, 0, new Array(map[0].length).fill('.'));
    // map.splice(map.length, 0, new Array(map[0].length).fill('.'));
    // map.forEach((row) => {
    //   row.splice(0, 0, '.');
    //   row.push('.');
    // });

    const canMoveElfs = [];
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (map[y][x] === '.') continue;
        for (let i = 0; i < 4; i++) {
          if (canMoveFcts[i]({ x, y })) {
            canMoveElfs.push({ org: { x, y }, dst: moveFcts[i]({ x, y }) });
            break;
          }
        }
      }
    }

    if (canMoveElfs.length === 0) break;

    while (true) {
      let end = true;
      for (let i = 0; i < canMoveElfs.length; i++) {
        if (canMoveElfs[i] === undefined) continue;
        for (let j = i + 1; j < canMoveElfs.length; j++) {
          if (canMoveElfs[j] === undefined) continue;
          if (canMoveElfs[i].dst.x === canMoveElfs[j].dst.x && canMoveElfs[i].dst.y === canMoveElfs[j].dst.y) {
            canMoveElfs[i] = undefined;
            canMoveElfs[j] = undefined;
            end = false;
            break;
          }
        }
        if (end === false) break;

        // move this elf
        const { org, dst } = canMoveElfs[i];
        map[org.y][org.x] = '.';
        map[dst.y][dst.x] = '#';
        canMoveElfs[i] = undefined;
      }
      if (end) break;
    }

    canMoveFcts.push(canMoveFcts.shift());
    moveFcts.push(moveFcts.shift());
    iter += 1;
    if (iter === 10) {
      console.log('end of iterations');
      while (map[0].every((c) => c === '.')) map.splice(0, 1);
      while (map[map.length - 1].every((c) => c === '.')) map.splice(map.length - 1, 1);
      while (map.every((row) => row[0] === '.')) map.forEach((row) => row.splice(0, 1));
      while (map.every((row) => row[row.length - 1] === '.')) map.forEach((row) => row.splice(row.length - 1, 1));
      const result = map.reduce((count, row) => row.reduce((count, c) => (c === '.' ? count + 1 : count), count), 0);
      return result;
    }
  }
  return 0;
}

function part2(input) {
  return 0;
}

const input = readInput(`d${DAY}-sample_1.txt`);
//const input = readInput(`d${DAY}-input.txt`);
console.log(`Part 1: ${part1(input)}`);
console.log(`Part 2: ${part2(input)}`);
