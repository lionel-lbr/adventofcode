/*
Advent Of Code 2024
Day 6: Guard Gallivant part 1 & 2

https://adventofcode.com/2024/day/6
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2024';
const DAY = '06';

function elapsedTime(name, fct, input) {
  const startTime = performance.now();
  const { result } = fct(input);
  const elapsed = performance.now() - startTime;
  console.log(`${name} time: ${Math.floor(elapsed / 60000)}:${Math.floor((elapsed % 60000) / 1000)}:${Math.floor(elapsed % 1000)}`);
  console.log(`${name} result:`, result);
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

const UP = 'UP';
const RIGHT = 'RIGHT';
const DOWN = 'DOWN';
const LEFT = 'LEFT';

const DIR4_GEO = {
  UP: [0, -1],
  RIGHT: [1, 0],
  DOWN: [0, 1],
  LEFT: [-1, 0],
};

const turnRight = { UP: RIGHT, RIGHT: DOWN, DOWN: LEFT, LEFT: UP };
const GUARD = '^';

function part1(input) {
  const WIDTH = input[0].length;
  const HEIGHT = input.length;
  let posX, posY;
  let currentDirection = UP;

  // find starting position of the guard
  for (const [index, row] of input.entries()) {
    posX = row.findIndex((e) => e === GUARD);
    if (posX !== -1) {
      posY = index;
      break;
    }
  }

  const positions = new Set();
  while (true) {
    positions.add(`${posX}:${posY}`);
    const [incX, incY] = DIR4_GEO[currentDirection];
    posX += incX;
    posY += incY;
    if (posX < 0 || posX >= WIDTH || posY < 0 || posY >= HEIGHT) return { result: positions.size, positions };
    // turn right
    if (input[posY][posX] === '#') {
      currentDirection = turnRight[currentDirection];
      posX -= incX;
      posY -= incY;
      continue;
    }
  }
}

function part2_bruteForce(input) {
  const WIDTH = input[0].length;
  const HEIGHT = input.length;

  const isCircuit = (orgX, orgY, d) => {
    let x = orgX;
    let y = orgY;
    const circuit = [];
    while (true) {
      const k = `${x}:${y}:${d}`;
      if (circuit.includes(k)) return true;
      circuit.push(k);
      const [incX, incY] = DIR4_GEO[d];
      x += incX;
      y += incY;
      if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) return false;
      if (input[y][x] === '#') {
        d = turnRight[d];
        x -= incX;
        y -= incY;
        continue;
      }
      // if (x === orgX && y === orgY) return true;
    }
  };

  // find starting position of the guard
  let posX, posY;
  for (const [index, row] of input.entries()) {
    posX = row.findIndex((e) => e === GUARD);
    if (posX !== -1) {
      posY = index;
      break;
    }
  }

  let circuitCount = 0;
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      if ((input[y][x] === '#') | (input[y][x] === GUARD)) continue;

      input[y][x] = '#';
      if (isCircuit(posX, posY, UP)) circuitCount++;
      input[y][x] = '.';
    }
  }

  return { result: circuitCount };
}

// will place new blocks on the guard path only
function part2_optimized(input) {
  const WIDTH = input[0].length;
  const HEIGHT = input.length;

  const isCircuit = (orgX, orgY, d) => {
    let x = orgX;
    let y = orgY;
    const circuit = [];
    while (true) {
      const k = `${x}:${y}:${d}`;
      if (circuit.includes(k)) return true;
      circuit.push(k);
      const [incX, incY] = DIR4_GEO[d];
      x += incX;
      y += incY;
      if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) return false;
      if (input[y][x] === '#' || input[y][x] === 'O') {
        d = turnRight[d];
        x -= incX;
        y -= incY;
        continue;
      }
      // if (x === orgX && y === orgY) return true;
    }
  };

  // find starting position of the guard
  let posX, posY;
  for (const [index, row] of input.entries()) {
    posX = row.findIndex((e) => e === GUARD);
    if (posX !== -1) {
      posY = index;
      break;
    }
  }

  // call part1 again to get list all Guard's position
  const { positions } = part1(input);
  let circuitCount = 0;

  // skip the first position
  for (const pos of [...positions].slice(1)) {
    const [x, y] = pos
      .split(':')
      .slice(0, 2)
      .map((v) => parseInt(v));

    input[y][x] = 'O';
    if (isCircuit(posX, posY, UP)) circuitCount += 1;
    input[y][x] = '.';
  }

  return { result: circuitCount };
}

//const input = readInput(`d${DAY}-sample.txt`);
const input = readInput(`d${DAY}-input.txt`);
elapsedTime('Part 1', part1, input);
//elapsedTime('Part 2', part2, input);
elapsedTime('part2_optimized', part2_optimized, input);
