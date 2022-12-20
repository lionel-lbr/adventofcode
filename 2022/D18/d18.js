/*
Advent Of Code 2022
Day 18: xx part 1 & 2

https://adventofcode.com/2022/day/18
*/

const fs = require('fs');
const path = require('path');
// const { Terminal } = require('command-line-draw');
// const terminal = new Terminal();

const terminal = {
  write: () => {},
};

const YEAR = '2022';
const DAY = '18';

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
    return lines.map((l) => l.split(',').map((i) => Number(i))).map((c) => ({ x: c[0], y: c[1], z: c[2] }));
  } catch (err) {
    console.error(err);
  }
}

function part1(input) {
  let connectedSide = 00;
  for (let i = 0; i < input.length - 1; i++) {
    const c1 = input[i];
    for (let j = i + 1; j < input.length; j++) {
      const c2 = input[j];
      if (c1.x === c2.x && c1.y === c2.y && (c1.z === c2.z + 1 || c1.z === c2.z - 1)) {
        connectedSide += 2;
        continue;
      }
      if (c1.x === c2.x && c1.z === c2.z && (c1.y === c2.y + 1 || c1.y === c2.y - 1)) {
        connectedSide += 2;
        continue;
      }
      if (c1.y === c2.y && c1.z === c2.z && (c1.x === c2.x + 1 || c1.x === c2.x - 1)) {
        connectedSide += 2;
        continue;
      }
    }
  }
  return input.length * 6 - connectedSide;
}

const LETTER = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
function part2(input) {
  const zMap = new Map();
  for (c of input) {
    if (!zMap.has(c.z)) zMap.set(c.z, new Map());
    const yMap = zMap.get(c.z);
    if (!yMap.has(c.y)) yMap.set(c.y, []);
    yMap.get(c.y).push(c.x);
  }

  const getPoint = (x, y, z) => {
    if (!zMap.has(z)) return false;
    const yMap = zMap.get(z);
    if (!yMap.has(y)) return false;
    const l = yMap.get(y);
    const i = l.findIndex((v) => v === x);
    if (i === -1) return false;
    return true;
  };

  const holes = new Set();
  for (z of [...zMap.keys()]) {
    const yMap = zMap.get(z);
    for (y of [...yMap.keys()]) {
      const xList = yMap.get(y);
      for (let i = 0; i < xList.length - 1; i++) {
        const x = xList[i];
        if (x + 2 === xList[i + 1]) {
          // found a hole
          if (
            getPoint(x + 1, y - 1, z) &&
            getPoint(x + 1, y + 1, z) &&
            getPoint(x + 1, y, z + 1) &&
            getPoint(x + 1, y, z - 1)
          ) {
            holes.add(`${x + 1}:${y}:${z}`);
          }
        }
      }
    }
    // for ({ x, y } of l) {
    //   terminal.write(LETTER[k], x, y);
    // }
  }
  // const l = zMap.get(3);
  // l.sort((a, b) => (a.y === b.y ? a.x - b.x : a.y - b.y));
  // for ({ x, y } of l) {
  //   terminal.write('X', x, y);
  // }

  // terminal.write('X', x, y);
  return 0;
}

//const input = readInput(`d${DAY}-sample.txt`);
const input = readInput(`d${DAY}-input.txt`);
input.sort((a, b) => (a.z === b.z ? (a.y === b.y ? a.x - b.x : a.y - b.y) : a.z - b.z));
console.log(`Part 1: ${part1(input)}`);
part2(input);
// console.log(`Part 2: ${part2(input)}`);
