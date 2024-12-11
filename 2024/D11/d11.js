/*
Advent Of Code 2024
Day 11: Plutonian Pebbles part 1 & 2

https://adventofcode.com/2024/day/11
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2024';
const DAY = '11';

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
      .map((l) => l.split(' ').map((v) => parseInt(v)));
    return input;
  };
  try {
    return readRawInput();
  } catch (err) {
    console.error(err);
  }
}

function part1(input, blink = 25) {
  const lruCache = new Map();
  const DFS = (blink, currentList) => {
    const k = JSON.stringify({ blink, currentList });
    if (lruCache.has(k)) return lruCache.get(k);

    if (blink === 0) return 1;

    blink -= 1;
    let l = 0;
    for (const v of currentList) {
      if (v === 0) {
        l += DFS(blink, [1]);
        continue;
      }

      const s = `${v}`;
      if (s.length % 2 === 0) {
        const left = parseInt(s.slice(0, s.length / 2));
        const right = parseInt(s.slice(s.length / 2, s.length));
        l += DFS(blink, [left]);
        l += DFS(blink, [right]);
        continue;
      }

      l += DFS(blink, [v * 2024]);
    }

    lruCache.set(k, l);
    return l;
  };

  let result = parseAndBreak(blink, input[0]);
  return { result };
}

function part2(input) {
  let { result } = part1(input, 75);
  return { result };
}

//const input = readInput(`d${DAY}-sample.txt`);
const input = readInput(`d${DAY}-puzzle-input.txt`);
elapsedTime('Part 1', part1, input);
elapsedTime('Part 2', part2, input);
