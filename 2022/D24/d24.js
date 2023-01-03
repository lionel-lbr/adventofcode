/*
Advent Of Code 2022
Day 24: Blizzard Basin part 1 & 2

https://adventofcode.com/2022/day/24
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2022';
const DAY = '24';

function readInput(filename) {
  return fs
    .readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename))
    .toString()
    .split(`\n`)
    .filter((l) => l)
    .map((l) => l.split(''));
}

const BLIZZARD = {
  '>': 'RIGHT',
  '<': 'LEFT',
  v: 'DOWN',
  '^': 'UP',

  RIGHT: '>',
  LEFT: '<',
  DOWN: 'v',
  UP: '^',
};

function PriorityQueue() {
  const queue = [];
  let needSort = true;

  this.add = (pos) => {
    queue.push(pos);
    needSort = true;
  };

  this.pop = () => {
    if (needSort) {
      queue.sort((n1, n2) => n2.minute - n1.minute);
      needSort = false;
    }
    return queue.pop();
  };

  this.isEmpty = () => (queue.length > 0 ? false : true);
}

function precalculateBlizzardMaps(input) {
  // blizzards initial position
  const blizzards = input.reduce(
    (list, row, y) =>
      row.reduce((list, c, x) => {
        if (!BLIZZARD[c]) return list;
        list.push({ b: BLIZZARD[c], curr: { x, y }, prev: { x, y } });
        return list;
      }, list),
    []
  );

  const maps = [];
  const blizzardKeySet = new Set();
  let key = generateKey(input);
  do {
    // generate new map
    const map = input.map((row) => row.reduce((a, b) => (b !== '.' ? `${a}#` : `${a}.`)));
    maps.push(map);
    blizzardKeySet.add(key);
    //  move all blizzard
    blizzards.forEach((blizzard) => {
      const { curr, b } = blizzard;

      switch (b) {
        case 'RIGHT':
          curr.x += 1;
          if (curr.x >= input[0].length - 1) curr.x = 1;
          break;
        case 'LEFT':
          curr.x -= 1;
          if (curr.x <= 0) curr.x = input[0].length - 2;
          break;
        case 'UP':
          curr.y -= 1;
          if (curr.y <= 0) curr.y = input.length - 2;
          break;
        case 'DOWN':
          curr.y += 1;
          if (curr.y >= input.length - 1) curr.y = 1;
          break;
      }
    });
    // clear the map
    blizzards.forEach((blizzard) => {
      const { prev } = blizzard;
      input[prev.y][prev.x] = '.';
      blizzard.prev.x = blizzard.curr.x;
      blizzard.prev.y = blizzard.curr.y;
    });

    // update the map
    blizzards.forEach((blizzard) => {
      const { curr } = blizzard;
      if (input[curr.y][curr.x] !== '.') input[curr.y][curr.x] = 'B';
      else input[curr.y][curr.x] = BLIZZARD[blizzard.b];
    });

    // generate new key
    key = generateKey(input);
  } while (!blizzardKeySet.has(key)); // detect cycle
  return maps;
}

// generate unique key for a map
function generateKey(map) {
  const key = map.reduce(
    (k, row, y) =>
      row.reduce((k, c, x) => {
        if (c === '.') return `${k}-${x}:${y}`;
        return k;
      }, k),
    'k'
  );
  return key;
}

function getPossibleMoves({ x, y }, map) {
  const moves = [];
  if (y > 0 && map[y - 1][x] === '.') moves.push({ x, y: y - 1 });
  if (y < map.length - 1 && map[y + 1][x] === '.') moves.push({ x, y: y + 1 });
  if (x > 0 && map[y][x - 1] === '.') moves.push({ x: x - 1, y });
  if (x < map[0].length - 1 && map[y][x + 1] === '.') moves.push({ x: x + 1, y });
  if (map[y][x] === '.') moves.push({ x, y }); // can we wait ...
  return moves;
}

function solveDijkstra(maps, start, end, minute = 0) {
  const visited = new Set();
  const priorityQueue = new PriorityQueue();

  // implement Dijkstra's Algorithm
  priorityQueue.add({ x: start.x, y: start.y, minute });
  while (!priorityQueue.isEmpty()) {
    const q = priorityQueue.pop();

    // reach destination
    if (q.x === end.x && q.y === end.y) {
      return q.minute; // return steps count
    }

    // maked as seen at a given time
    if (visited.has(`${q.x}:${q.y}:${q.minute % maps.length}`)) continue;
    visited.add(`${q.x}:${q.y}:${q.minute % maps.length}`);
    const nextMinute = q.minute + 1;
    const neighbours = getPossibleMoves(q, maps[nextMinute % maps.length]);
    for (n of neighbours) {
      if (visited.has(`${n.x}:${n.y}:${nextMinute % maps.length}`)) continue;
      n.minute = nextMinute;
      priorityQueue.add(n);
    }
  }
}

function part1(input, start, end) {
  console.log('Part 1 ...');
  const startTime = performance.now();
  const maps = precalculateBlizzardMaps(input.map((row) => [...row]));
  console.log(`Precalculate ${maps.length} maps in: ${(performance.now() - startTime) / 1000} seconds`);
  const result = solveDijkstra(maps, start, end);
  console.log(`Final execution time: ${(performance.now() - startTime) / 1000}  seconds`);
  return result;
}

function part2(input, start, end) {
  console.log('Part 2 ...');
  const startTime = performance.now();
  const maps = precalculateBlizzardMaps(input.map((row) => [...row]));
  console.log(`Precalculate ${maps.length} maps in: ${(performance.now() - startTime) / 1000} seconds`);
  const minute1 = solveDijkstra(maps, start, end);
  console.log(`Start to end in ${minute1} steps`);
  const minute2 = solveDijkstra(maps, end, start, minute1);
  console.log(`Back to start in ${minute2 - minute1} steps`);
  const result = solveDijkstra(maps, start, end, minute2);
  console.log(`Return to end in ${result - minute2} steps`);
  console.log(`Execution time: ${(performance.now() - startTime) / 1000}`);
  return result;
}

const input = readInput(`d${DAY}-input.txt`);
console.log(`Part 1: ${part1(input, { x: 1, y: 0 }, { x: 150, y: 21 })}`);
console.log(`Part 2: ${part2(input, { x: 1, y: 0 }, { x: 150, y: 21 })}`);
