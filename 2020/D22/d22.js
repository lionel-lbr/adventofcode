/*
Advent Of Code 2020
Day 22: Crab Combat part 1 & 2

https://adventofcode.com/2020/day/22
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2020';
const DAY = '22';

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
    const decks = [];
    const lines = readRawIntput();
    let currentDeck = null;
    lines.forEach((line) => {
      if (line.startsWith('Player')) {
        currentDeck = [];
        decks.push(currentDeck);
      } else currentDeck.push(Number(line));
    });

    return decks;
  } catch (err) {
    console.error(err);
  }
}

function part1(decks) {
  const [deck1, deck2] = decks;

  while (deck1.length > 0 && deck2.length > 0) {
    const c1 = deck1.shift();
    const c2 = deck2.shift();

    if (c1 > c2) {
      deck1.push(c1);
      deck1.push(c2);
    } else {
      deck2.push(c2);
      deck2.push(c1);
    }
  }

  const score1 = deck1.reduce((score, c, index) => score + c * (deck1.length - index), 0);
  const score2 = deck2.reduce((score, c, index) => score + c * (deck2.length - index), 0);

  return Math.max(score1, score2);
}

function part2(decks) {
  const game = (deck1, deck2) => {
    const lruCache = new Map();
    while (deck1.length > 0 && deck2.length > 0) {
      // check previous combinaison
      const k = `${deck1.join(',')}-${deck2.join(',')}`;
      if (lruCache.has(k)) return 1;
      lruCache.set(k, true);

      const c1 = deck1.shift();
      const c2 = deck2.shift();

      // go into sub-game
      if (deck1.length >= c1 && deck2.length >= c2) {
        const sDeck1 = [...deck1.slice(0, c1)];
        const sDeck2 = [...deck2.slice(0, c2)];

        const r = game(sDeck1, sDeck2);

        if (r == 1) {
          deck1.push(c1);
          deck1.push(c2);
        } else {
          deck2.push(c2);
          deck2.push(c1);
        }
        continue;
      }

      if (c1 > c2) {
        deck1.push(c1);
        deck1.push(c2);
      } else {
        deck2.push(c2);
        deck2.push(c1);
      }
    }

    if (deck1.length == 0) return 2;
    return 1;
  };

  const [deck1, deck2] = decks;
  game(deck1, deck2);

  const score1 = deck1.reduce((score, c, index) => score + c * (deck1.length - index), 0);
  const score2 = deck2.reduce((score, c, index) => score + c * (deck2.length - index), 0);
  return Math.max(score1, score2);
}

//const decks1 = readInput(`d${DAY}-sample.txt`);
const decks1 = readInput(`d${DAY}-input.txt`);
console.log(`Part 1: ${part1(decks1)}`);
//const decks2 = readInput(`d${DAY}-sample.txt`);
const decks2 = readInput(`d${DAY}-input.txt`);
console.log(`Part 2: ${part2(decks2)}`);
