/*
Advent Of Code 2023
Day 11: Cosmic Expansion part 1 & 2

https://adventofcode.com/2023/day/11
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2023';
const DAY = '11';

function readInput(filename) {
  const readRawInput = () => {
    const data = fs.readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename));
    const input = data
      .toString()
      .split('\n')
      .map((l) => l.split(''));
    return input;
  };

  const parseALine = (line) => {};

  try {
    return readRawInput();
  } catch (err) {
    console.error(err);
  }
}

function ElapsedTime(name, fct, input) {
  const startTime = performance.now();
  const result = fct(input);
  const elapsed = performance.now() - startTime;
  console.log(
    `${name} elapsed time ${Math.floor(elapsed / 60000)}:${Math.floor((elapsed % 60000) / 1000)}:${Math.floor(
      elapsed % 1000
    )}`
  );
  console.log(`${name}: ${result}`);
}

class Galaxy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class GalaxyPair {
  constructor({ x: x1, y: y1 }, { x: x2, y: y2 }) {
    this.galaxy1 = new Galaxy(x1, y1);
    this.galaxy2 = new Galaxy(x2, y2);
    this.path = [];
  }

  getStepCountEuclidean() {
    const dx = Math.abs(this.galaxy1.x - this.galaxy2.x);
    const dy = Math.abs(this.galaxy1.y - this.galaxy2.y);
    const stepCount = dx + dy;
    return stepCount;
  }

  toString() {
    // for debug
    return `${this.galaxy1.x}:${this.galaxy1.y}-${this.galaxy2.x}:${this.galaxy2.y}`;
  }
}

function isEmptyRow(row) {
  const empty = row.every((t) => t === '.');
  return empty;
}

function isEmptyColumn(universe, index) {
  const empty = universe.every((row) => row[index] === '.');
  return empty;
}

function getListOfGalaxy(input) {
  const galaxies = input.reduce(
    (list, row, y) =>
      row.reduce((list, tile, x) => {
        // add a galaxy
        if (tile === '#') {
          list.push(new Galaxy(x, y));
        }
        return list;
      }, list),

    []
  );
  return galaxies;
}

function getListOfGalaxyPair(galaxies) {
  const list = galaxies.reduce((_list, galaxy1, index, _galaxies) => {
    _galaxies.slice(index + 1).forEach((galaxy2) => {
      const p = new GalaxyPair(galaxy1, galaxy2);
      _list.push(p);
    });
    return _list;
  }, []);

  return list;
}

function part1(input) {
  const width = input[0].length;
  console.log(`Universe H:${input.length} W:${width}`);

  // expanse the universe first
  const expandedUniverse = input.reduce((_universe, row) => {
    if (isEmptyRow(row)) {
      _universe.push(new Array(width).fill('.'));
    }
    _universe.push(row);
    return _universe;
  }, []);

  for (let i = 0; i < expandedUniverse[0].length; i++) {
    if (isEmptyColumn(expandedUniverse, i)) {
      for (const row of expandedUniverse) {
        row.splice(i, 0, '.');
      }
      i++; // jump one column
    }
  }

  console.log(`Universe Expanded H:${expandedUniverse.length} W:${expandedUniverse[0].length}`);
  const galaxies = getListOfGalaxy(expandedUniverse);
  galaxies.sort((a, b) => a.x - b.x);
  console.log(`Number of galaxies:${galaxies.length}`);
  const galaxyPairs = getListOfGalaxyPair(galaxies);
  console.log(`Universe galaxy pairs:${galaxyPairs.length}`);

  let totalDistance = 0;
  let index = 0;
  for (const pair of galaxyPairs) {
    const d = pair.getStepCountEuclidean();
    //console.log(`${index}/${galaxyPairs.length}:${pair} -> ${d}`);
    totalDistance += d;
    index++;
  }
  return totalDistance;
}

const EXPANSION_FACTOR = 1_000_000;
function part2(input) {
  // get list of galaxies before expanding the universe
  const galaxies = getListOfGalaxy(input);

  let expansion = 0;
  const listOfRowToExpand = input.reduce((_list, row, index) => {
    if (isEmptyRow(row)) {
      _list.push(index + expansion);
      expansion += EXPANSION_FACTOR - 1;
    }
    return _list;
  }, []);

  expansion = 0;
  const listOfColumnToExpand = [];
  for (let i = 0; i < input[0].length; i++) {
    if (isEmptyColumn(input, i)) {
      listOfColumnToExpand.push(i + expansion);
      expansion += EXPANSION_FACTOR - 1;
    }
  }

  // sort by Y first then move galaxies down
  galaxies.sort((a, b) => a.y - b.y);
  listOfRowToExpand.forEach((rowPos) => {
    const galaxiesToMove = galaxies.filter((galaxy) => galaxy.y > rowPos);
    galaxiesToMove.forEach((galaxy) => (galaxy.y += EXPANSION_FACTOR - 1));
  });

  // sort by x then shift galaxies right

  galaxies.sort((a, b) => a.x - b.x);
  listOfColumnToExpand.forEach((colPos) => {
    const galaxiesToMove = galaxies.filter((galaxy) => galaxy.x > colPos);
    galaxiesToMove.forEach((galaxy) => (galaxy.x += EXPANSION_FACTOR - 1));
  });

  const galaxyPairs = getListOfGalaxyPair(galaxies);
  let totalDistance = 0;
  let index = 0;
  for (const pair of galaxyPairs) {
    const d = pair.getStepCountEuclidean();
    //console.log(`${index}/${galaxyPairs.length}:${pair} -> ${d}`);
    totalDistance += d;
    index++;
  }
  return totalDistance;
}

const input1 = readInput(`d${DAY}-sample.txt`);
//const input = readInput(`d${DAY}-input.txt`);
ElapsedTime('Part 1', part1, input1);
//const input2 = readInput(`d${DAY}-sample.txt`);
const input2 = readInput(`d${DAY}-input.txt`);
ElapsedTime('Part 2', part2, input2);
