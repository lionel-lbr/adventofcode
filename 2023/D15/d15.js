/*
Advent Of Code 2023
Day 15: Lens Library part 1 & 2

https://adventofcode.com/2023/day/15
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2023';
const DAY = '15';

function readInput(filename) {
  const readRawInput = () => {
    const data = fs.readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename));
    const input = data
      .toString()
      .split(',')
      .filter((s) => s.length > 0);

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

function part1(input) {
  // sum up all hashes with reduce
  const result = input.reduce(
    (r, line) =>
      r +
      line
        .split('')
        .map((c) => c.charCodeAt(0))
        .reduce((v, code) => ((v + code) * 17) % 256, 0),
    0
  );
  return result;
}

function part2(input) {
  const EQUAL_SIGN = '=';
  const MINUS_SIGN = '-';

  const getHashAndValueFromLabel = (label) => {
    const indexOfEqual = label.indexOf(EQUAL_SIGN);
    const indexOfMinus = label.indexOf(MINUS_SIGN);
    const index = Math.max(indexOfEqual, indexOfMinus);
    const name = label.slice(0, index);
    const hash = name
      .split('')
      .map((c) => c.charCodeAt(0))
      .reduce((v, code) => ((v + code) * 17) % 256, 0);
    // extract the focal if any
    if (indexOfEqual > 0) {
      const focal = parseInt(label[indexOfEqual + 1]);
      return { boxIndex: hash, name, focal };
    }
    // if no focal just return hash and name
    return { boxIndex: hash, name };
  };

  // distribute lens into boxes with a reduce through the initialization sequence
  const boxes = input.reduce(
    (boxes, label) => {
      // extract information from the label
      const { boxIndex, name, focal } = getHashAndValueFromLabel(label);
      // find the lens in the box
      const lensIndex = boxes[boxIndex].findIndex((lens) => lens.name === name);
      if (focal) {
        // replace the lens
        if (lensIndex > -1) boxes[boxIndex][lensIndex] = { name, focal };
        else boxes[boxIndex].push({ name, focal }); // or add it at the end
        return boxes;
      }
      // if no lens in that box, nothing to remove
      if (lensIndex === -1) return boxes;
      // remove the length from the box
      boxes[boxIndex].splice(lensIndex, 1);
      return boxes;
    },
    new Array(256).fill(0).map(() => []) // create an array of array
  );

  // another reduce to calculate the final result
  const result = boxes.reduce(
    (r, box, boxIndex) =>
      r + box.reduce((_r, { focal }, lensIndex) => _r + (boxIndex + 1) * (lensIndex + 1) * focal, 0),
    0
  );
  return result;
}

//const input = readInput(`d${DAY}-sample.txt`);
const input = readInput(`d${DAY}-input.txt`);
ElapsedTime('Part 1', part1, input);
ElapsedTime('Part 2', part2, input);
