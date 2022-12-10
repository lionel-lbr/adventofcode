/*
Advent Of Code 2022
Day 9: Rope Bridge 1 & 2

https://adventofcode.com/2022/day/9
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2022';
const DAY = '09';

function readInput(filename) {
  return fs
    .readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename))
    .toString()
    .split(`\n`)
    .filter((l) => l)
    .map((s) => s.split(' '))
    .map((s) => ({ d: s[0], s: Number(s[1]) }));
}

function Rope(size) {
  this.trace = new Set();
  const knots = Array(size)
    .fill(0)
    .map((a) => ({ x: 0, y: 0 }));
  const head = knots[0];
  const tail = knots[size - 1];

  const shouldMove = (head, tail) => {
    if (tail.x >= head.x - 1 && tail.x <= head.x + 1 && tail.y >= head.y - 1 && tail.y <= head.y + 1) return false;
    return true;
  };

  const moveOneStep = () => {
    knots.reduce((head, tail) => {
      if (shouldMove(head, tail)) {
        // move every knots
        const dx = head.x - tail.x;
        const dy = head.y - tail.y;
        tail.x += dx > 0 ? 1 : dx < 0 ? -1 : 0;
        tail.y += dy > 0 ? 1 : dy < 0 ? -1 : 0;
      }
      return tail;
    });

    const { x, y } = tail;
    this.trace.add(`${x}:${y}`);
  };

  this.moveRight = (steps) => {
    while (steps > 0) {
      head.x += 1;
      moveOneStep();
      steps -= 1;
    }
  };

  this.moveLeft = (steps) => {
    while (steps > 0) {
      head.x -= 1;
      moveOneStep();
      steps -= 1;
    }
  };

  this.moveUp = (steps) => {
    while (steps > 0) {
      head.y += 1;
      moveOneStep();
      steps -= 1;
    }
  };

  this.moveDown = (steps) => {
    while (steps > 0) {
      head.y -= 1;
      moveOneStep();
      steps -= 1;
    }
  };
}

function solve(input, size) {
  const rope = new Rope(size);

  input.forEach((move) => {
    switch (move.d) {
      case 'R':
        rope.moveRight(move.s);
        break;
      case 'L':
        rope.moveLeft(move.s);
        break;
      case 'U':
        rope.moveUp(move.s);
        break;
      case 'D':
        rope.moveDown(move.s);
        break;
    }
  });
  return rope.trace.size;
}

//const input = readInput(`d${DAY}-sample1.txt`);
//const input = readInput(`d${DAY}-sample2.txt`);
const input = readInput(`d${DAY}-input.txt`);
console.log(`Part 1: ${solve(input, 2)}`);
console.log(`Part 2: ${solve(input, 10)}`);
