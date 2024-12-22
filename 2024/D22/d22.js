/*
Advent Of Code 2024
Day 22: Monkey Market part 1 & 2

https://adventofcode.com/2024/day/22
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2024';
const DAY = '22';

function readInput(filename) {
  const readRawInput = () => {
    const data = fs.readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename));
    const input = data
      .toString()
      .split('\n')
      .filter((l) => l.length > 0)
      .map((l) => parseInt(l));
    return input;
  };
  try {
    return readRawInput();
  } catch (err) {
    console.error(err);
  }
}

const getNextSecret = (n) => {
  const r1 = n * 64;
  const r2 = BigInt(n) ^ BigInt(r1);
  const r3 = Number(r2) % 16777216;

  const r4 = Math.floor(r3 / 32);
  const r5 = BigInt(r3) ^ BigInt(r4);
  const r6 = Number(r5) % 16777216;

  const r7 = r6 * 2048;
  const r8 = BigInt(r6) ^ BigInt(r7);
  const r9 = Number(r8) % 16777216;
  return r9;
};

function solution1(input) {
  for (let j = 0; j < 2000; j++) {
    for (let i = 0; i < input.length; i++) {
      const n = input[i];
      const ns = getNextSecret(n);
      input[i] = ns;
    }
  }

  let result = input.reduce((r, n) => (r += n), 0);
  return result;
}

function solution2(input) {
  const secretSequences = input.map((n) => [{ iter: 0, secret: n, price: n % 10 }]);
  const sequences = new Map();
  for (let j = 0; j < 2000; j++) {
    for (let i = 0; i < input.length; i++) {
      const nextSecret = getNextSecret(input[i]);

      input[i] = nextSecret;
      const secretSequence = secretSequences[i];

      // calculate new price and change
      const price = nextSecret % 10;
      const change = price - secretSequence[secretSequence.length - 1].price;
      secretSequence.push({ iter: j + 1, secret: nextSecret, price, change });

      // generate sequence of the last four changes
      if (secretSequence.length > 4) {
        const sequence = secretSequence
          .slice(secretSequence.length - 4, secretSequence.length)
          .map((s) => s.change)
          .join(',');
        if (!sequences.has(sequence)) sequences.set(sequence, new Map());
        const sMap = sequences.get(sequence);
        // take into account only the first occurrence of the sequence for a secret
        if (!sMap.has(i)) sMap.set(i, { secretIndex: i, secretIter: j + 1, price, secret: nextSecret });
      }
    }
  }

  let bananas = 0;
  for (const secretIndexes of [...sequences.values()]) {
    const sequence = [...secretIndexes.values()];
    bananas = Math.max(
      bananas,
      sequence.reduce((r, { price }) => r + price, 0)
    );
  }
  let result = bananas;
  return result;
}

function part1(mode) {
  const input = readInput(`d${DAY}-${mode}.txt`);
  const startTime = performance.now();
  const result = solution1(input);
  const elapsed = performance.now() - startTime;
  console.log(`Part 1 ${mode} time: ${Math.floor(elapsed / 60000)}:${Math.floor((elapsed % 60000) / 1000)}:${Math.floor(elapsed % 1000)}`);
  console.log(`Part 1 ${mode} result: ${result}`);
}

function part2(mode) {
  const input = readInput(`d${DAY}-${mode}.txt`);

  const startTime = performance.now();
  const result = solution2(input);
  const elapsed = performance.now() - startTime;
  console.log(`Part 2 ${mode} time: ${Math.floor(elapsed / 60000)}:${Math.floor((elapsed % 60000) / 1000)}:${Math.floor(elapsed % 1000)}`);
  console.log(`Part 2 ${mode} result: ${result}`);
}

part1('sample');
part1('input');
part2('sample2');
part2('input');
