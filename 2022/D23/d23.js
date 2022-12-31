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
  return fs
    .readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename))
    .toString()
    .split(`\n`)
    .filter((l) => l)
    .map((l) => l.split(''));
}

function solve(input, maxIterationCount) {
  const map = input.map((l) => [...l]);
  const isEmptyRow = (index) => map[index].every((c) => c === '.');
  const isEmptyCol = (index) => map.every((row) => row[index] === '.');
  const canGoNorth = ({ x, y }) => {
    if (y === 0 || x === 0 || x + 1 === map[0].length) return false;
    return map[y - 1][x - 1] === '.' && map[y - 1][x] === '.' && map[y - 1][x + 1] === '.';
  };
  const canGoSouth = ({ x, y }) => {
    if (y >= map.length - 1 || x === 0 || x + 1 === map[0].length) return false;
    return map[y + 1][x - 1] === '.' && map[y + 1][x] === '.' && map[y + 1][x + 1] === '.';
  };
  const canGoWest = ({ x, y }) => {
    if (x === 0 || y === 0 || y + 1 === map.length) return false;
    return map[y + 1][x - 1] === '.' && map[y][x - 1] === '.' && map[y - 1][x - 1] === '.';
  };
  const canGoEast = ({ x, y }) => {
    if (x >= map[0].length - 1 || y === 0 || y + 1 === map.length) return false;
    return map[y + 1][x + 1] === '.' && map[y][x + 1] === '.' && map[y - 1][x + 1] === '.';
  };
  const isIsolated = ({ x, y }) => {
    const pos = [
      [x - 1, y - 1],
      [x, y - 1],
      [x + 1, y - 1],
      [x - 1, y],
      [x + 1, y],
      [x - 1, y + 1],
      [x, y + 1],
      [x + 1, y + 1],
    ];

    for (p of pos) {
      const [px, py] = p;
      if (px < 0 || px >= map[0].length || py < 0 || py >= map.length) continue;
      if (map[py][px] === '#') return false;
    }
    return true;
  };
  const canMoveFcts = [canGoNorth, canGoSouth, canGoWest, canGoEast];
  const moveFcts = [
    ({ x, y }) => ({ x, y: y - 1 }),
    ({ x, y }) => ({ x, y: y + 1 }),
    ({ x, y }) => ({ x: x - 1, y }),
    ({ x, y }) => ({ x: x + 1, y }),
  ];

  let iterCount = 0;
  while (iterCount < maxIterationCount) {
    // add empty row or col if necessary
    if (!isEmptyRow(map.length - 1)) map.push(new Array(map[0].length).fill('.'));
    if (!isEmptyRow(0)) map.splice(0, 0, new Array(map[0].length).fill('.'));
    const needAddLeftCol = !isEmptyCol(0);
    const needAddRightCol = !isEmptyCol(map[0].length - 1);
    map.forEach((row) => {
      if (needAddRightCol) row.push('.');
      if (needAddLeftCol) row.splice(0, 0, '.');
    });

    // check which elf can move
    const canMoveElfs = [];
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[0].length; x++) {
        if (map[y][x] === '.' || isIsolated({ x, y })) continue;
        for (let i = 0; i < 4; i++) {
          if (canMoveFcts[i]({ x, y })) {
            canMoveElfs.push({ org: { x, y }, dst: moveFcts[i]({ x, y }) });
            break;
          }
        }
      }
    }

    if (canMoveElfs.length === 0) break;

    // move the Elf if doesn't collide with oen another.
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

    // display # pos
    // map.forEach((row, y) =>
    //   row.forEach((c, x) => {
    //     if (c === '#') console.log(`${x}:${y}`);
    //   })
    // );

    canMoveFcts.push(canMoveFcts.shift());
    moveFcts.push(moveFcts.shift());

    iterCount++;
  }

  // remove empty line/col
  while (isEmptyRow(map.length - 1)) map.pop();
  while (isEmptyRow(0)) map.splice(0, 1);
  while (isEmptyCol(map[0].length - 1)) map.forEach((row) => row.pop());
  while (isEmptyCol(0)) map.forEach((row) => row.splice(0, 1));
  const result = map.reduce((count, row) => row.reduce((count, c) => (c === '.' ? count + 1 : count), count), 0);
  return [iterCount + 1, result];
}

//const input = readInput(`d${DAY}-sample_2.txt`);
const input = readInput(`d${DAY}-input.txt`);
console.log(`Part 1: ${solve(input, 10)}`);
console.log(`Part 2: ${solve(input, Infinity)}`);
