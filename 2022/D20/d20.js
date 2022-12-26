/*
Advent Of Code 2022
Day 20: Grove Positioning System 1 & 2

https://adventofcode.com/2022/day/20
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2022';
const DAY = '20';

function readInput(filename) {
  return fs
    .readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename))
    .toString()
    .split(`\n`)
    .filter((l) => l)
    .map((i) => Number(i));
}

function RotatingList(list) {
  const length = list.length;
  const createEntry = (val, prev) => ({ val, prev, next: null });

  const eltRef = new Map(); // hold reference on interger in the list

  let head = createEntry(null, null);
  let zero = null;
  const tail = list.reduce((prev, val, index) => {
    const entry = createEntry(val, prev);
    prev.next = entry;
    eltRef.set(`${index}-${val}`, entry);
    if (val === 0) zero = entry;
    return entry;
  }, head);

  // make circular list (remoive empty head ...)
  head = head.next;
  tail.next = head;
  head.prev = tail;

  // move an elt around the list
  this.move = (index, val) => {
    if (val === 0) return;

    const entry = eltRef.get(`${index}-${val}`);

    // unlink the elt
    entry.next.prev = entry.prev;
    entry.prev.next = entry.next;

    let step = Math.abs(val);

    // needed for part 2, skip full rotation around the list
    step = step % (length - 1);
    let current = entry;
    while (step > 0) {
      current = val > 0 ? current.next : current.prev;
      step -= 1;
    }

    if (val > 0) {
      // link after
      entry.next = current.next;
      current.next.prev = entry;
      current.next = entry;
      entry.prev = current;
      return;
    }
    if (val < 0) {
      // link before
      entry.prev = current.prev;
      current.prev.next = entry;
      current.prev = entry;
      entry.next = current;
      return;
    }
  };

  this.findValue = (steps) => {
    let current = zero;
    while (steps > 0) {
      current = current.next;
      steps -= 1;
    }
    return current.val;
  };
}

function part1(input) {
  const originalList = [...input];
  const rotList = new RotatingList(originalList);

  originalList.forEach((val, index) => rotList.move(index, val));

  const result = [1000, 2000, 3000].reduce((sum, steps) => sum + rotList.findValue(steps), 0);
  return result;
}

function part2(input) {
  const originalList = input.map((v) => v * 811589153);
  const rotList = new RotatingList(originalList);

  for (let i = 0; i < 10; i++) originalList.forEach((val, index) => rotList.move(index, val));

  const result = [1000, 2000, 3000].reduce((sum, steps) => sum + rotList.findValue(steps), 0);
  return result;
}

//const input = readInput(`d${DAY}-sample.txt`);
const input = readInput(`d${DAY}-input.txt`);
console.log(`Part 1: ${part1(input)}`);
console.log(`Part 2: ${part2(input)}`);
