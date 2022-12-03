/*
Advent Of Code 2022
Day 2: Rock Paper Scissors part 1 & 2

https://adventofcode.com/2022/day/2
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2022';
const DAY = '02';

function readInput(filename) {
  const readRawIntput = () => {
    const data = fs.readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename));
    const lines = data
      .toString()
      .split(`\n`)
      .filter((l) => l);

    return lines;
  };

  try {
    const lines = readRawIntput();
    return lines.map((l) => ({ player1: l[0], player2: l[2] }));
  } catch (err) {
    console.error(err);
  }
}

const WIN_PAIRS = { A: 'Y', B: 'Z', C: 'X' };
const LOOSE_PAIRS = { A: 'Z', B: 'X', C: 'Y' };
const DRAW_PAIRS = { A: 'X', B: 'Y', C: 'Z' };

const POINTS = { X: 1, Y: 2, Z: 3 };

function part1(input) {
  const score = input.reduce((score, { player1, player2 }) => {
    if (WIN_PAIRS[player1] === player2) return score + 6 + POINTS[player2];
    if (DRAW_PAIRS[player1] === player2) return score + 3 + POINTS[player2];
    return score + POINTS[player2];
  }, 0);
  return score;
}

function part2(input) {
  const score = input.reduce((score, { player1, player2 }) => {
    switch (player2) {
      case 'X': // loose
        return score + POINTS[LOOSE_PAIRS[player1]];
      case 'Y': // draw
        return score + 3 + POINTS[DRAW_PAIRS[player1]];
      case 'Z': // win
        return score + 6 + POINTS[WIN_PAIRS[player1]];
    }
  }, 0);
  return score;
}

const input = readInput(`d${DAY}-input.txt`);
console.log(`Part 1: ${part1(input)}`);
console.log(`Part 2: ${part2(input)}`);
