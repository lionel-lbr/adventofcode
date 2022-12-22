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
    return lines.map((l) => {
      const s = l.split(';');
      const r = {
        items: eval(s[0]),
        oper: eval(`(old) => {return ${s[1]};}`),
        mod: Number(s[2]),
        receivers: eval(s[3]),
      };
      return r;
    });
  } catch (err) {
    console.error(err);
  }
}

function Monkey(index, items, oper, mod, receivers) {
  this.index = index;
  this.items = [...items];
  this.oper = oper;
  this.receivers = [...receivers];
  this.mod = mod;
  this.count = 0;

  this.addItem = (item) => {
    this.items.push(item);
  };

  this.turn = (monkeys) => {
    while (this.items.length > 0) {
      const item = this.items.shift();

      const r = this.oper(item);
      if (r % this.mod === 0) monkeys[[this.receivers[0]]].addItem(r);
      else monkeys[[this.receivers[1]]].addItem(r);
      this.count += 1;
    }
  };
}

function solve(monkeys, maxCount) {
  let count = maxCount;
  while (count > 0) {
    monkeys.forEach((m) => m.turn(monkeys));
    count -= 1;
  }
  const result = monkeys.map((m) => m.count);
  result.sort((a, b) => b - a);
  console.log(result);
  return result[0] * result[1];
}

function part1(input) {
  const monkeys = input.reduce(
    (r, { items, oper, mod, receivers }, index) => [
      ...r,
      new Monkey(index, items, (old) => Math.floor(oper(old) / 3), mod, receivers),
    ],
    []
  );
  return solve(monkeys, 20);
}

function part2(input) {
  // apply chinese reminder theorem on the "worry" operation
  // https://en.wikipedia.org/wiki/Chinese_remainder_theorem

  // calculate product of all mods
  const modProduct = input.reduce((r, { mod }) => r * mod, 1);
  const monkeys = input.reduce(
    (r, { items, oper, mod, receivers }, index) => [
      ...r,
      new Monkey(index, items, (old) => Math.floor(oper(old)) % modProduct, mod, receivers),
    ],
    []
  );
  return solve(monkeys, 10_000);
}

//const input = readInput(`d${DAY}-sample.txt`);
const input = readInput(`d${DAY}-input.txt`);
console.log(`Part 1: ${part1(input)}`);
console.log(`Part 2: ${part2(input)}`);
