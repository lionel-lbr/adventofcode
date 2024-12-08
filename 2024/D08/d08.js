/*
Advent Of Code 2024
Day 8: Resonant Collinearity part 1 & 2

https://adventofcode.com/2024/day/8
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2024';
const DAY = '08';

function elapsedTime(name, fct, input) {
  const startTime = performance.now();
  const { result } = fct(input);
  const elapsed = performance.now() - startTime;
  console.log(`${name} time: ${Math.floor(elapsed / 60000)}:${Math.floor((elapsed % 60000) / 1000)}:${Math.floor(elapsed % 1000)}`);
  console.log(`${name} result: ${result}`);
}

function readInput(filename) {
  const readRawInput = () => {
    const data = fs.readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename));
    const map = new Map();
    let width = 0;
    let height = 0;
    data
      .toString()
      .split('\n')
      .filter((l) => l.length > 0)
      .forEach((l, y) => {
        l.split('').forEach((v, x) => {
          width = x;
          if (v === '.') return;
          if (!map.has(v)) map.set(v, []);
          map.get(v).push({ x, y });
        });
        height = y;
      });
    return { map, width: width + 1, height: height + 1 };
  };
  try {
    return readRawInput();
  } catch (err) {
    console.error(err);
  }
}

function getListOfPair(symbol, map) {
  const listPos = map.get(symbol);
  const listPairs = [];
  for (let i = 0; i < listPos.length - 1; i++) {
    const org = listPos[i];
    for (let j = i + 1; j < listPos.length; j++) {
      const dst = listPos[j];
      const pair = { org, dst, dx: dst.x - org.x, dy: dst.y - org.y };
      listPairs.push(pair);
    }
  }
  return listPairs;
}

function part1(input) {
  const WIDTH = input.width;
  const HEIGHT = input.height;
  const map = input.map;
  const antinodes = new Set();

  for (const k of map.keys()) {
    const l = getListOfPair(k, map);
    l.forEach((p) => {
      const { org, dst, dx, dy } = p;
      const an1 = { x: org.x - dx, y: org.y - dy };
      const an2 = { x: dst.x + dx, y: dst.y + dy };
      if (an1.x >= 0 && an1.x < WIDTH && an1.y >= 0 && an1.y < HEIGHT) antinodes.add(`${an1.x}:${an1.y}`);
      if (an2.x >= 0 && an2.x < WIDTH && an2.y >= 0 && an2.y < HEIGHT) antinodes.add(`${an2.x}:${an2.y}`);
    });
  }

  let result = antinodes.size;
  return { result };
}

function part2(input) {
  const WIDTH = input.width;
  const HEIGHT = input.height;
  const map = input.map;
  const antinodes = new Set();

  const addAntinode = (orgX, orgY, dx, dy) => {
    let x = orgX;
    let y = orgY;
    l = [];
    while (x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT) {
      l.push(`${x}:${y}`);
      x -= dx;
      y -= dy;
    }
    return l;
  };

  for (const k of map.keys()) {
    const l = getListOfPair(k, map);
    l.forEach((p) => {
      const { org, dst, dx, dy } = p;
      const l1 = addAntinode(org.x, org.y, dx, dy);
      l1.forEach((e) => antinodes.add(e));
      const l2 = addAntinode(dst.x, dst.y, -dx, -dy);
      l2.forEach((e) => antinodes.add(e));
    });
  }

  let result = antinodes.size;
  return { result };
}

//const input = readInput(`d${DAY}-sample.txt`);
const input = readInput(`d${DAY}-input.txt`);
elapsedTime('Part 1', part1, input);
elapsedTime('Part 2', part2, input);
