/*
Advent Of Code 2024
Day x: --- part 1 & 2

https://adventofcode.com/2024/day/x
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2024';
const DAY = '0x';

function readInput(filename) {
  const readRawInput = () => {
    const data = fs.readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename));
    const input = data
      .toString()
      .split('\n')
      .filter((l) => l.length > 0)
      .map((l) => l);
    return input;
  };
  try {
    return readRawInput();
  } catch (err) {
    console.error(err);
  }
}

const drawMap = (map, filePath = null) => {
  let output = '';
  let index = 0;
  for (const row of map) {
    const line = `${index}`.padStart(3, '0') + ' ' + row.join('');
    output += line + '\n';
    index++;
  }

  if (filePath) {
    fs.writeFileSync(path.join(`${YEAR}`, `D${DAY}`, filePath), output, 'utf8');
  } else {
    console.log(output);
  }
};

const NORTH = 'NORTH';
const EAST = 'EAST';
const SOUTH = 'SOUTH';
const WEST = 'WEST';

const UP = 'UP';
const RIGHT = 'RIGHT';
const DOWN = 'DOWN';
const LEFT = 'LEFT';

const DIR_NAME_GEO = [NORTH, EAST, SOUTH, WEST];
const DIR_NAME = [UP, RIGHT, DOWN, LEFT];

const DIR4 = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

const DIR4_GEO = {
  UP: [0, -1],
  NORTH: [0, -1],
  RIGHT: [1, 0],
  EAST: [1, 0],
  DOWN: [0, 1],
  SOUTH: [0, 1],
  LEFT: [-1, 0],
  WEST: [-1, 0],
};

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

function getNeighborPositions(input, x, y, dir) {
  const height = input.length;
  const width = input[0].length;
  const pos = dir.map(([accX, accY]) => ({ x: x + accX, y: y + accY }));
  return pos.filter(({ x, y }) => !(x < 0 || x >= width || y < 0 || y >= height));
}

const parseMapXY = (input, actionFct) => {
  const height = input.length;
  const width = input[0].length;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const r = actionFct(x, y, input[y][x], width, height);
      if (!r) continue;
      if (r.break) break;
      if (r.result) return result;
    }
  }
};

function solution1(input, width, height) {
  let result = 0;
  return result;
}

function solution2(input, width, height) {
  let result = 0;
  return result;
}

function part1(mode) {
  const input = readInput(`d${DAY}-${mode}.txt`);
  const width = input[0].length;
  const height = input.length;
  const startTime = performance.now();
  const result = solution1(input, width, height);
  const elapsed = performance.now() - startTime;
  console.log(`Part 1 ${mode} time: ${Math.floor(elapsed / 60000)}:${Math.floor((elapsed % 60000) / 1000)}:${Math.floor(elapsed % 1000)}`);
  console.log(`Part 1 ${mode} result: ${result}`);
}

function part2(mode) {
  const input = readInput(`d${DAY}-${mode}.txt`);
  const width = input[0].length;
  const height = input.length;
  const startTime = performance.now();
  const result = solution2(input, width, height);
  const elapsed = performance.now() - startTime;
  console.log(`Part 2 ${mode} time: ${Math.floor(elapsed / 60000)}:${Math.floor((elapsed % 60000) / 1000)}:${Math.floor(elapsed % 1000)}`);
  console.log(`Part 2 ${mode} result: ${result}`);
}

part1('sample');
part1('input');
part2('sample');
part2('input');
