/*
Advent Of Code 2023
Day 17: Clumsy Crucible part 1 & 2

https://adventofcode.com/2023/day/17
*/

const fs = require('fs');
const path = require('path');
const table = require('table');

const YEAR = '2023';
const DAY = '17';

function readInput(filename) {
  const readRawInput = () => {
    const data = fs.readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename));
    const input = data
      .toString()
      .split('\n')
      .filter((l) => l.length > 0)
      .map((l, y) =>
        l.split('').map((e, x) => ({
          x,
          y,
          weight: parseInt(e),
          distanceFromStart: Infinity,
        }))
      );
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

const NORTH = 'NORTH';
const EAST = 'EAST';
const SOUTH = 'SOUTH';
const WEST = 'WEST';
const NONE = 'NONE';

const DIRECTIONS = {
  NORTH: (x, y) => [
    { x, y: y - 1, direction: NORTH },
    { x: x + 1, y, direction: EAST },
    { x: x - 1, y, direction: WEST },
  ],
  EAST: (x, y) => [
    { x: x + 1, y, direction: EAST },
    { x, y: y + 1, direction: SOUTH },
    { x, y: y - 1, direction: NORTH },
  ],
  SOUTH: (x, y) => [
    { x, y: y + 1, direction: SOUTH },
    { x: x + 1, y, direction: EAST },
    { x: x - 1, y, direction: WEST },
  ],
  WEST: (x, y) => [
    { x: x - 1, y, direction: WEST },
    { x, y: y + 1, direction: SOUTH },
    { x, y: y - 1, direction: NORTH },
  ],
};

function part1(input, minStepCount = 1, maxStepCount = 3) {
  const HEIGHT = input.length;
  const WIDTH = input[0].length;

  const getCandidates = ({ x, y, direction, stepCount, distanceFromStart }) => {
    const allCandidates = DIRECTIONS[direction](x, y);
    const candidates = [];
    for (const candidate of allCandidates) {
      const { x, y, direction: d } = candidate;
      if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) continue;
      if (d === direction && stepCount < maxStepCount) {
        candidate.stepCount = stepCount + 1;
        candidate.distanceFromStart = distanceFromStart + input[y][x].weight;
        candidates.push(candidate);
        continue;
      }
      if (d !== direction && stepCount >= minStepCount) {
        candidate.stepCount = 1;
        candidate.distanceFromStart = distanceFromStart + input[y][x].weight;
        candidates.push(candidate);
        continue;
      }
    }
    return candidates;
  };

  // need to maintain a list of "visited" iteration for combination of coordinate, direction and step counts
  // use object properties (hashmap) for faster access to visited node list
  visitedCandidate = {};
  const addToVisited = ({ x, y, direction, stepCount }) => {
    const k = `${x},${y},${direction},${stepCount}`;
    visitedCandidate[k] = true;
  };

  const isVisited = ({ x, y, direction, stepCount }) => {
    const k = `${x},${y},${direction},${stepCount}`;
    if (visitedCandidate[k]) return true;
    return false;
  };

  candidates = [];
  const startPos1 = { x: 0, y: 0, direction: EAST, stepCount: 1, distanceFromStart: 0 };
  const startPos2 = { x: 0, y: 0, direction: SOUTH, stepCount: 1, distanceFromStart: 0 };
  const endPos = { x: WIDTH - 1, y: HEIGHT - 1 };
  candidates.push(startPos1);
  addToVisited(startPos1);
  candidates.push(startPos2);
  addToVisited(startPos2);

  while (candidates.length > 0) {
    // sort descending
    candidates.sort((a, b) => b.distanceFromStart - a.distanceFromStart);
    const currentPos = candidates.pop(); // pop the one with smallest distance from start
    //console.log('trying:', currentPos);

    // if final destination
    if (currentPos.x === endPos.x && currentPos.y === endPos.y) {
      // necessary for part 2
      if (!(currentPos.stepCount >= minStepCount && currentPos.stepCount <= maxStepCount)) continue;
      return currentPos.distanceFromStart;
    }

    const possibleCandidates = getCandidates(currentPos);
    for (const possibleCandidate of possibleCandidates) {
      if (!isVisited(possibleCandidate)) {
        addToVisited(possibleCandidate);
        candidates.push(possibleCandidate);
      }
    }
  }
}

function part2(input) {
  return part1(input, 4, 10);
}

// const input = readInput(`d${DAY}-sample.txt`);
//const input = readInput(`d${DAY}-sample2.txt`);
const input = readInput(`d${DAY}-input.txt`);
ElapsedTime('Part 1', part1, input);
ElapsedTime('Part 2', part2, input);
