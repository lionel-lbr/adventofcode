/*
Advent Of Code 2023
Day 14: Parabolic Reflector Dish part 1 & 2

https://adventofcode.com/2023/day/14
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2023';
const DAY = '14';

function readInput(filename) {
  const readRawInput = () => {
    const data = fs.readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename));
    const input = data
      .toString()
      .split('\n')
      .filter((r) => r.length > 0)
      .map((r) => r.split(''));
    return input;
  };

  const parseALine = (line) => {};

  try {
    return readRawInput();
  } catch (err) {
    console.error(err);
  }
}

function ElapsedTime(name, fct, input) {
  const startTime = performance.now();
  const result = fct(input);
  const elapsed = performance.now() - startTime;
  console.log(
    `${name} elapsed time ${Math.floor(elapsed / 60000)}:${Math.floor((elapsed % 60000) / 1000)}:${Math.floor(
      elapsed % 1000
    )}`
  );
  console.log(`${name}: ${result}`);
}

const CUBE = '#';
const ROUNDED = 'O';
const EMPTY = '.';

function part1(input) {
  const width = input[0].length;
  const height = input.length;

  const canMoveNorth = (x, y) => {
    if (y === 0) return false;
    if (input[y - 1][x] === EMPTY) return true;
    return false;
  };

  let CAN_STILL_MOVE = true;
  while (CAN_STILL_MOVE) {
    CAN_STILL_MOVE = false;
    for (const [y, row] of input.entries()) {
      if (y === 0) continue;
      for (const [x, elt] of row.entries()) {
        if (elt === ROUNDED && canMoveNorth(x, y)) {
          input[y - 1][x] = input[y][x];
          input[y][x] = EMPTY;
          CAN_STILL_MOVE = true;
        }
      }
    }
  }

  const result = input.reduce((c, row, y) => row.reduce((c, elt) => (c += elt === ROUNDED ? height - y : 0), c), 0);
  return result;
}

function part2(input) {
  const width = input[0].length;
  const height = input.length;

  const moveNorth = (x, y) => {
    if (y === 0) return false;
    if (input[y - 1][x] === EMPTY) {
      input[y - 1][x] = input[y][x];
      input[y][x] = EMPTY;
      return true;
    }
    return false;
  };

  const moveWest = (x, y) => {
    if (x === 0) return false;
    if (input[y][x - 1] === EMPTY) {
      input[y][x - 1] = input[y][x];
      input[y][x] = EMPTY;
      return true;
    }
    return false;
  };

  const moveSouth = (x, y) => {
    if (y === height - 1) return false;
    if (input[y + 1][x] === EMPTY) {
      input[y + 1][x] = input[y][x];
      input[y][x] = EMPTY;
      return true;
    }
    return false;
  };

  const moveEast = (x, y) => {
    if (x === width - 1) return false;
    if (input[y][x + 1] === EMPTY) {
      input[y][x + 1] = input[y][x];
      input[y][x] = EMPTY;
      return true;
    }
    return false;
  };

  const directions = ['NORTH', 'WEST', 'SOUTH', 'EAST'];

  const tilt = (direction) => {
    let CAN_STILL_MOVE = true;
    while (CAN_STILL_MOVE) {
      CAN_STILL_MOVE = false;

      switch (direction) {
        case 'NORTH': {
          for (let y = 1; y < height; y++) {
            for (let x = 0; x < width; x++) {
              const elt = input[y][x];
              if (elt !== ROUNDED) continue;
              if (moveNorth(x, y)) CAN_STILL_MOVE = true;
            }
          }
          break;
        }
        case 'WEST': {
          for (let x = 1; x < width; x++) {
            for (let y = 0; y < height; y++) {
              const elt = input[y][x];
              if (elt !== ROUNDED) continue;
              if (moveWest(x, y)) CAN_STILL_MOVE = true;
            }
          }
          break;
        }
        case 'SOUTH': {
          for (let y = height - 2; y >= 0; y--) {
            for (let x = 0; x < width; x++) {
              const elt = input[y][x];
              if (elt !== ROUNDED) continue;
              if (moveSouth(x, y)) CAN_STILL_MOVE = true;
            }
          }
          break;
        }
        case 'EAST':
          {
            for (let x = width - 2; x >= 0; x--) {
              for (let y = 0; y < height; y++) {
                const elt = input[y][x];
                if (elt !== ROUNDED) continue;
                if (moveEast(x, y)) CAN_STILL_MOVE = true;
              }
            }
          }
          break;
      }
    }
  };

  const CYCLE_COUNT = 1_000_000_000;
  const cycles = [];
  for (let i = 0; i < CYCLE_COUNT; i++) {
    directions.forEach((d) => tilt(d));

    // retrieve pos of all rounded rock
    const roundedPos = input.reduce(
      (pos, row, y) =>
        row.reduce((_pos, elt, x) => {
          if (elt === ROUNDED) {
            _pos.push(`[x:${x},y:${y}]`);
          }
          return _pos;
        }, pos),
      []
    );
    const cycleString = roundedPos.join('');
    const cycleIndex = cycles.findIndex((s) => s === cycleString);

    // we found a cycle
    if (cycleIndex > -1) {
      const cycleLength = i - cycleIndex;
      const remainingCycleCount = CYCLE_COUNT - i;
      i += cycleLength * Math.floor(remainingCycleCount / cycleLength);
    }
    cycles.push(cycleString);
  }

  const result = input.reduce((c, row, y) => row.reduce((c, elt) => (c += elt === ROUNDED ? height - y : 0), c), 0);
  return result;
}

//const input1 = readInput(`d${DAY}-sample.txt`);
const input1 = readInput(`d${DAY}-input.txt`);
ElapsedTime('Part 1', part1, input1);
//const input2 = readInput(`d${DAY}-sample.txt`);
const input2 = readInput(`d${DAY}-input.txt`);
ElapsedTime('Part 2', part2, input2);

// s
