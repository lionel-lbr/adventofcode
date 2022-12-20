/*
Advent Of Code 2022
Day 15: xx part 1 & 2

https://adventofcode.com/2022/day/15
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2022';
const DAY = '15';

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
    return lines
      .map((l) =>
        l
          .split(' ')
          .filter((s) => s.startsWith('x=') || s.startsWith('y='))
          .map((w) => {
            let d = w.split('=')[1];
            if (d.endsWith(',') || d.endsWith(':')) d = d.slice(0, -1);
            return Number(d);
          })
      )
      .map((s) => ({
        sensor: { x: s[0], y: s[1] },
        beacon: { x: s[2], y: s[3] },
        distance: Math.abs(s[2] - s[0]) + Math.abs(s[3] - s[1]),
      }));
  } catch (err) {
    console.error(err);
  }
}

const overlap = (seg1, seg2) => {
  // no overlap
  if (seg1.left > seg2.right || seg2.left > seg1.right) return [seg1, seg2];
};
function part1(input) {
  const ROW = 2000000;
  const sensors = input.filter(
    ({ sensor, distance }) =>
      (sensor.y < ROW && sensor.y + distance >= ROW) || (sensor.y > ROW && sensor.y - distance <= ROW)
  );
  const intervals = sensors.reduce((intervals, { sensor, distance }) => {
    const dy = Math.abs(ROW - sensor.y);
    const dx = Math.abs(distance - dy);
    const left = sensor.x - dx;
    const right = sensor.x + dx;
    intervals.push({ left, right });
    return intervals;
  }, []);

  // sort intervals by left ascending
  intervals.sort((sa, sb) => sa.left - sb.left);
  // const result = [];
  const interval = intervals.reduce((s1, s2) => {
    // s1 contains s2
    if (s1.right >= s2.right) return s1;
    // extend s1 with s2
    if (s1.right >= s2.left || s1.right + 1 === s2.left) return { left: s1.left, right: s2.right };
    // s1 and s2 are separated
    // result.push(s1);
    return s2; // work with s2 now ...
  });
  // result.push(s);
  // console.log(result.length);
  const intervalSize = interval.right - interval.left + 1;
  const beacons = input.reduce((r, { beacon }) => {
    if (beacon.y === ROW && beacon.x >= interval.left && beacon.x <= interval.right) r.add(`${beacon.x}:${beacon.y}`);
    return r;
  }, new Set());
  return intervalSize - beacons.size;
}

function part2(input) {
  const MAX_ROW = 4_000_000;
  for ({ s, d } in input) {
    for (let x = Math.max(0, s.x - d); x < Math.min(MAX_ROW, s.x + d); x += 1) {
      for (let y = Math.min(0, s.y - d); y < Math.max(MAX_ROW, s.y + d); y += 1) {}
    }
  }

  return 0;
}

//const input = readInput(`d${DAY}-sample.txt`);
const input = readInput(`d${DAY}-input.txt`);
console.log(`Part 1: ${part1(input)}`);
console.log(`Part 2: ${part2(input)}`);
