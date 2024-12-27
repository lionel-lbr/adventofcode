/*
Advent Of Code 2024
Day 18: RAM Run part 1 & 2

https://adventofcode.com/2024/day/18
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2024';
const DAY = '18';

function readInput(filename) {
  const readRawInput = () => {
    const data = fs.readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename));
    const input = data
      .toString()
      .split('\n')
      .filter((l) => l.length > 0)
      .map((l) => l.split(',').map((v) => parseInt(v)));
    return input;
  };
  try {
    return readRawInput();
  } catch (err) {
    console.error(err);
  }
}

const DIR4 = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
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

function solution1(input, width, height, fallByteMaxCount) {
  const map = new Array(height).fill('.').map((r) => new Array(width).fill('.'));

  for (let i = 0; i < fallByteMaxCount; i++) {
    const [x, y] = input[i];
    map[y][x] = '#';
  }

  const maze = new Map();
  const updateMaze = (x, y, v) => {
    const k = `${x}:${y}`;
    if (!maze.has(k)) maze.set(k, { x, y });
    maze.set(k, { ...maze.get(k), ...v });
  };
  const getMazePos = (x, y) => maze.get(`${x}:${y}`);

  parseMapXY(map, (x, y, elt) => {
    if (elt === '.') updateMaze(x, y, { step: Infinity, visited: false, prev: { x: -1, y: -1 } });
  });

  const startPos = { x: 0, y: 0 };
  const endPos = { x: width - 1, y: height - 1 };
  updateMaze(startPos.x, startPos.y, { visited: true, step: 0 });

  // shortest path
  const candidates = [getMazePos(startPos.x, startPos.y)];
  while (candidates.length > 0) {
    candidates.sort((a, b) => b.step - a.step);
    const { x, y, step } = candidates.pop();

    updateMaze(x, y, { visited: true });
    const neighbors = getNeighborPositions(map, x, y, DIR4);
    const validNeighbors = neighbors.filter(({ x, y }) => map[y][x] !== '#' && !getMazePos(x, y).visited);
    for (const n of validNeighbors) {
      const nPos = getMazePos(n.x, n.y);
      if (step + 1 < nPos.step) {
        nPos.step = step + 1;
        nPos.prev = { x: x, y: y };
        candidates.push(nPos);
      }
    }
  }

  let result = getMazePos(endPos.x, endPos.y).step;
  return result;
}

function solution2(input, width, height, fallByteMaxCount) {
  const map = new Array(height).fill('.').map((r) => new Array(width).fill('.'));

  for (let i = 0; i < fallByteMaxCount; i++) {
    const [x, y] = input[i];
    map[y][x] = '#';
  }

  const maze = new Map();
  const updateMaze = (x, y, v) => {
    const k = `${x}:${y}`;
    if (!maze.has(k)) maze.set(k, { x, y });
    maze.set(k, { ...maze.get(k), ...v });
  };
  const getMazePos = (x, y) => maze.get(`${x}:${y}`);
  const resetMaze = () => {
    for (k of maze.keys()) maze.set(k, { ...maze.get(k), ...{ step: Infinity, visited: false, prev: { x: -1, y: -1 } } });
  };

  parseMapXY(map, (x, y, elt) => {
    if (elt === '.') updateMaze(x, y, { step: Infinity, visited: false, prev: { x: -1, y: -1 } });
  });

  let byteIndex = fallByteMaxCount;
  while (true) {
    // new block
    const [bx, by] = input[byteIndex];
    map[by][bx] = '#';
    maze.delete(`${bx}:${by}`);
    resetMaze();

    const startPos = { x: 0, y: 0 };
    const endPos = { x: width - 1, y: height - 1 };
    updateMaze(startPos.x, startPos.y, { visited: true, step: 0 });

    // shortest path
    const candidates = [getMazePos(startPos.x, startPos.y)];
    while (candidates.length > 0) {
      candidates.sort((a, b) => b.step - a.step);
      const { x, y, step } = candidates.pop();
      updateMaze(x, y, { visited: true });
      const neighbors = getNeighborPositions(map, x, y, DIR4);
      const validNeighbors = neighbors.filter(({ x, y }) => map[y][x] !== '#' && !getMazePos(x, y).visited);
      for (const n of validNeighbors) {
        const nPos = getMazePos(n.x, n.y);
        if (step + 1 < nPos.step) {
          nPos.step = step + 1;
          nPos.prev = { x: x, y: y };
          candidates.push(nPos);
        }
      }
    }

    if (getMazePos(endPos.x, endPos.y).step === Infinity) break;
    byteIndex++;
    if (byteIndex >= input.length) break;
  }

  if (byteIndex >= input.length) {
    console.log("cloud't find a blocking path");
    return 0;
  }

  let result = `${input[byteIndex][0]},${input[byteIndex][1]}`;
  return result;
}

function part1(mode) {
  const input = readInput(`d${DAY}-${mode}.txt`);
  const width = mode === 'sample' ? 7 : 71;
  const height = mode === 'sample' ? 7 : 71;
  const fallByteMaxCount = mode === 'sample' ? 12 : 1024;
  const startTime = performance.now();
  const result = solution1(input, width, height, fallByteMaxCount);
  const elapsed = performance.now() - startTime;
  console.log(`Part 1 ${mode} time: ${Math.floor(elapsed / 60000)}:${Math.floor((elapsed % 60000) / 1000)}:${Math.floor(elapsed % 1000)}`);
  console.log(`Part 1 ${mode} result: ${result}`);
}

function part2(mode) {
  const input = readInput(`d${DAY}-${mode}.txt`);
  const width = mode === 'sample' ? 7 : 71;
  const height = mode === 'sample' ? 7 : 71;
  const fallByteMaxCount = mode === 'sample' ? 12 : 1024;
  const startTime = performance.now();
  const result = solution2(input, width, height, fallByteMaxCount);
  const elapsed = performance.now() - startTime;
  console.log(`Part 2 ${mode} time: ${Math.floor(elapsed / 60000)}:${Math.floor((elapsed % 60000) / 1000)}:${Math.floor(elapsed % 1000)}`);
  console.log(`Part 2 ${mode} result: ${result}`);
}

part1('sample');
part1('input');
part2('sample');
part2('input');
