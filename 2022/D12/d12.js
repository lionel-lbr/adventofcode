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
    const i = this.queue.findIndex((n) => n.x === pos.x && n.y === pos.y);
    if (i > -1) {
      this.queue[i] = pos;
    } else this.queue.push(pos);
    needSort = true;
  };

  this.pop = () => {
    if (needSort) {
      this.queue.sort((n1, n2) => {
        // if (n2.f === n1.f) return n2.h - n1.h;
        // else return n2.f - n1.f;
        return n2.g - n1.g;
      });
      needSort = false;
    }

    return this.queue.pop();
  };

  this.find = ({ x, y }) => {
    const i = this.queue.findIndex((n) => n.x === x && n.y === y);
    if (i > -1) {
      return this.queue[i];
    }
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

  const visited = new PriorityQueue();
  const priorityQueue = new PriorityQueue();

  const getValue = (x, y) => {
    if (x < 0 || y < 0 || x > width - 1 || y > height - 1) return Infinity;
    return LETTERS.indexOf(input[y][x]);
  };

  const getNeighbour = ({ x, y }) => {
    const n = [];
    const l = getValue(x, y);
    const top = getValue(x, y - 1);
    const right = getValue(x + 1, y);
    const bottom = getValue(x, y + 1);
    const left = getValue(x - 1, y);
    if (top <= l + 1) n.push({ x, y: y - 1 });
    if (right <= l + 1) n.push({ x: x + 1, y });
    if (bottom <= l + 1) n.push({ x, y: y + 1 });
    if (left <= l + 1) n.push({ x: x - 1, y });
    return n;
  };

  const calculateDistance = (src, dst) => {
    // let d1 = Math.abs(dst.x - src.x);
    // let d2 = Math.abs(dst.y - src.y);
    let d1 = Math.abs(src.x - dst.x);
    let d2 = Math.abs(src.y - dst.y);
    return d1 + d2;
    // let d1 = (src.x - dst.x) * (src.x - dst.x);
    // let d2 = (src.y - dst.y) * (src.y - dst.y);
    // return Math.sqrt(d1 + d2);
  };

  // find Start and End
  let { src, dst } = input.reduce(
    (result, row, y) =>
      row.reduce((result, v, x) => {
        terminal.write(v, x, y);
        if (v === 'S') return Object.assign(result, { src: { x, y, g: 0 } });
        else if (v === 'E') return Object.assign(result, { dst: { x, y, g: Infinity } });
        else return result;
      }, result),
    {}
  );

  priorityQueue.add(src);

  while (!priorityQueue.isEmpty()) {
    // execSync('sleep 0.25');
    const q = priorityQueue.pop();
    terminal.write(input[q.y][q.x], q.x, q.y, 'yellow', 'blue');
    terminal.write(`x:${q.x} y:${q.y} l:${input[q.y][q.x]} g:${q.g} h:${q.h} f:${q.f}`, width + 10, 0);
    const neighbours = getNeighbour(q);

    for (n of neighbours) {
      if (n.x === dst.x && n.y === dst.y) {
        terminal.write(input[n.y][n.x], n.x, n.y, 'green');
        // return q.g + 1;
        // console.log(`Found: ${q.g + 1}`);
        return q.g + 1;
      }
      n.g = q.g + 1;
      // n.h = calculateDistance(n, dst);
      // n.f = n.g + n.h;

      const s = priorityQueue.find(n);
      if (s && s.g <= n.g) continue;

      const v = visited.find(n);
      if (v && v.g <= n.g) continue;

      terminal.write(input[n.y][n.x], n.x, n.y, 'red');
      priorityQueue.add(n);
    }
    terminal.write(input[q.y][q.x], q.x, q.y, 'yellow');
    visited.add(q);
  }

  return dst.g;
}

function part2(input) {
  return 0;
}

//const input = readInput(`d${DAY}-sample.txt`);
const input = readInput(`d${DAY}-input.txt`);
part1(input);
// console.log(`Part 1: ${part1(input)}`);
// console.log(`Part 2: ${part2(input)}`);
