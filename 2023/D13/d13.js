/*
Advent Of Code 2023
Day 13: Point of Incidence part 1 & 2

https://adventofcode.com/2023/day/13
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2023';
const DAY = '13';

class Matrix {
  constructor() {
    this.part2 = false;
    this.width = 0;
    this.height = 0;
    this.rows = [];
    this.foundSmudge = false; // use for part2
  }

  addRow(row) {
    if (this.height === 0) {
      this.width = row.length;
    }
    if (this.width !== row.length) throw new Error('Matrix row length should be identical');
    this.rows.push(row);
    this.height++;
  }

  reflectingRows(r1, r2) {
    if (r1 < 0 || r2 >= this.height) return false;
    for (let i = 0; i < this.width; i++) {
      if (this.rows[r1][i] !== this.rows[r2][i]) {
        if (this.part2) {
          if (this.foundSmudge) {
            return false;
          }
          this.foundSmudge = true; // first difference found, set the flag
          continue;
        }
        return false;
      }
    }
    return true;
  }

  reflectingColumns(c1, c2) {
    if (c1 < 0 || c2 >= this.width) return false;
    for (let i = 0; i < this.height; i++) {
      if (this.rows[i][c1] !== this.rows[i][c2]) {
        if (this.part2) {
          if (this.foundSmudge) {
            return false;
          }
          this.foundSmudge = true; // first difference found, set the flag
          continue;
        }
        return false;
      }
    }
    return true;
  }

  getPatternHeight(r1, r2) {
    let gap = 1;
    while (this.reflectingRows(r1 - gap, r2 + gap)) gap++;
    return gap - 1;
  }

  getPatternWidth(c1, c2) {
    let gap = 1;
    while (this.reflectingColumns(c1 - gap, c2 + gap)) gap++;
    return gap - 1;
  }

  getReflection(part2 = false) {
    this.part2 = part2;

    // first check horizontally
    const horizontalAxes = [];
    for (let i = 0; i < this.height - 1; i++) {
      if (this.reflectingRows(i, i + 1)) {
        horizontalAxes.push([i, i + 1, this.foundSmudge]); // need to keep track that this pair has a smudge
      }
      this.foundSmudge = false; // clear the flag before searching for the next pair
    }

    // for each potential axes of reflection check how many reflection rows and check if we reach an edge
    for (const [r1, r2, hasSmudge] of horizontalAxes) {
      const h = this.getPatternHeight(r1, r2);
      // for part2 if the axe has a smudge other rows can't have one ...
      if (this.part2 && hasSmudge && this.foundSmudge) {
        this.foundSmudge = false;
        continue;
      }
      // we got an winner, return number of rows to the top
      if (r1 - h === 0 || r2 + h === this.height - 1) {
        // for part2 the mirror must have a smudge ...
        if (this.part2 && !this.foundSmudge && !hasSmudge) continue;
        return (r1 + 1) * 100;
      }
      this.foundSmudge = false; // clear the flag before next axe
    }

    // then check vertically
    this.foundSmudge = false;
    const verticalAxes = [];
    for (let i = 0; i < this.width - 1; i++) {
      if (this.reflectingColumns(i, i + 1)) {
        verticalAxes.push([i, i + 1, this.foundSmudge]); // need to keep track that this pair has a smudge
      }
      this.foundSmudge = false; // clear the flag before searching for the next pair
    }

    // for each potential axes of reflection check how many reflection columns and check if we reach an edge
    for (const [c1, c2, hasSmudge] of verticalAxes) {
      const w = this.getPatternWidth(c1, c2);
      // for part2 if the axe has a smudge other columns can't have one ...
      if (this.part2 && hasSmudge && this.foundSmudge) {
        this.foundSmudge = false;
        continue;
      }
      // we got an winner, return number of columns to the left
      if (c1 - w === 0 || c2 + w === this.width - 1) {
        // for part2 the mirror must have a smudge ...
        if (this.part2 && !this.foundSmudge && !hasSmudge) continue;
        return c1 + 1;
      }
      this.foundSmudge = false; // clear the flag before next axe
    }

    return 0;
  }
}

function readInput(filename) {
  const readRawInput = () => {
    const data = fs.readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename));
    const input = data.toString().split('\n');
    const matrixes = [];
    let matrix = new Matrix();
    for (const l of input) {
      if (l.length === 0) {
        matrixes.push(matrix);
        matrix = new Matrix();
        continue;
      }
      matrix.addRow(l);
    }

    return matrixes;
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
  const result = input.reduce((c, matrix, index) => {
    const r1 = matrix.getReflection();
    c += r1;
    //  console.log(`M-${index}:${r1} ${c}`);
    return c;
  }, 0);
  return result;
}

function part2(input) {
  const result = input.reduce((c, matrix, index) => {
    const r1 = matrix.getReflection(true);
    c += r1;
    // console.log(`M-${index}:${r1} ${c}`);
    return c;
  }, 0);
  return result;
}

//const input = readInput(`d${DAY}-sample.txt`);
const input = readInput(`d${DAY}-input.txt`);
ElapsedTime('Part 1', part1, input);
ElapsedTime('Part 2', part2, input);
