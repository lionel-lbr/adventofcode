/*
Advent Of Code 2022
Day 18: Boiling Boulders part 1 & 2

https://adventofcode.com/2022/day/18
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2022';
const DAY = '18';

function readInput(filename) {
  return fs
    .readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename))
    .toString()
    .split(`\n`)
    .filter((l) => l)
    .map((l) => l.split(',').map((i) => Number(i)))
    .map((c) => ({ x: c[0], y: c[1], z: c[2] }));
}

function part1(droplets) {
  const startTime = performance.now();

  let connectedSides = 0;
  for (let i = 0; i < droplets.length - 1; i++) {
    const c1 = droplets[i];
    for (let j = i + 1; j < droplets.length; j++) {
      const c2 = droplets[j];
      if (c1.x === c2.x && c1.y === c2.y && (c1.z === c2.z + 1 || c1.z === c2.z - 1)) {
        connectedSides += 2;
        continue;
      }
      if (c1.x === c2.x && c1.z === c2.z && (c1.y === c2.y + 1 || c1.y === c2.y - 1)) {
        connectedSides += 2;
        continue;
      }
      if (c1.y === c2.y && c1.z === c2.z && (c1.x === c2.x + 1 || c1.x === c2.x - 1)) {
        connectedSides += 2;
        continue;
      }
    }
  }
  console.log(`Execution time: ${(performance.now() - startTime) / 1000}`);
  return droplets.length * 6 - connectedSides;
}

function part2(droplets) {
  const startTime = performance.now();
  // get max values of each dimentions
  const xyzMax = droplets.reduce(
    (d1, d2) => ({ x: Math.max(d1.x, d2.x), y: Math.max(d1.y, d2.y), z: Math.max(d1.z, d2.z) }),
    { x: -Infinity, y: -Infinity, z: -Infinity }
  );

  // create 3D map
  const maps = new Array(xyzMax.z + 3)
    .fill('.')
    .map(() => new Array(xyzMax.y + 3).fill('.').map(() => new Array(xyzMax.x + 3).fill('.')));

  // place droplets
  droplets.forEach(({ x, y, z }) => (maps[z + 1][y + 1][x + 1] = '#'));

  const getDroplet = ({ x, y, z }) => {
    if (x < 0 || y < 0 || z < 0 || x >= maps[0][0].length || y >= maps[0].length || z >= maps.length) return null;
    return maps[z][y][x];
  };

  const getNeighbours = ({ x, y, z }) => {
    const n = [];
    const top = { x, y: y - 1, z };
    const right = { x: x + 1, y, z };
    const bottom = { x, y: y + 1, z };
    const left = { x: x - 1, y, z };
    const below = { x, y, z: z + 1 };
    const above = { x, y, z: z - 1 };

    if (getDroplet(below) === '.') n.push(below);
    if (getDroplet(right) === '.') n.push(right);
    if (getDroplet(bottom) === '.') n.push(bottom);
    if (getDroplet(top) === '.') n.push(top);
    if (getDroplet(left) === '.') n.push(left);
    if (getDroplet(above) === '.') n.push(above);
    return n;
  };

  const countNeighbourFaces = ({ x, y, z }) => {
    let count = 0;
    count += getDroplet({ x, y: y - 1, z }) === '#';
    count += getDroplet({ x: x + 1, y, z }) === '#';
    count += getDroplet({ x, y: y + 1, z }) === '#';
    count += getDroplet({ x: x - 1, y, z }) === '#';
    count += getDroplet({ x, y, z: z + 1 }) === '#';
    count += getDroplet({ x, y, z: z - 1 }) === '#';
    return count;
  };

  const queue = [{ x: 0, y: 0, z: 0 }];
  let faces = 0;
  while (queue.length > 0) {
    const p = queue.pop();
    // if visited continue
    if (getDroplet(p) === '0') continue;
    maps[p.z][p.y][p.x] = '0';
    faces += countNeighbourFaces(p);
    const neighbours = getNeighbours(p);
    for (n of neighbours) {
      if (getDroplet(n) === '0') continue;
      queue.push(n);
    }
  }

  console.log(`Execution time: ${(performance.now() - startTime) / 1000}`);
  return faces;
}

//const input = readInput(`d${DAY}-sample.txt`);
const input = readInput(`d${DAY}-input.txt`);
console.log(`Part 1: ${part1(input)}`);
console.log(`Part 2: ${part2(input)}`);
