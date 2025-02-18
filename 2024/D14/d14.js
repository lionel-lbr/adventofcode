/*
Advent Of Code 2024
Day 14: Restroom Redoubt part 1 & 2

https://adventofcode.com/2024/day/14
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2024';
const DAY = '14';

function readInput(filename) {
  const readRawInput = () => {
    const data = fs.readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename));
    const input = data
      .toString()
      .split('\n')
      .filter((l) => l.length > 0)
      .map((l) => {
        const [p, v] = l.split(' ').map((e) => {
          const [l, r] = e.split(',');
          const x = parseInt(l.split('=')[1]);
          return { x, y: parseInt(r) };
        });
        return { p, v };
      });
    return input;
  };
  try {
    return readRawInput();
  } catch (err) {
    console.error(err);
  }
}

const drawMap = (map, count, filePath = null) => {
  let output = '';
  let index = 0;
  for (const row of map) {
    const line = `${index}`.padStart(3, '0') + ' ' + row.join('');
    output += line + '\n';
    index++;
  }
  output += `\nSecond:${count}\n\n`;
  if (filePath) {
    // Write output to a file
    // fs.writeFileSync(path.join(`${YEAR}`, `D${DAY}`, filePath), output, 'utf8');
    fs.appendFileSync(path.join(`${YEAR}`, `D${DAY}`, filePath), output, 'utf8');
  } else {
    // Log output to the console
    console.log(output);
  }
};

function solution1(input, width, height, maxCount = 100, showMap = null) {
  let count = 0;

  while (count < maxCount) {
    for (const robot of input) {
      robot.p.x += robot.v.x;
      robot.p.y += robot.v.y;
      if (robot.p.y < 0) robot.p.y += height;
      if (robot.p.y >= height) robot.p.y -= height;
      if (robot.p.x < 0) robot.p.x += width;
      if (robot.p.x >= width) robot.p.x -= width;
      if (robot.p.x < 0 || robot.p.x >= width || robot.p.y < 0 || robot.p.y >= height) {
        console.log(`Error for count:${count} ${JSON.stringify(robot)}`);
        break;
      }
    }
    count++;

    if (showMap) {
      showMap(count);
    }
  }

  const quadrant = [0, 0, 0, 0];
  const quadrantBound = [
    { minX: 0, maxX: Math.floor(width / 2) - 1, minY: 0, maxY: Math.floor(height / 2) - 1 },
    { minX: Math.floor(width / 2) + 1, maxX: width - 1, minY: 0, maxY: Math.floor(height / 2) - 1 },
    { minX: 0, maxX: Math.floor(width / 2) - 1, minY: Math.floor(height / 2) + 1, maxY: height - 1 },
    { minX: Math.floor(width / 2) + 1, maxX: width - 1, minY: Math.floor(height / 2) + 1, maxY: height - 1 },
  ];

  for (const robot of input) {
    for (const [i, bound] of quadrantBound.entries()) {
      const { minX, maxX, minY, maxY } = bound;
      const { x, y } = robot.p;
      if (x >= minX && x <= maxX && y >= minY && y <= maxY) quadrant[i] += 1;
    }
  }

  let result = quadrant.reduce((r, q) => (r *= q), 1);
  return { result };
}

function solution2(input, width, height) {
  const WIDTH = 101;
  const HEIGHT = 103;

  const showMap = (count) => {
    let maxInline = 15;
    for (let y = 0; y < height; y++) {
      const robotInLine = input.filter(({ p }) => p.y === y);
      maxInline = Math.max(maxInline, robotInLine.length);
    }
    if (maxInline === 15) return;

    const map = new Array(HEIGHT).fill(' ').map((row) => new Array(WIDTH).fill(' '));
    for (const robot of input) {
      const { x, y } = robot.p;
      map[y][x] = '#';
    }

    drawMap(map, count, 'map.txt');
  };

  solution1(input, width, height, 10000, showMap);
  let result = 0;
  return { result };
}

function part1(mode) {
  const input = readInput(`d${DAY}-${mode}.txt`);

  const width = mode === 'input' ? 101 : 11;
  const height = mode === 'input' ? 103 : 7;
  const startTime = performance.now();
  const { result } = solution1(input, width, height);
  const elapsed = performance.now() - startTime;
  console.log(`Part 1 ${mode} time: ${Math.floor(elapsed / 60000)}:${Math.floor((elapsed % 60000) / 1000)}:${Math.floor(elapsed % 1000)}`);
  console.log(`Part 1 ${mode} result: ${result}`);
}

function part2(mode) {
  const input = readInput(`d${DAY}-${mode}.txt`);
  const width = 101;
  const height = 103;
  const startTime = performance.now();
  const { result } = solution2(input, width, height);
  const elapsed = performance.now() - startTime;
  console.log(`Part 2 ${mode} time: ${Math.floor(elapsed / 60000)}:${Math.floor((elapsed % 60000) / 1000)}:${Math.floor(elapsed % 1000)}`);
  console.log(`Part 2 ${mode} result: ${result}`);
}

part1('sample');
part1('input');
//part2('sample');
part2('input');
