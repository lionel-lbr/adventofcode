/*
Advent Of Code 2022
Day 11: xx part 1 & 2

https://adventofcode.com/2022/day/11
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2022';
const DAY = '11';

function readInput(filename) {
  const readRawIntput = () => {
    const data = fs.readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename));
    const lines = data
      .toString()
      .split(`\n`)
      .filter((l) => l);

    return lines;
  };

  const parseALine = (line) => {};

  try {
    const lines = readRawIntput();
    return lines;
  } catch (err) {
    console.error(err);
  }
}

function Monkey(index, items, oper, test, receivers) {
  this.index = index;
  this.items = [...items];
  this.oper = oper;
  this.test = test;
  this.receivers = [...receivers];
  this.count = 0;

  this.addItem = (item) => {
    this.items.push(item);
  };

  this.turn = () => {
    while (this.items.length > 0) {
      const item = this.items.shift();

      const r = this.oper(item);
      if (this.test(r)) monkeys[[this.receivers[0]]].addItem(r);
      else monkeys[[this.receivers[1]]].addItem(r);
      this.count += 1;
    }
  };
}

// const monkeys = [
//   new Monkey(
//     0,
//     [98, 89, 52],
//     // (item) => Math.floor((item * 2) / 3),
//     (item) => Math.floor(item * 2),
//     (r) => r % 5 === 0,
//     [6, 1]
//   ),
//   new Monkey(
//     1,
//     [57, 95, 80, 92, 57, 78],
//     // (item) => Math.floor((item * 13) / 3),
//     (item) => Math.floor(item * 13),
//     (r) => r % 2 === 0,
//     [2, 6]
//   ),
//   new Monkey(
//     2,
//     [82, 74, 97, 75, 51, 92, 83],
//     // (item) => Math.floor((item + 5) / 3),
//     (item) => Math.floor(item + 5),
//     (r) => r % 19 === 0,
//     [7, 5]
//   ),
//   new Monkey(
//     3,
//     [97, 88, 51, 68, 76],
//     // (item) => Math.floor((item + 6) / 3),
//     (item) => Math.floor(item + 6),
//     (r) => r % 7 === 0,
//     [0, 4]
//   ),
//   new Monkey(
//     4,
//     [63],
//     // (item) => Math.floor((item + 1) / 3),
//     (item) => Math.floor(item + 1),
//     (r) => r % 17 === 0,
//     [0, 1]
//   ),
//   new Monkey(
//     5,
//     [94, 91, 51, 63],
//     // (item) => Math.floor((item + 4) / 3),
//     (item) => Math.floor(item + 4),
//     (r) => r % 13 === 0,
//     [4, 3]
//   ),
//   new Monkey(
//     6,
//     [61, 54, 94, 71, 74, 68, 98, 83],
//     // (item) => Math.floor((item + 2) / 3),
//     (item) => Math.floor(item + 2),
//     (r) => r % 3 === 0,
//     [2, 7]
//   ),
//   new Monkey(
//     7,
//     [90, 56],
//     // (item) => Math.floor((item * item) / 3),
//     (item) => Math.floor(item * item),
//     (r) => r % 11 === 0,
//     [3, 5]
//   ),
// ];

const monkeys = [
  new Monkey(
    0,
    [79, 98],
    // (item) => Math.floor((item * 19) / 3),
    (item) => item / item,
    (r) => r % 23 === 0,
    [2, 3]
  ),
  new Monkey(
    1,
    [54, 65, 75, 74],
    // (item) => Math.floor((item + 6) / 3),
    (item) => item / item,
    (r) => r % 19 === 0,
    [2, 0]
  ),
  new Monkey(
    2,
    [79, 60, 97],
    // (item) => Math.floor((item * item) / 3),
    (item) => item / item,
    (r) => r % 13 === 0,
    [1, 3]
  ),
  new Monkey(
    3,
    [74],
    // (item) => Math.floor((item + 3) / 3),
    (item) => item / item,
    (r) => r % 17 === 0,
    [0, 1]
  ),
];

function part1(input) {
  let count = 20;
  while (count > 0) {
    monkeys.forEach((m) => m.turn());
    count -= 1;
  }
  const result = monkeys.map((m) => m.count);
  console.log(result);
  result.sort((a, b) => (a > b ? 1 : a < b ? -1 : 0));
  console.log(result);
  return result;
}

function part2(input) {
  return 0;
}

//const input = readInput(`d${DAY}-sample.txt`);
const input = readInput(`d${DAY}-input.txt`);
console.log(`Part 1: ${part1(input)}`);
console.log(`Part 2: ${part2(input)}`);
