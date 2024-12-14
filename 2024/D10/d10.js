/*
Advent Of Code 2024
Day 10: Hoof It part 1 & 2

https://adventofcode.com/2024/day/10
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2024';
const DAY = '10';

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
    const input = data
      .toString()
      .split('\n')
      .filter((l) => l.length > 0)
      .map((l) => l.split('').map((v) => parseInt(v)));
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
      if (r.break) break;
      if (r.result) return result;
    }
  }
};

function part1(input) {
  // find the 0
  const startPos = [];
  const findStartPos = (x, y, elt) => {
    if (elt === 0) startPos.push({ x, y, v: elt });
    return {};
  };
  parseMapXY(input, findStartPos);

  let result = 0;
  for (pos of startPos) {
    const uniqueEndPos = new Set(); // for each starting pos count only unique end pos
    const visited = [pos];
    let currentPos;
    while (visited.length > 0) {
      currentPos = visited.pop();
      if (currentPos.v === 9) {
        uniqueEndPos.add(`${currentPos.x}:${currentPos.y}`);
        continue;
      }

      const neighborPos = getNeighborPositions(input, currentPos.x, currentPos.y, DIR4);
      const validNeighborPos = neighborPos.filter((p) => input[p.y][p.x] === currentPos.v + 1);
      validNeighborPos.forEach(({ x, y }) => visited.push({ x, y, v: input[y][x] }));
    }
    result += uniqueEndPos.size;
  }

  return { result };
}

function part2(input) {
  // find the 0
  const startPos = [];
  const findStartPos = (x, y, elt) => {
    if (elt === 0) startPos.push({ x, y, v: elt });
    return {};
  };
  parseMapXY(input, findStartPos);

  let result = 0;
  for (pos of startPos) {
    const trailPos = new Set(); // for each starting pos count only unique trail
    const trail = [];
    const visited = [pos];
    let currentPos;
    while (visited.length > 0) {
      currentPos = visited.pop();
      trail.push(currentPos);

      if (currentPos.v === 9) {
        // add the trail
        trailPos.add(trail.reduce((t, p) => `${t},${p.x}:${p.y}`, ''));
        // pop the trail until next branch on that trail (trial are only 10 pos 0 to 9)
        if (visited.length === 0) break;
        const p = visited[visited.length - 1].v;
        while (trail[trail.length - 1].v >= p) trail.pop();
        continue;
      }

      const neighborPos = getNeighborPositions(input, currentPos.x, currentPos.y, DIR4);
      const validNeighborPos = neighborPos.filter(({ x, y }) => input[y][x] === currentPos.v + 1);
      validNeighborPos.forEach(({ x, y }) => visited.push({ x, y, v: input[y][x] }));
    }
    result += trailPos.size;
  }

  return { result };
}

function part1_DFS(input) {
  // find the 0
  const startPos = [];
  const findStartPos = (x, y, elt) => {
    if (elt === 0) startPos.push({ x, y, v: elt });
    return {};
  };
  parseMapXY(input, findStartPos);

  // implement DFS
  const searchPath = (firstNode) => {
    const uniqueEndPos = new Set();

    const DFS = (node) => {
      if (node.v === 9) {
        uniqueEndPos.add(`${node.x}:${node.y}`);
        return;
      }

      const neighborPos = getNeighborPositions(input, node.x, node.y, DIR4);
      for (pos of neighborPos) {
        pos.v = input[pos.y][pos.x];
        if (pos.v === node.v + 1) DFS(pos);
      }
    };

    DFS(firstNode);
    return uniqueEndPos.size;
  };

  let result = startPos.reduce((r, pos) => r + searchPath(pos), 0);
  return { result };
}

function part2_DFS(input) {
  // find the 0
  const startPos = [];
  const findStartPos = (x, y, elt) => {
    if (elt === 0) startPos.push({ x, y, v: elt });
    return {};
  };
  parseMapXY(input, findStartPos);

  // implement DFS
  const searchPath = (firstNode) => {
    const uniquePath = new Set();

    const DFS = (node, currentPath) => {
      if (node.v === 9) {
        currentPath.push(node);
        uniquePath.add(currentPath.reduce((t, n) => `${t},${n.x}:${n.y}`, ''));
        return;
      }

      const neighborPos = getNeighborPositions(input, node.x, node.y, DIR4);
      for (pos of neighborPos) {
        pos.v = input[pos.y][pos.x];
        if (pos.v === node.v + 1) DFS(pos, [...currentPath, pos]);
      }
    };

    DFS(firstNode, [firstNode]);
    return uniquePath.size;
  };

  let result = startPos.reduce((r, pos) => r + searchPath(pos), 0);
  return { result };
}
//const input = readInput(`d${DAY}-sample.txt`);
const input = readInput(`d${DAY}-puzzle-input.txt`);
elapsedTime('Part 1', part1, input);
elapsedTime('Part 1_2', part1_DFS, input);
elapsedTime('Part 2', part2, input);
elapsedTime('Part 2_2', part2_DFS, input);
