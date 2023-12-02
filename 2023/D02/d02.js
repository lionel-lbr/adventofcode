/*
Advent Of Code 2023
Day 2: Cube Conundrum part 1 & 2

https://adventofcode.com/2023/day/2
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2023';
const DAY = '02';

function readInput(filename) {
  const readRawIntput = () => {
    const data = fs.readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename));
    const input = data
      .toString()
      .split('\n')
      .map((s) => {
        const [id, gameList] = s.split(':');
        const games = gameList.split(';').map((g) =>
          g.split(',').reduce((r, ig) => {
            const [score, color] = ig.trim().split(' ');
            r[color] = parseInt(score);
            return r;
          }, {})
        );

        return [parseInt(id.split(' ')[1]), ...games];
      });
    return input;
  };

  const parseALine = (line) => {};

  try {
    return readRawIntput();
  } catch (err) {
    console.error(err);
  }
}

function part1(input) {
  const RED = 12;
  const GREEN = 13;
  const BLUE = 14;

  const result = input.reduce((r, gameList) => {
    const id = gameList[0];
    if (
      gameList
        .slice(1)
        .every(
          (game) =>
            (game.red ? game.red <= RED : true) &&
            (game.green ? game.green <= GREEN : true) &&
            (game.blue ? game.blue <= BLUE : true)
        )
    )
      r += id;
    return r;
  }, 0);
  return result;
}

function part2(input) {
  const result = input.reduce((r, gameList) => {
    const id = gameList[0];

    const minValues = gameList.slice(1).reduce(
      (min, game) => {
        if (game.red && min.red <= game.red) min.red = game.red;
        if (game.green && min.green <= game.green) min.green = game.green;
        if (game.blue && min.blue <= game.blue) min.blue = game.blue;
        return min;
      },
      { red: 0, green: 0, blue: 0 }
    );

    r += minValues.red * minValues.green * minValues.blue;
    return r;
  }, 0);
  return result;
}

const input = readInput(`d${DAY}-input.txt`);
//const input = readInput(`d${DAY}-sample.txt`);
console.log(`Part 1: ${part1(input)}`);
console.log(`Part 2: ${part2(input)}`);
