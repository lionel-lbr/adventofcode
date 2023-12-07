/*
Advent Of Code 2023
Day 3: Gear Ratios part 1 & 2

https://adventofcode.com/2023/day/3
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2023';
const DAY = '03';

function readInput(filename) {
  const readRawIntput = () => {
    const data = fs.readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename));
    const input = data
      .toString()
      .split('\n')
      .map((l) => l.split(''));
    return input;
  };

  const parseALine = (line) => {};

  try {
    return readRawIntput();
  } catch (err) {
    console.error(err);
  }
}

const isDigit = (c) => ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(c);

function part1(input) {
  const height = input.length;
  const width = input[0].length;

  const isValidPartNumber = (coordinates) => {
    const result = coordinates.some(({ x, y }) => {
      if (x < 0 || x >= width || y < 0 || y >= height) return false;
      const c = input[y][x];
      if (c === '.' || isDigit(c)) return false;
      return true;
    });
    return result;
  };

  const validPartNumbers = [];
  for (let y = 0; y < height; y++) {
    let surroundingCoordinates = [];
    let partNumber = 0;
    let foundDigit = false;

    for (let x = 0; x < width; x++) {
      const current = input[y][x];
      if (isDigit(current)) {
        if (!foundDigit) {
          foundDigit = true;
          surroundingCoordinates = [
            { x: x - 1, y: y - 1 },
            { x, y: y - 1 },
            { x: x - 1, y },
            { x: x - 1, y: y + 1 },
            { x, y: y + 1 },
          ];

          partNumber = parseInt(current);
          continue;
        }
        surroundingCoordinates.push(
          ...[
            { x, y: y - 1 },
            { x, y: y + 1 },
          ]
        );
        partNumber = partNumber * 10 + parseInt(current);
        continue;
      }

      // on a "." or a symbol, end of part number parsing
      if (foundDigit) {
        surroundingCoordinates.push(
          ...[
            { x, y: y - 1 },
            { x, y },
            { x, y: y + 1 },
          ]
        );
        if (isValidPartNumber(surroundingCoordinates)) validPartNumbers.push(partNumber);
        foundDigit = false;
      }
    }
    if (foundDigit && isValidPartNumber(surroundingCoordinates)) validPartNumbers.push(partNumber);
  }

  const result = validPartNumbers.reduce((r, n) => (n += r), 0);
  return result;
}

function part2(input) {
  const height = input.length;
  const width = input[0].length;

  // is valid if adjacent to a '*'
  const isValidPartNumber = (coordinates) => {
    let starPositionAsKey = '';
    const result = coordinates.some(({ x, y }) => {
      if (x < 0 || x >= width || y < 0 || y >= height) return false;
      const current = input[y][x];
      if (current !== '*') return false;
      starPositionAsKey = `x:${x}-y:${y}`;
      return true;
    });
    if (result) return { result, starPositionAsKey };
    return { result };
  };

  const validPartNumbers = new Map();
  for (let y = 0; y < height; y++) {
    let surroundingCoordinates = [];
    let partNumber = 0;
    let foundDigit = false;

    for (let x = 0; x < width; x++) {
      const current = input[y][x];
      if (isDigit(current)) {
        if (!foundDigit) {
          foundDigit = true;
          surroundingCoordinates = [
            { x: x - 1, y: y - 1 },
            { x, y: y - 1 },
            { x: x - 1, y },
            { x: x - 1, y: y + 1 },
            { x, y: y + 1 },
          ];

          partNumber = parseInt(current);
          continue;
        }
        surroundingCoordinates.push(
          ...[
            { x, y: y - 1 },
            { x, y: y + 1 },
          ]
        );
        partNumber = partNumber * 10 + parseInt(current);
        continue;
      }

      // on a "." or a symbol, end of part number parsing
      if (foundDigit) {
        surroundingCoordinates.push(
          ...[
            { x, y: y - 1 },
            { x, y },
            { x, y: y + 1 },
          ]
        );
        const { result, starPositionAsKey } = isValidPartNumber(surroundingCoordinates);
        if (result) {
          validPartNumbers.has(starPositionAsKey)
            ? validPartNumbers.get(starPositionAsKey).push(partNumber)
            : validPartNumbers.set(starPositionAsKey, [partNumber]);
        }

        foundDigit = false;
      }
    }
    if (foundDigit) {
      const { result, starPositionAsKey } = isValidPartNumber(surroundingCoordinates);
      if (result) {
        validPartNumbers.has(starPositionAsKey)
          ? validPartNumbers.get(starPositionAsKey).push(partNumber)
          : validPartNumbers.set(starPositionAsKey, [partNumber]);
      }
    }
  }

  const result = [...validPartNumbers.entries()].reduce((r, [k, v]) => {
    if (v.length == 2) return r + v[0] * v[1];
    return r;
  }, 0);
  return result;
}

//const input = readInput(`d${DAY}-sample.txt`);
const input = readInput(`d${DAY}-input.txt`);
console.log(`Part 1: ${part1(input)}`);
console.log(`Part 2: ${part2(input)}`);
