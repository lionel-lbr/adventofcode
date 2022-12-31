/*
Advent Of Code 2022
Day 17: Pyroclastic Flow part 1 & 2

https://adventofcode.com/2022/day/17
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2022';
const DAY = '17';

function readInput(filename) {
  return fs
    .readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename))
    .toString()
    .split(`\n`)
    .filter((l) => l)
    .pop()
    .split('');
}

const ROCKS = [
  [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 3, y: 0 },
  ],
  [
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
    { x: 1, y: 2 },
  ].reverse(),
  [
    { x: 2, y: 0 },
    { x: 2, y: 1 },
    { x: 0, y: 2 },
    { x: 1, y: 2 },
    { x: 2, y: 2 },
  ].reverse(),
  [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: 2 },
    { x: 0, y: 3 },
  ].reverse(),
  [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
  ].reverse(),
];

function findSubset(list) {
  for (let i = list.length - 1; i > 1; i--) {
    const index1 = i;
    const subArr1 = list.slice(index1, list.length);
    const index2 = i - subArr1.length;
    if (index2 < 0) return null;
    const subArr2 = list.slice(index2, index2 + subArr1.length);
    let k = 0;
    while (k < subArr1.length) {
      if (subArr1[k].gazIndex !== subArr2[k].gazIndex) break;
      k++;
    }
    if (k === subArr1.length) {
      return [index2, index1];
    }
  }
  return null;
}

function solveButForce(input, MAX_ROCK_COUNT) {
  let rockY = 0;
  let rockX = 3;

  const canMoveRight = (rock) => {
    for ({ x, y } of rock) {
      if (map[rockY + y][rockX + x + 1] !== '.') return false;
    }
    return true;
  };

  const canMoveLeft = (rock) => {
    for ({ x, y } of rock) {
      if (map[rockY + y][rockX + x - 1] !== '.') return false;
    }
    return true;
  };

  const canMoveDown = (rock) => {
    for ({ x, y } of rock) {
      if (map[rockY + y + 1][rockX + x] !== '.') return false;
    }
    return true;
  };

  const map = ['|-------|'.split('')];

  let count = 0;
  let gazIndex = -1;
  let topRowIndex = 0;

  while (count < MAX_ROCK_COUNT) {
    // add a new rock
    const rockIndex = count % ROCKS.length;
    const rock = ROCKS[rockIndex];
    const newBlankRowCount = rock[0].y + 1 + 3;
    if (newBlankRowCount < topRowIndex) {
      rockY = topRowIndex - newBlankRowCount;
    } else if (newBlankRowCount > topRowIndex) {
      for (let i = 0; i < newBlankRowCount - topRowIndex; i++) {
        map.splice(0, 0, '#.......#'.split(''));
      }
      topRowIndex += newBlankRowCount - topRowIndex;
      rockY = 0;
    } else rockY = 0;

    rockX = 3;
    while (1) {
      gazIndex = (gazIndex + 1) % input.length;
      const direction = input[gazIndex];
      if (direction === '>' && canMoveRight(rock)) rockX += 1;
      else if (direction === '<' && canMoveLeft(rock)) rockX -= 1;
      if (canMoveDown(rock)) {
        rockY += 1;
      } else {
        // "freeze" the block
        for ({ x, y } of rock) {
          map[rockY + y][rockX + x] = '#';
        }
        break;
      }
    }

    topRowIndex = Math.min(topRowIndex, rockY);
    count += 1;
  }

  return map.length - topRowIndex - 1;
}

function solveWithCycleDetection(input, MAX_ROCK_COUNT) {
  let rockY = 0;
  let rockX = 3;

  const canMoveRight = (rock) => {
    for ({ x, y } of rock) {
      if (map[rockY + y][rockX + x + 1] !== '.') return false;
    }
    return true;
  };

  const canMoveLeft = (rock) => {
    for ({ x, y } of rock) {
      if (map[rockY + y][rockX + x - 1] !== '.') return false;
    }
    return true;
  };

  const canMoveDown = (rock) => {
    for ({ x, y } of rock) {
      if (map[rockY + y + 1][rockX + x] !== '.') return false;
    }
    return true;
  };

  const map = ['|-------|'.split('')];

  let count = 0;
  let gazIndex = -1;
  let topRowIndex = 0;

  let foundCycle = false;
  let rowCount = 0;
  const rockCycle = new Map();
  for (i in ROCKS) rockCycle.set(Number(i), []);

  while (count < MAX_ROCK_COUNT) {
    // add a new rock
    const rockIndex = count % ROCKS.length;
    const rock = ROCKS[rockIndex];
    const newBlankRowCount = rock[0].y + 1 + 3;
    if (newBlankRowCount < topRowIndex) {
      rockY = topRowIndex - newBlankRowCount;
    } else if (newBlankRowCount > topRowIndex) {
      for (let i = 0; i < newBlankRowCount - topRowIndex; i++) {
        map.splice(0, 0, '#.......#'.split(''));
      }
      topRowIndex += newBlankRowCount - topRowIndex;
      rockY = 0;
    } else rockY = 0;

    rockX = 3;
    while (1) {
      gazIndex = (gazIndex + 1) % input.length;
      const direction = input[gazIndex];
      if (direction === '>' && canMoveRight(rock)) rockX += 1;
      else if (direction === '<' && canMoveLeft(rock)) rockX -= 1;
      if (canMoveDown(rock)) {
        rockY += 1;
      } else {
        // "freeze" the block
        for ({ x, y } of rock) {
          map[rockY + y][rockX + x] = '#';
        }
        break;
      }
    }

    topRowIndex = Math.min(topRowIndex, rockY);
    count += 1;

    // will try to find a cycle within gazIndex and rock type
    // record step in order to detect cycle
    rockCycle.get(rockIndex).push({ gazIndex, rockCount: count, rowCount: map.length - 1 - topRowIndex });
    if (!foundCycle) {
      // get the list of gazIndex for a given rock type
      const l = rockCycle.get(rockIndex);
      // check for cycle
      const subsetIndexes = findSubset(l);
      if (subsetIndexes !== null) {
        foundCycle = true;
        const [startCycleIndex, endCycleIndex] = subsetIndexes;
        const cycleRowCount = l[endCycleIndex].rowCount - l[startCycleIndex].rowCount;
        const cycleRockCount = l[endCycleIndex].rockCount - l[startCycleIndex].rockCount;
        const cycleCount = Math.floor((MAX_ROCK_COUNT - count) / cycleRockCount);
        count += cycleCount * cycleRockCount;
        rowCount = cycleRowCount * cycleCount;
      }
    }
  }
  return map.length - topRowIndex - 1 + rowCount;
}

const input = readInput(`d${DAY}-sample.txt`);
console.log(`Sample input Part 1: ${solveButForce(input, 2022)}`);
console.log(`Sample input Part 1 (optimized): ${solveWithCycleDetection(input, 2022)}`);
console.log(`Sample input Part 2: ${solveWithCycleDetection(input, 1_000_000_000_000)}`);

const input2 = readInput(`d${DAY}-input.txt`);
console.log(`Part 1: ${solveButForce(input2, 2022)}`);
console.log(`Part 1 (optimized): ${solveWithCycleDetection(input2, 2022)}`);
console.log(`Part 2: ${solveWithCycleDetection(input2, 1_000_000_000_000)}`);
