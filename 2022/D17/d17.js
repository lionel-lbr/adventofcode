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

function solve(input, MAX_ROCK_COUNT) {
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
  let height = 0;
  while (count < MAX_ROCK_COUNT) {
    // add a new rock
    const rock = ROCKS[count % ROCKS.length];
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
      if (gazIndex === 0) {
        console.log('gazIndex is 0');
      }
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
        console.log(`Freeze rock - gazIndex ${gazIndex} count ${(count + 1) % ROCKS.length}`);
        break;
      }
    }

    topRowIndex = Math.min(topRowIndex, rockY);
    count += 1;

    if (gazIndex === 17 && count % ROCKS.length === 0) {
      const cycleCount = Math.floor(MAX_ROCK_COUNT / count);
      const cycleReminderCount = MAX_ROCK_COUNT - cycleCount * count;
      height += (map.length - 1 - topRowIndex) * cycleCount;
      count = cycleCount * count;
      console.log(`${cycleCount} - ${cycleReminderCount}`);
      map.splice(0, map.length - 1);
      topRowIndex = 0;
    }
  }

  return map.length + height - topRowIndex;
}

//const input = readInput(`d${DAY}-sample.txt`);
const input = readInput(`d${DAY}-input.txt`);
console.log(`Part 1: ${solve(input, 2022)}`);
console.log(`Part 2: ${solve(input, 1_000_000_000_000)}`);
