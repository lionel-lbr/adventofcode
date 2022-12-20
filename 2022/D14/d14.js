/*
Advent Of Code 2022
Day 14: xx part 1 & 2

https://adventofcode.com/2022/day/14
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2022';
const DAY = '14';

function readInput(filename) {
  const readRawIntput = () => {
    const data = fs.readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename));
    const lines = data
      .toString()
      .split(`\n`)
      .filter((l) => l);

    return lines;
  };

  const parseALine = (line) => {
    return line.split('->').map((pair) => {
      const [x, y] = pair.trim().split(',');
      return { x: Number(x), y: Number(y) };
    });
  };

  try {
    const lines = readRawIntput();
    return lines.map((line) => parseALine(line));
  } catch (err) {
    console.error(err);
  }
}

function Map(width, height, part2 = false) {
  this.map = Array(height)
    .fill([])
    .map((r) => Array(width).fill(' '));

  const SAND = '.';
  const WALL = '#';

  const getCell = (x, y) => this.map[y][x];
  const isBlocked = (x, y) => getCell(x, y) === WALL || getCell(x, y) === SAND;
  const isVoid = (x, y) => (part2 ? false : x < 0 || y < 0 || x >= width || y >= height);
  const canFall = (x, y) => !isVoid(x, y + 1) && !isBlocked(x, y + 1);
  const canSlideLeft = (x, y) => !isVoid(x - 1, y + 1) && !isBlocked(x - 1, y + 1);
  const canSlideRight = (x, y) => !isVoid(x + 1, y + 1) && !isBlocked(x + 1, y + 1);

  this.drawLine = (src, dst) => {
    if (src.x === dst.x) {
      // vertical wall
      const startY = Math.min(src.y, dst.y);
      const endY = Math.max(src.y, dst.y);
      for (let y = startY; y <= endY; y += 1) this.map[y][src.x] = WALL;
    } else {
      // horizontal wall
      const startX = Math.min(src.x, dst.x);
      const endX = Math.max(src.x, dst.x);
      for (let x = startX; x <= endX; x += 1) this.map[src.y][x] = WALL;
    }
  };

  this.addSand = (x, y) => {
    let sX = x,
      sY = y;
    while (1) {
      if (canFall(sX, sY)) {
        sY += 1;
        continue;
      }
      if (canSlideLeft(sX, sY)) {
        sY += 1;
        sX -= 1;
        continue;
      }
      if (canSlideRight(sX, sY)) {
        sY += 1;
        sX += 1;
        continue;
      }

      // end game for part 2
      if (part2 && sX === x && sY === y) {
        this.map[sY][sX] = SAND;
        return false;
      }

      // falling in void --> end game
      if (isVoid(sX - 1, sY + 1) || isVoid(sX, sY + 1) || isVoid(sX + 1, sY + 1)) return false;

      // can't longer fall --> set it in map
      if (isBlocked(sX - 1, sY + 1) || isBlocked(sX, sY + 1) || isBlocked(sX + 1, sY + 1)) {
        this.map[sY][sX] = SAND;
        return true;
      }
    }
  };

  this.countSand = () => {
    return this.map.reduce((count, row) => row.reduce((count, val) => (val === SAND ? count + 1 : count), count), 0);
  };

  this.render = () => {
    this.map.forEach((row, y) => console.log(row.join('')));
  };
}

function part1(input) {
  // find min and max on each axes
  const [minX, maxX, maxY] = input.reduce(
    (result, l) =>
      l.reduce((result, { x, y }) => {
        const [minX, maxX, maxY] = result;
        return [Math.min(minX, x), Math.max(maxX, x), Math.max(maxY, y)];
      }, result),
    [Infinity, -Infinity, -Infinity]
  );

  const height = maxY + 1;
  const width = maxX - minX + 1;
  const translateX = (x) => x - minX;

  const droppingAbscissa = translateX(500);

  const map = new Map(width, height);
  input.forEach((line) =>
    line.reduce((src, dst) => {
      map.drawLine({ x: translateX(src.x), y: src.y }, { x: translateX(dst.x), y: dst.y });
      return dst;
    })
  );

  let count = 0;
  while (map.addSand(droppingAbscissa, 0)) {
    count += 1;
  }
  return count;
}

function part2(input) {
  // find min and max on each axes
  const [minX, maxX, maxY] = input.reduce(
    (result, l) =>
      l.reduce((result, { x, y }) => {
        const [minX, maxX, maxY] = result;
        return [Math.min(minX, x), Math.max(maxX, x), Math.max(maxY, y)];
      }, result),
    [Infinity, -Infinity, -Infinity]
  );

  const height = maxY + 1 + 2; // add 2 to the height
  const width = height * 2 - 1; // base of the triangle is twice its height minus 1
  const droppingAbscissa = 500;
  // translate X based on the droppingAbscissa and half the width
  const translateX = (x) => x - (droppingAbscissa - Math.floor((width - 1) / 2));

  const map = new Map(width, height, true);
  input.forEach((line) =>
    line.reduce((src, dst) => {
      map.drawLine({ x: translateX(src.x), y: src.y }, { x: translateX(dst.x), y: dst.y });
      return dst;
    })
  );

  // add floor ...
  map.drawLine({ x: 0, y: height - 1 }, { x: width - 1, y: height - 1 });

  let count = 0;
  while (map.addSand(translateX(droppingAbscissa), 0)) {
    count += 1;
  }
  count += 1; // for the
  // map.render();
  fs.writeFileSync(path.join(`${YEAR}`, `D${DAY}`, 'result.txt'), map.map.map((r) => r.join('')).join('\n'));
  return count;
}

//const input = readInput(`d${DAY}-sample.txt`);
const input = readInput(`d${DAY}-input.txt`);
console.log(`Part 1: ${part1(input)}`);
console.log(`Part 2: ${part2(input)}`);
