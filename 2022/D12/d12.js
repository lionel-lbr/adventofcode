/*
Advent Of Code 2022
Day 12: xx part 1 & 2

https://adventofcode.com/2022/day/12
*/

const fs = require('fs');
const path = require('path');
// const { Terminal } = require('command-line-draw');
// const { execSync } = require('child_process');

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

  this.push = (node) => {
    const i = this.queue.findIndex((n) => n.x === pos.x && n.y === pos.y);
    if (i > -1) {
      this.queue[i] = pos;
    } else this.queue.push(pos);
    needSort = true;
  };

  this.pop = () => {
    if (needSort) {
      this.queue.sort((n1, n2) => n2.f - n1.f);
      needSort = false;
    }

    return this.queue.pop();
  };

  this.find = (node) => {
    return this.queue.find(node);
    // const i = this.queue.findIndex((n) => n.x === x && n.y === y);
    // if (i > -1) {
    //   return this.queue[i];
    // }
  };

  this.isEmpty = () => {
    return this.queue.length;
  };
}

const LETTERS = ' SabcdefghijklmnopqrstuvwxyzE';
function part1(input) {
  // const terminal = new Terminal();

  const width = input[0].length;
  const height = input.length;

  const visited = new PriorityQueue();
  const priorityQueue = new PriorityQueue();

  const getValue = (x, y) => {
    if (x < 0 || y < 0 || x > width - 1 || y > height - 1) return Infinity;
    return LETTERS.indexOf(input[y][x]);
  };

  const getNeighbour = ({ x, y }) => {
    const n = [];
    const l = getNode(x, y).v;
    const top = y > 0 ? getNode(x, y - 1) : undefined;
    const right = x < width - 1 ? getNode(x + 1, y) : undefined;
    const bottom = y < height - 1 ? getNode(x, y + 1) : undefined;
    const left = y > 0 ? getNode(x - 1, y) : undefined;
    if (top && top.v <= l + 1) n.push(top);
    if (right && right.v <= l + 1) n.push(right);
    if (bottom && bottom.v <= l + 1) n.push(bottom);
    if (left && left.v <= l + 1) n.push(left);
    return n;
  };

  const calculateDistance = (src, dst) => {
    // let d1 = Math.abs(dst.x - src.x);
    // let d2 = Math.abs(dst.y - src.y);
    let d1 = Math.abs(src.x - dst.x);
    let d2 = Math.abs(src.y - dst.y);
    return d1 + d2;
  };

  // find Start and End
  let { src, dst } = input.reduce(
    (result, row, y) =>
      row.reduce((result, v, x) => {
        // terminal.write(v, x, y);
        if (v === 'S') return Object.assign(result, { src: { x, y, g: 0 } });
        else if (v === 'E') return Object.assign(result, { dst: { x, y, g: Infinity } });
        else return result;
      }, result),
    {}
  );

  const map = input.map((row, y) =>
    row.map((l, x) => ({ v: LETTERS.indexOf(l), h: calculateDistance({ x, y }, dst), g: 0 }))
  );

  const getNode = (x, y) => map[y][x];
  src = getNode(src.x, src.y);
  dst = getNode(dst.x, dst.y);
  priorityQueue.push(src);

  while (priorityQueue.isEmpty() > 0) {
    // execSync('sleep 0.5');
    const q = priorityQueue.pop();
    // terminal.write(input[q.y][q.x], q.x, q.y, 'red');
    const neighbours = getNeighbour(q);

    for (n of neighbours) {
      if (n == dst) {
        // terminal.write(input[n.y][n.x], n.x, n.y, 'green');
        // return q.g + 1;
        console.log(`Found: ${q.g + 1}`);
        return q.g + 1;
      }
      n.g = q.g + 1;
      n.f = n.g + n.h;

      const s = priorityQueue.find(n);
      if (s && s.f <= n.f) continue;

      const v = visited.find(n);
      if (v && v.f <= n.f) continue;

      priorityQueue.push(n);
    }
    visited.push(q);
  }

  return dst.g;
}

function part2(input) {
  return 0;
}

//const input = readInput(`d${DAY}-sample.txt`);
const input = readInput(`d${DAY}-input.txt`);
// part1(input);
console.log(`Part 1: ${part1(input)}`);
// console.log(`Part 2: ${part2(input)}`);
