/*
Advent Of Code 2024
Day 5: Print Queue part 1 & 2

https://adventofcode.com/2024/day/5
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2024';
const DAY = '05';

function elapsedTime(name, fct, input) {
  const startTime = performance.now();
  const result = fct(input);
  const elapsed = performance.now() - startTime;
  console.log(`${name} time: ${Math.floor(elapsed / 60000)}:${Math.floor((elapsed % 60000) / 1000)}:${Math.floor(elapsed % 1000)}`);
  console.log(`${name} result: ${result}`);
}

function readInput(filename) {
  const readRawInput = () => {
    const data = fs.readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename));
    const rules = {};
    const updates = [];
    let addUpdate = false;
    const input = data.toString().split('\n');

    for (const l of input) {
      if ((l === '') & !addUpdate) {
        addUpdate = true;
        continue;
      }
      if (addUpdate) {
        if (l === '') continue;
        updates.push(l.split(',').map((v) => parseInt(v)));
        continue;
      }
      const [v1, v2] = l.split('|').map((v) => parseInt(v));
      if (!rules[v1]) rules[v1] = [];
      rules[v1].push(v2);
    }
    return [rules, updates];
  };
  try {
    return readRawInput();
  } catch (err) {
    console.error(err);
  }
}

function part1(input) {
  const [rules, updates] = input;

  const isValidUpdate = (l) => {
    if (l.length === 1) return true;
    const firstElt = l[0];
    const rest = l.slice(1);
    if (!rest.every((e) => rules[firstElt] && rules[firstElt].includes(e))) return false;
    return isValidUpdate(rest);
  };

  const validUpdates = updates.filter((update) => isValidUpdate(update));
  const result = validUpdates.reduce((r, u) => r + u[Math.floor(u.length / 2)], 0);
  return result;
}

function part2(input) {
  const [rules, updates] = input;

  const isValidUpdate = (l) => {
    if (l.length === 1) return true;
    const firstElt = l[0];
    const rest = l.slice(1);
    if (!rest.every((e) => rules[firstElt] && rules[firstElt].includes(e))) return false;
    return isValidUpdate(rest);
  };

  const badUpdates = updates.filter((update) => !isValidUpdate(update));

  for (const bu of badUpdates) {
    // permute all elements
    for (let i = 0; i < bu.length; i++) {
      for (let j = i; j < bu.length; j++) {
        const e = bu[j];
        bu.splice(j, 1); // remove it from index J
        bu.splice(i, 0, e); // add it back at index i
        if (bu.slice(i + 1).every((e) => rules[bu[i]] && rules[bu[i]].includes(e))) {
          break;
        }
      }
    }
  }
  const result = badUpdates.reduce((r, u) => r + u[Math.floor(u.length / 2)], 0);
  return result;
}

const input = readInput(`d${DAY}-sample.txt`);
//const input = readInput(`d${DAY}-input.txt`);
elapsedTime('Part 1', part1, input);
elapsedTime('Part 2', part2, input);
