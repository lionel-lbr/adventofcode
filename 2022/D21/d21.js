/*
Advent Of Code 2022
Day 21: Monkey Math part 1 & 2

https://adventofcode.com/2022/day/21
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2022';
const DAY = '21';

function readInput(filename) {
  return fs
    .readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename))
    .toString()
    .split(`\n`)
    .filter((l) => l)
    .map((l) => {
      let [name, value] = l.split(':');
      value = value.trim();
      if (!isNaN(Number(value))) return { name, value: Number(value) };
      const [left, oper, right] = value.split(' ');
      return { name, value: { left, oper, right } };
    });
}

function Monkey(name, value) {
  this.name = name;
  if (Number.isInteger(value)) this.value = value;
  else this.value = Object.assign({}, value);

  this.isShouting = () => Number.isInteger(this.value);
  this.resolve = (monkey) => {
    if (!Number.isInteger(this.value.right) && this.value.right === monkey.name) this.value.right = monkey.value;
    if (!Number.isInteger(this.value.left) && this.value.left === monkey.name) this.value.left = monkey.value;

    if (Number.isInteger(this.value.left) && Number.isInteger(this.value.right)) {
      const { left, right, oper } = this.value;
      switch (oper) {
        case '+':
          this.value = left + right;
          break;
        case '-':
          this.value = left - right;
          break;
        case '*':
          this.value = left * right;
          break;
        case '/':
          this.value = left / right;
          break;
      }
    }
    return this.isShouting();
  };
}

function part1(input) {
  let monkeys = input.map(({ name, value }) => new Monkey(name, value));
  const root = monkeys.find((m) => m.name === 'root');

  while (monkeys.length > 1) {
    const shoutingMonkeys = monkeys.filter((m) => m.isShouting());
    monkeys = monkeys.filter((m) => !m.isShouting());
    shoutingMonkeys.forEach((shoutingMonkey) => {
      monkeys.forEach((monkey) => monkey.resolve(shoutingMonkey));
    });
  }
  return root.value;
}

function part2(input) {
  let monkeys = input.map(({ name, value }) => new Monkey(name, value));
  // invalidate "humn"
  const humn = monkeys.find((m) => m.name === 'humn');
  humn.value = 'XXX';

  while (true) {
    const shoutingMonkeys = monkeys.filter((m) => m.isShouting());
    // break when no more shouting monkey
    if (shoutingMonkeys.length === 0) break;
    monkeys = monkeys.filter((m) => !m.isShouting());
    shoutingMonkeys.forEach((shoutingMonkey) => {
      monkeys.forEach((monkey) => monkey.resolve(shoutingMonkey));
    });
  }
  // find which root value to resolve
  let monkey = monkeys.find((m) => m.name === 'root');
  let value = Number.isInteger(monkey.value.left) ? monkey.value.left : monkey.value.right;
  let name = null;
  while (name != humn.name) {
    name = Number.isInteger(monkey.value.left) ? monkey.value.right : monkey.value.left;
    monkey = monkeys.find((m) => m.name === name);
    const { left, right, oper } = monkey.value;
    switch (oper) {
      case '+':
        value = Number.isInteger(left) ? value - left : value - right;
        break;
      case '-':
        value = Number.isInteger(left) ? left - value : value + right;
        break;
      case '*':
        value = Number.isInteger(left) ? value / left : value / right;
        break;
      case '/':
        value = Number.isInteger(left) ? left / value : value * right;
        break;
    }
  }
  return value;
}

//const input = readInput(`d${DAY}-sample.txt`);
const input = readInput(`d${DAY}-input.txt`);
console.log(`Part 1: ${part1(input)}`);
console.log(`Part 2: ${part2(input)}`);
