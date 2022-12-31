/*
Advent Of Code 2022
Day 15: Beacon Exclusion Zone part 1 & 2

https://adventofcode.com/2022/day/15
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2022';
const DAY = '15';

function readInput(filename) {
  return fs
    .readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename))
    .toString()
    .split(`\n`)
    .filter((l) => l)
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
}

function part1(input) {
  const ROW = 2_000_000;

  // list of sensors which cover the ROW
  const sensors = input.filter(
    ({ sensor, distance }) =>
      (sensor.y < ROW && sensor.y + distance >= ROW) || (sensor.y > ROW && sensor.y - distance <= ROW)
  );

  // for each sensor calculate the x coverage
  const intervals = sensors.reduce((intervals, { sensor, beacon, distance }) => {
    const dy = Math.abs(ROW - sensor.y);
    const dx = Math.abs(distance - dy);
    const left = sensor.x - dx;
    const right = sensor.x + dx;
    intervals.push({ left, right });

    // push sensor and beacon position as an interval
    intervals.push({ left: sensor.x, right: sensor.x });
    intervals.push({ left: beacon.x, right: beacon.x });
    return intervals;
  }, []);

  // sort intervals by left ascending
  intervals.sort((sa, sb) => sa.left - sb.left);

  // merge intervals
  const interval = intervals.reduce((s1, s2) => {
    // s1 contains s2
    if (s1.right >= s2.right) return s1;
    // extend s1 with s2
    if (s1.right >= s2.left || s1.right + 1 === s2.left) return { left: s1.left, right: s2.right };
    // s1 and s2 are separated, there is a gap ...
    return s2; // work with s2 now, just for reduce to continue ...
  });
  // should not be any gap ...
  const intervalSize = interval.right - interval.left;
  return intervalSize;
}

function part2(input) {
  const startTime = performance.now();
  const MAX_COORDINATE = 4_000_000;
  // const MAX_DISTANCE = 20;
  const intervals = new Map();
  for (let i = 0; i <= MAX_COORDINATE; i++) intervals.set(i, []);

  input.forEach(({ sensor, beacon, distance }) => {
    for (let y = Math.max(0, sensor.y - distance); y <= Math.min(MAX_COORDINATE, sensor.y + distance); y += 1) {
      const dy = Math.abs(y - sensor.y);
      const dx = Math.abs(distance - dy);
      const left = Math.max(0, sensor.x - dx);
      const right = Math.min(MAX_COORDINATE, sensor.x + dx);
      intervals.get(y).push({ left, right });
    }

    // add sensor and beacon position as an interval
    if (sensor.y >= 0 && sensor.y <= MAX_COORDINATE && sensor.x >= 0 && sensor.x <= MAX_COORDINATE)
      intervals.get(sensor.y).push({ left: sensor.x, right: sensor.x });
    if (beacon.y >= 0 && beacon.y <= MAX_COORDINATE && beacon.x >= 0 && beacon.x <= MAX_COORDINATE)
      intervals.get(beacon.y).push({ left: beacon.x, right: beacon.x });
  });

  for (let y = 0; y <= MAX_COORDINATE; y++) {
    // sort intervals by left ascending
    intervals.get(y).sort((sa, sb) => sa.left - sb.left);

    // merge interval until we find a "gap"
    let result = null;
    intervals.get(y).reduce((s1, s2) => {
      // s1 contains s2
      if (s1.right >= s2.right) return s1;
      // extend s1 with s2
      if (s1.right >= s2.left || s1.right + 1 === s2.left) return { left: s1.left, right: s2.right };
      // s1 and s2 are separated, found a gap
      result = 4_000_000 * (s1.right + 1) + y;
      console.log(`Found a gap at row ${y}: ${s1.right}-${s2.left} - result: ${result}`);
      return s2; // work with s2 now, just for reduce to continue ...
    });
    if (result !== null) {
      console.log(`P2 execution time:${performance.now() - startTime}`);
      return result;
    }
  }
}

//const input = readInput(`d${DAY}-sample.txt`);
const input = readInput(`d${DAY}-input.txt`);
console.log(`Part 1: ${part1(input)}`);
console.log(`Part 2: ${part2(input)}`);
