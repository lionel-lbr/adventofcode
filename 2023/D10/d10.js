/*
Advent Of Code 2023
Day 10: Pipe Maze part 1 & 2

https://adventofcode.com/2023/day/10
*/

const fs = require('fs');
const path = require('path');
const { off } = require('process');

const YEAR = '2023';
const DAY = '10';

function readInput(filename) {
  const readRawInput = () => {
    const data = fs.readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename));
    const input = data
      .toString()
      .split('\n')
      .filter((l) => l != '')
      .map((l) => l.split(''));
    return input;
  };

  const parseALine = (line) => {};

  try {
    return readRawInput();
  } catch (err) {
    console.error(err);
  }
}
const NORTH = 1;
const EAST = 2;
const SOUTH = 3;
const WEST = 4;

const NTOS = '|';
const WTOE = '-';
const NTOE = 'L';
const NTOW = 'J';
const STOW = '7';
const STOE = 'F';
const GROUND = '.';
const START = 'S';

function followTheLoop(direction) {
  let [posX, posY] = [startPosX, startPosY];
  const loopEdges = [{ posX, posY, tile: START, direction }];
  switch (direction) {
    case NORTH:
      posY -= 1;
      break;
    case SOUTH:
      posY += 1;
      break;
    case EAST:
      posX += 1;
      break;
    case WEST:
      posX -= 1;
      break;
  }
  let loopLength = 1;
  let currentDirection = direction;

  while (true) {
    let tile = input[posY][posX];
    if (tile === START) return loopEdges;
    loopEdges.push({ posX, posY, tile, direction: currentDirection });

    switch (currentDirection) {
      case NORTH:
        switch (tile) {
          case NTOS:
            posY -= 1;
            break;
          case STOE:
            posX += 1;
            currentDirection = EAST;
            break;
          case STOW:
            posX -= 1;
            currentDirection = WEST;
            break;
          default:
            throw new Error(`Invalid tile:${tile} at posX:${posX}-posY:${posY} direction:${currentDirection}`);
        }
        break;
      case EAST:
        switch (tile) {
          case WTOE:
            posX += 1;
            break;
          case NTOW:
            posY -= 1;
            currentDirection = NORTH;
            break;
          case STOW:
            posY += 1;
            currentDirection = SOUTH;
            break;
          default:
            throw new Error(`Invalid tile:${tile} at posX:${posX}-posY:${posY} direction:${currentDirection}`);
        }
        break;
      case SOUTH:
        switch (tile) {
          case NTOS:
            posY += 1;
            break;
          case NTOE:
            posX += 1;
            currentDirection = EAST;
            break;
          case NTOW:
            posX -= 1;
            currentDirection = WEST;
            break;
          default:
            throw new Error(`Invalid tile:${tile} at posX:${posX}-posY:${posY} direction:${currentDirection}`);
        }
        break;
      case WEST:
        switch (tile) {
          case WTOE:
            posX -= 1;
            break;
          case NTOE:
            posY -= 1;
            currentDirection = NORTH;
            break;
          case STOE:
            posY += 1;
            currentDirection = SOUTH;
            break;
          default:
            throw new Error(`Invalid tile:${tile} at posX:${posX}-posY:${posY} direction:${currentDirection}`);
        }
        break;
    }
  }
}

function findInitialDirection() {
  const initialDirection = [NORTH, EAST, SOUTH, WEST].find((d) => {
    switch (d) {
      case NORTH: {
        if (startPosY === 0) return false;
        const t = input[startPosY - 1][startPosX];
        if ([WTOE, NTOE, NTOW].includes(t)) return false;
        return true;
      }
      case SOUTH: {
        if (startPosY === height - 1) return false;
        const t = input[startPosY + 1][startPosX];
        if ([WTOE, STOE, STOW].includes(t)) return false;
        return true;
      }
      case WEST: {
        if (startPosX === 0) return false;
        const t = input[startPosY][startPosX - 1];
        if ([NTOS, NTOW, STOW].includes(t)) return false;
        return true;
      }
      case EAST: {
        if (startPosX === width - 1) return false;
        const t = input[startPosY][startPosX + 1];
        if ([NTOS, NTOE, STOE].includes(t)) return false;
        return true;
      }
    }
  });
  return initialDirection;
}

function part1(input) {
  console.log(`${startPosX}:${startPosY} => ${input[startPosY][startPosX]}`);
  const direction = findInitialDirection();
  const loopEdges = followTheLoop(direction);
  return loopEdges.length / 2;
}

function part2(input) {
  console.log(`${startPosX}:${startPosY} => ${input[startPosY][startPosX]}`);
  const direction = findInitialDirection();
  const loopEdges = followTheLoop(direction);

  // clear the map
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (loopEdges.some(({ posX, posY }) => posX === x && posY === y)) {
        // FIXME need logic to determine the what to replace the S with.
        if (input[y][x] === START) input[y][x] = NTOE;
        continue;
      }
      input[y][x] = '.';
    }
  }

  // display map
  for (let y = 0; y < height; y++) {
    console.log(input[y].join(''));
  }

  // go through the loop positions and count '.' between tiles
  let insideDotCount = 0;
  for (let y = 0; y < height; y++) {
    let to_count = false;
    for (let x = 0; x < width; x++) {
      if (loopEdges.some(({ posX, posY }) => posX === x && posY === y)) {
        const tile = input[y][x];
        if ([NTOS, NTOE, NTOW].includes(tile)) to_count = !to_count;
      } else {
        if (to_count) insideDotCount++;
      }
    }
  }

  return insideDotCount;
}

const input = readInput(`d${DAY}-sample2.txt`);
//const input = readInput(`d${DAY}-input.txt`);
const height = input.length;
const width = input[0].length;
const startPosY = input.findIndex((l) => l.some((e) => e === 'S'));
const startPosX = input[startPosY].findIndex((e) => e === 'S');
console.log(`Part 1: ${part1(input)}`);
console.log(`Part 2: ${part2(input)}`);
