/*
Advent Of Code 2022
Day 12: xx part 1 & 2

https://adventofcode.com/2022/day/12
*/

const fs = require('fs');
const path = require('path');
// const { Terminal } = require('command-line-draw');
const { execSync } = require('child_process');

function Terminal() {
  this.write = () => {};
}

const YEAR = '2022';
const DAY = '12';

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
    return lines.map((row) => row.split(''));
  } catch (err) {
    console.error(err);
  }
}

function PriorityQueue() {
  this.queue = [];
  let needSort = true;

  this.add = (pos) => {
    this.queue.push(pos);
    needSort = true;
  };

  this.pop = () => {
    if (needSort) {
      this.queue.sort((n1, n2) => {
        return n2.g - n1.g;
      });
      needSort = false;
    }

    return this.queue.pop();
  };

  this.isEmpty = () => {
    return this.queue.length > 0 ? false : true;
  };
}

const LETTERS = ' SabcdefghijklmnopqrstuvwxyzE';
function part1(input) {
  const terminal = new Terminal();

  const width = input[0].length;
  const height = input.length;

  const visited = new Set();
  const priorityQueue = new PriorityQueue();

  const calculateDistance = (src, dst) => {
    let d1 = Math.abs(src.x - dst.x);
    let d2 = Math.abs(src.y - dst.y);
    return d1 + d2;
  };

  // find Start and End
  let { src, dst } = input.reduce(
    (result, row, y) =>
      row.reduce((result, v, x) => {
        terminal.write(v, x, y);
        if (v === 'S') return Object.assign(result, { src: { x, y } });
        if (v === 'E') return Object.assign(result, { dst: { x, y } });
        return result;
      }, result),
    {}
  );

  // create the map
  const map = input.map((row, y) =>
    row.map((v, x) => ({ x, y, v: LETTERS.indexOf(v), d: calculateDistance({ x, y }, dst) }))
  );

  const getNode = (x, y) => {
    if (x < 0 || y < 0 || x > width - 1 || y > height - 1) return undefined;
    return map[y][x];
  };

  const getNeighbour = ({ x, y }) => {
    const n = [];
    const l = getNode(x, y).v;
    const top = getNode(x, y - 1);
    const right = getNode(x + 1, y);
    const bottom = getNode(x, y + 1);
    const left = getNode(x - 1, y);
    if (top && top.v <= l + 1) n.push(top);
    if (right && right.v <= l + 1) n.push(right);
    if (bottom && bottom.v <= l + 1) n.push(bottom);
    if (left && left.v <= l + 1) n.push(left);
    return n;
  };

  priorityQueue.add({ g: 0, node: getNode(src.x, src.y) });
  while (!priorityQueue.isEmpty()) {
    const { g, node } = priorityQueue.pop();
    if (node.x === dst.x && node.y === dst.y) {
      return g;
    }

    if (visited.has(node)) continue;
    visited.add(node);
    const neighbours = getNeighbour(node);
    for (n of neighbours) {
      if (visited.has(n)) continue;
      priorityQueue.add({ g: g + 1, node: n });
    }
  }
}

function part2(input) {
  return 0;
}

//const input = readInput(`d${DAY}-sample.txt`);
const input = readInput(`d${DAY}-input.txt`);
part1(input);
// console.log(`Part 1: ${part1(input)}`);
// console.log(`Part 2: ${part2(input)}`);
