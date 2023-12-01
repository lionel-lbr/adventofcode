/*
Advent Of Code 2023
Day 1: Trebuchet?! part 1 & 2

https://adventofcode.com/2023/day/1
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2023';
const DAY = '01';

function readInput(filename) {
  const readRawIntput = () => {
    const data = fs.readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename));
    const input = data.toString().split('\n');

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
  const result = input.reduce((r, s) => {
    let firstDigit = s.match(/\d/);
    let lastDigit = s.match(/\d(?=[^\d]*$)/);
    return r + parseInt(firstDigit) * 10 + parseInt(lastDigit);
  }, 0);
  return result;
}

function part2(input) {
  const intToFind = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
  ];

  const intVal = {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
  };

  const result = input.reduce((r, s) => {
    let firstDigit = intToFind.reduce(
      (digitAndIndex, currentDigit) => {
        const index = s.indexOf(currentDigit);
        // keep lowest index
        if (index !== -1 && index < digitAndIndex.index) return { index: index, digit: currentDigit };
        return digitAndIndex;
      },
      { index: Infinity, digit: '' }
    );

    firstDigit = intVal[firstDigit.digit];

    let lastDigit = intToFind.reduce(
      (digitAndIndex, currentDigit) => {
        const index = s.lastIndexOf(currentDigit);
        // keep highest index
        if (index !== -1 && index > digitAndIndex.index) return { index: index, digit: currentDigit };
        return digitAndIndex;
      },
      { index: -1, digit: '' }
    );

    lastDigit = intVal[lastDigit.digit];
    return r + firstDigit * 10 + lastDigit;
  }, 0);
  return result;
}

const input = readInput(`d${DAY}-input.txt`);
console.log(`Part 1: ${part1(input)}`);
console.log(`Part 2: ${part2(input)}`);
