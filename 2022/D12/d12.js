/*
Advent Of Code 2022
Day 12: Hill Climbing Algorithm part 1 & 2

https://adventofcode.com/2022/day/12
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2022';
const DAY = '12';

function readInput(filename) {
  return fs
    .readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename))
    .toString()
    .split(`\n`)
    .filter((l) => l)
    .map((row) => row.split(''));
}

function PriorityQueue() {
  const queue = [];
  let needSort = true;

  this.add = (pos) => {
    queue.push(pos);
    needSort = true;
  };

  this.pop = () => {
    if (needSort) {
      queue.sort((n1, n2) => n2.g - n1.g);
      needSort = false;
    }
    return queue.pop();
  };

  this.isEmpty = () => (queue.length > 0 ? false : true);
}

const LETTERS = ' abcdefghijklmnopqrstuvwxyz';

function solveDijkstra(input, start, end, getNeighbour, part2) {
  const width = input[0].length;
  const height = input.length;

  const visited = new Set();
  const priorityQueue = new PriorityQueue();

  const getKey = ({ x, y }) => `${x}:${y}`;

  const getValue = (x, y) => {
    if (x < 0 || y < 0 || x > width - 1 || y > height - 1) return Infinity;
    const l = input[y][x];
    if (l === 'S') return LETTERS.indexOf('a');
    if (l === 'E') return LETTERS.indexOf('z');
    return LETTERS.indexOf(l);
  };

  // implement Dijkstra's Algorithm
  priorityQueue.add(start);
  while (!priorityQueue.isEmpty()) {
    const q = priorityQueue.pop();
    // reach destination
    // for part2 stop as soon as you find 'a'
    if ((part2 && getValue(q.x, q.y) === 1) || (q.x === end.x && q.y === end.y)) return q.g; // return steps count

    if (visited.has(getKey(q))) continue;
    visited.add(getKey(q));
    const neighbours = getNeighbour(q, getValue);
    for (n of neighbours) {
      if (visited.has(getKey(n))) continue;
      n.g = q.g + 1;
      priorityQueue.add(n);
    }
  }
}

function part1(input) {
  const getNeighbour = ({ x, y }, getValue) => {
    const n = [];
    const l = getValue(x, y);
    if (getValue(x, y - 1) <= l + 1) n.push({ x, y: y - 1 });
    if (getValue(x + 1, y) <= l + 1) n.push({ x: x + 1, y });
    if (getValue(x, y + 1) <= l + 1) n.push({ x, y: y + 1 });
    if (getValue(x - 1, y) <= l + 1) n.push({ x: x - 1, y });
    return n;
  };

  // find start and end
  let { start, end } = input.reduce(
    (result, row, y) =>
      row.reduce((result, v, x) => {
        if (v === 'S') return Object.assign(result, { start: { x, y, g: 0 } });
        if (v === 'E') return Object.assign(result, { end: { x, y, g: 0 } });
        return result;
      }, result),
    {}
  );

  return solveDijkstra(input, start, end, getNeighbour);
}

function part2(input) {
  const getNeighbour = ({ x, y }, getValue) => {
    const n = [];
    const l = getValue(x, y);
    if (getValue(x, y - 1) >= l - 1) n.push({ x, y: y - 1 });
    if (getValue(x + 1, y) >= l - 1) n.push({ x: x + 1, y });
    if (getValue(x, y + 1) >= l - 1) n.push({ x, y: y + 1 });
    if (getValue(x - 1, y) >= l - 1) n.push({ x: x - 1, y });
    return n;
  };

  // find start and end
  let { start, end } = input.reduce(
    (result, row, y) =>
      row.reduce((result, v, x) => {
        if (v === 'E') return Object.assign(result, { start: { x, y, g: 0 } });
        if (v === 'S') return Object.assign(result, { end: { x, y, g: 0 } });
        return result;
      }, result),
    {}
  );

  return solveDijkstra(input, start, end, getNeighbour, true);
}

//const input = readInput(`d${DAY}-sample.txt`);
const input = readInput(`d${DAY}-input.txt`);
console.log(`Part 1: ${part1(input)}`);
console.log(`Part 2: ${part2(input)}`);
