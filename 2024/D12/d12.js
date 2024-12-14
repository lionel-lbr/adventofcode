/*
Advent Of Code 2024
Day 12: Garden Groups part 1 & 2

https://adventofcode.com/2024/day/12
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2024';
const DAY = '12';

function readInput(filename) {
  const readRawInput = () => {
    const data = fs.readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename));
    const input = data
      .toString()
      .split('\n')
      .filter((l) => l.length > 0)
      .map((l, row) => l.split('').map((e, col) => ({ x: col, y: row, plant: e, perimeter: 4, inArea: false })));
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
    // Write output to a file
    // fs.writeFileSync(path.join(`${YEAR}`, `D${DAY}`, filePath), output, 'utf8');
    fs.appendFileSync(path.join(`${YEAR}`, `D${DAY}`, filePath), output, 'utf8');
  } else {
    // Log output to the console
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

function solution1(input) {
  const areas = [];

  const fillArea = (x, y, elt, width, height) => {
    if (elt.inArea) return {};

    const visited = [elt];
    let areaSize = 0;
    let perimeter = 0;
    while (visited.length > 0) {
      const currentElt = visited.pop();
      if (currentElt.inArea) continue;
      currentElt.inArea = true;
      areaSize++;
      const neighborPos = getNeighborPositions(input, currentElt.x, currentElt.y, DIR4);
      const validNeighborPos = neighborPos.filter(({ x, y }) => input[y][x].plant === currentElt.plant);
      perimeter += 4 - validNeighborPos.length;
      validNeighborPos.forEach((p) => visited.push(input[p.y][p.x]));
    }

    areas.push([areaSize, perimeter]);
  };

  parseMapXY(input, fillArea);

  let result = areas.reduce((r, a) => (r += a[0] * a[1]), 0);
  return result;
}

function solution2(input) {
  const WIDTH = input[0].length;
  const HEIGHT = input.length;
  const areas = [];

  const followPerimeter = (edges) => {
    const nextDirection = {
      EAST: [
        { incX: 1, incY: 0, side: NORTH, d: EAST },
        { incX: 0, incY: 0, side: EAST, d: SOUTH },
        { incX: 1, incY: -1, side: WEST, d: NORTH },
      ],
      SOUTH: [
        { incX: 0, incY: 1, side: EAST, d: SOUTH },
        { incX: 0, incY: 0, side: SOUTH, d: WEST },
        { incX: 1, incY: 1, side: NORTH, d: EAST },
      ],
      WEST: [
        { incX: -1, incY: 0, side: SOUTH, d: WEST },
        { incX: 0, incY: 0, side: WEST, d: NORTH },
        { incX: -1, incY: 1, side: EAST, d: SOUTH },
      ],
      NORTH: [
        { incX: 0, incY: -1, side: WEST, d: NORTH },
        { incX: 0, incY: 0, side: NORTH, d: EAST },
        { incX: -1, incY: -1, side: SOUTH, d: WEST },
      ],
    };

    const findEdge = (x, y, d) => {
      const index = edges.findIndex((e) => e.y === y && e.x === x && e.side === d);
      if (index > -1) return true;
      return null;
    };

    let sideCount = 0;
    let outSideFence = true;
    while (edges.length > 0) {
      let currentEdge;
      let direction;

      if (outSideFence) {
        edges.sort((a, b) => (a.y !== b.y ? a.y - b.y : a.x - b.x));
        currentEdge = edges.shift();

        if (currentEdge.side === WEST) {
          direction = NORTH;
        } else {
          sideCount += 1;
          direction = EAST;
        }
      } else {
        edges.sort((a, b) => (a.y !== b.y ? b.y - a.y : a.x - b.x));
        currentEdge = edges.shift();
        if (currentEdge.side === EAST) {
          direction = SOUTH;
        } else {
          direction = EAST;
          sideCount += 1;
        }
      }

      while (edges.length > 0) {
        let foundOne = false;
        for (let step of nextDirection[direction]) {
          const { incX, incY, side, d } = step;
          if (findEdge(currentEdge.x + incX, currentEdge.y + incY, side)) {
            if (direction !== d) {
              direction = d;
              sideCount += 1;
            }
            const index = edges.findIndex((e) => e.y === currentEdge.y + incY && e.x === currentEdge.x + incX && e.side === side);
            currentEdge = edges.splice(index, 1)[0];
            foundOne = true;
            break;
          }
        }
        if (!foundOne) break;
      }
      if (outSideFence) outSideFence = false;
    }
    return sideCount;
  };

  const fillArea = (x, y, elt, width, height) => {
    if (elt.inArea) return {};

    const visited = [elt];
    const edges = [];

    let areaSize = 0;
    const areaCells = [];
    while (visited.length > 0) {
      const currentElt = visited.pop();
      if (currentElt.inArea) continue;
      currentElt.inArea = true;
      areaCells.push(currentElt);
      currentElt.fences = { NORTH: true, EAST: true, SOUTH: true, WEST: true };
      areaSize++;
      const neighborPos = getNeighborPositions(input, currentElt.x, currentElt.y, DIR4);
      const validNeighborPos = neighborPos.filter(({ x, y }) => input[y][x].plant === currentElt.plant);

      validNeighborPos.forEach((n) => {
        visited.push(input[n.y][n.x]);
        // is p north
        if (n.x === currentElt.x && n.y === currentElt.y - 1) {
          currentElt.fences[NORTH] = false;
          currentElt.perimeter -= 1;
        }
        // is p south
        if (n.x === currentElt.x && n.y === currentElt.y + 1) {
          currentElt.fences[SOUTH] = false;
          currentElt.perimeter -= 1;
        }
        // is p EAST
        if (n.x === currentElt.x + 1 && n.y === currentElt.y) {
          currentElt.fences[EAST] = false;
          currentElt.perimeter -= 1;
        }
        // is p WEST
        if (n.x === currentElt.x - 1 && n.y === currentElt.y) {
          currentElt.fences[WEST] = false;
          currentElt.perimeter -= 1;
        }
      });

      Object.keys(currentElt.fences).forEach((s) => currentElt.fences[s] && edges.push({ x: currentElt.x, y: currentElt.y, side: s }));
    }

    const sideCount = followPerimeter(edges);
    areas.push([areaSize, sideCount]);
  };

  parseMapXY(input, fillArea);

  let result = areas.reduce((r, a) => (r += a[0] * a[1]), 0);
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
