/*
Advent Of Code 2022
Day 16: xx part 1 & 2

https://adventofcode.com/2022/day/16
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2022';
const DAY = '16';

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
    return lines.reduce((map, l) => {
      const node = l.split(' ').reduce((node, s, index) => {
        if (index === 1) {
          node.name = s;
          node.childs = [];
        } else if (index === 4) node.flow = Number(s.split('=')[1].slice(0, -1));
        else if (index > 8) {
          if (s.endsWith(',')) node.childs.push(s.slice(0, -1));
          else node.childs.push(s);
        }
        return node;
      }, {});
      map.set(node.name, node);
      return map;
    }, new Map());
  } catch (err) {
    console.error(err);
  }
}

function PriorityQueue() {
  this.queue = [];
  let needSort = true;

  this.add = ({ d, node }) => {
    const i = this.queue.findIndex(({ n: node }) => n.name === node.name);
    if (i > -1) {
      this.queue[i] = { d, node };
    } else this.queue.push({ d, node });
    needSort = true;
  };

  this.pop = () => {
    if (needSort) {
      this.queue.sort((n1, n2) => {
        // if (n2.f === n1.f) return n2.h - n1.h;
        // else return n2.f - n1.f;
        return n2.d - n1.d;
      });
      needSort = false;
    }

    return this.queue.pop();
  };

  this.find = (node) => {
    const i = this.queue.findIndex(({ n: node }) => n.name === node.name);
    if (i > -1) {
      return this.queue[i];
    }
  };

  this.isEmpty = () => {
    return this.queue.length > 0 ? false : true;
  };
}

const getShortestPath = (src, dst, graph) => {
  const visited = new Set();
  const priorityQueue = new PriorityQueue();

  priorityQueue.add(src);
  while (!priorityQueue.isEmpty()) {
    const { d, node } = priorityQueue.pop();
    if (node.name === dst.name) {
      return visited;
    }

    if (visited.has(node)) continue;
    visited.add(node);
    const neighbours = node.childs;
    for (n of neighbours) {
      if (visited.has(n)) continue;
      priorityQueue.add({ d: d + 1, node: graph.get(n) });
    }
  }
};

function permute(permutation) {
  var length = permutation.length,
    result = [permutation.slice()],
    c = new Array(length).fill(0),
    i = 1,
    k,
    p;

  while (i < length) {
    if (c[i] < i) {
      k = i % 2 && c[i];
      p = permutation[i];
      permutation[i] = permutation[k];
      permutation[k] = p;
      ++c[i];
      i = 1;
      result.push(permutation.slice());
    } else {
      c[i] = 0;
      ++i;
    }
  }
  return result;
}

function part1(input) {
  const nodeWithFlow = [...input.keys()].filter((k) => input.get(k).flow > 0);
  return 0;
}

function part2(input) {
  return 0;
}

//const input = readInput(`d${DAY}-sample.txt`);
const input = readInput(`d${DAY}-input.txt`);
console.log(`Part 1: ${part1(input)}`);
console.log(`Part 2: ${part2(input)}`);
