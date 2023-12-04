/*
Advent Of Code 2023
Day 4: Scratchcards part 1 & 2

https://adventofcode.com/2023/day/4
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2023';
const DAY = '04';

function readInput(filename) {
  const readRawIntput = () => {
    const data = fs.readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename));
    const input = data
      .toString()
      .split('\n')
      .map((s) => {
        const [_, cards] = s.split(':');
        const [wining, other] = cards.split(' | ');
        const r = {
          winingCards: wining
            .split(' ')
            .filter((c) => c != '')
            .map((c) => parseInt(c)),
          allCards: new Set(
            other
              .split(' ')
              .filter((c) => c != '')
              .map((c) => parseInt(c))
          ),
        };
        return r;
      });
    return input;
  };

  const parseALine = (line) => {};

  try {
    return readRawIntput();
  } catch (err) {
    console.error(err);
  }
}

function part1(input) {
  const result = input.reduce((r, { winingCards, allCards }) => {
    return (
      r +
      winingCards.reduce((_r, c) => {
        if (allCards.has(c)) {
          if (_r == 0) return 1;
          _r *= 2;
        }
        return _r;
      }, 0)
    );
  }, 0);

  return result;
}

function part2(input) {
  const scratchcards = input.map((sc) => ({ sc, count: 1 }));

  let scratchcardCount = input.length;
  for (const [index, { sc, count }] of scratchcards.entries()) {
    let winingCardsIndex = index;
    for (c of sc.winingCards) {
      if (sc.allCards.has(c)) {
        winingCardsIndex += 1;
        const _sc = scratchcards[winingCardsIndex];
        _sc.count += count;
        scratchcardCount += count;
      }
    }
  }

  return scratchcardCount;
}

//const input = readInput(`d${DAY}-sample.txt`);
const input = readInput(`d${DAY}-input.txt`);
console.log(`Part 1: ${part1(input)}`);
console.log(`Part 2: ${part2(input)}`);
