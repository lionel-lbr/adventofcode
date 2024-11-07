/*
Advent Of Code 2023
Day 5: If You Give A Seed A Fertilizer part 1 & 2

https://adventofcode.com/2023/day/5
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2023';
const DAY = '05';

const KEYS = {
  SEEDS: 'seeds',
  SEED_TO_SOIL: 'seed-to-soil',
  SOIL_TO_FERTILIZER: 'soil-to-fertilizer',
  FERTILIZER_TO_WATER: 'fertilizer-to-water',
  WATER_TO_LIGHT: 'water-to-light',
  LIGHT_TO_TEMP: 'light-to-temperature',
  TEMP_TO_HUMIDITY: 'temperature-to-humidity',
  HUMIDITY_TO_LOC: 'humidity-to-location',
};

function readInput(filename) {
  const readRawIntput = () => {
    const data = fs.readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename));

    const input = {
      [KEYS.SEED_TO_SOIL]: [],
      [KEYS.SOIL_TO_FERTILIZER]: [],
      [KEYS.FERTILIZER_TO_WATER]: [],
      [KEYS.WATER_TO_LIGHT]: [],
      [KEYS.LIGHT_TO_TEMP]: [],
      [KEYS.TEMP_TO_HUMIDITY]: [],
      [KEYS.HUMIDITY_TO_LOC]: [],
    };
    data
      .toString()
      .split('\n')
      .filter((s) => s.length > 0)
      .forEach((s) => {
        const [key_str, values] = s.split(':');
        const [key, _] = key_str.split(' ');
        switch (key) {
          case KEYS.SEEDS:
            input.seeds = values.split(' ').map((v) => parseInt(v));
            break;
          default:
            const [dst, src, range] = values.split(' ').map((v) => parseInt(v));
            input[key].push({
              src: { start: src, end: src + range - 1 },
              dst: { start: dst, end: dst + range - 1 },
              range,
            });
            break;
        }
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
  // sort each elements.
  for (k in KEYS) {
    if (KEYS[k] === KEYS.SEEDS) input[KEYS[k]].sort((a, b) => a - b);
    else input[KEYS[k]].sort((a, b) => a.src.start - b.src.start);
  }

  const mapSrcToDst = (seeds, ranges) => {
    const newSeeds = seeds.map((seed) => {
      for (range of ranges) {
        // lower than the range, return the seed
        if (seed < range.src.start) return seed;
        // seed within the range
        if (seed <= range.src.end) {
          const delta = seed - range.src.start;
          return range.dst.start + delta;
        }
      }
      // didn't find any ranges
      return seed;
    });

    return newSeeds;
  };

  input[KEYS.SEEDS] = mapSrcToDst(input[KEYS.SEEDS], input[KEYS.SEED_TO_SOIL]);
  input[KEYS.SEEDS] = mapSrcToDst(input[KEYS.SEEDS], input[KEYS.SOIL_TO_FERTILIZER]);
  input[KEYS.SEEDS] = mapSrcToDst(input[KEYS.SEEDS], input[KEYS.FERTILIZER_TO_WATER]);
  input[KEYS.SEEDS] = mapSrcToDst(input[KEYS.SEEDS], input[KEYS.WATER_TO_LIGHT]);
  input[KEYS.SEEDS] = mapSrcToDst(input[KEYS.SEEDS], input[KEYS.LIGHT_TO_TEMP]);
  input[KEYS.SEEDS] = mapSrcToDst(input[KEYS.SEEDS], input[KEYS.TEMP_TO_HUMIDITY]);
  input[KEYS.SEEDS] = mapSrcToDst(input[KEYS.SEEDS], input[KEYS.HUMIDITY_TO_LOC]);
  input[KEYS.SEEDS].sort((a, b) => a - b);

  return input[KEYS.SEEDS][0];
}

function part2(input) {
  // sort each elements.
  let seedIntervals = [];
  for (let i = 0; i < input[KEYS.SEEDS].length; i += 2) {
    const seed = input[KEYS.SEEDS][i];
    const range = input[KEYS.SEEDS][i + 1];
    seedIntervals.push({ start: seed, end: seed + range, range });
  }

  input[KEYS.SEEDS] = seedIntervals;
  for (k in KEYS) {
    // sort by ascending range start
    if (KEYS[k] === KEYS.SEEDS) input[KEYS[k]].sort((a, b) => a.start - b.start);
    else input[KEYS[k]].sort((a, b) => a.src.start - b.src.start);
  }

  const mapSrcToDst = (seedRanges, ranges) => {
    const newSeedRanges = [];
    for (seedRange of seedRanges) {
      const { start, end } = seedRange;
      let foundARange = false;
      for (range of ranges) {
        // lower than the range, return the seed
        if (end < range.src.start) {
          newSeedRanges.push(seedRange);
          foundARange = true;
          break;
        }

        // split the range
        if (start <= range.src.start) {
          if (end <= range.src.end) {
            const delta = range.src.range - (range.src.end - end);
            newSeedRanges.push({ start, end: range.rsc.start - 1, range: range.rsc.start - 1 - start + 1 });
            newSeedRanges.push({ start: range.src.start, end, range: end - range.src.start + 1 });
            foundARange = true;
            break;
          }
          console.log('interval bigger than range');
          break;
        }

        // seed within the range return the translated range
        if (start >= range.src.start && end <= range.src.end) {
          const delta = start - range.src.start;
          newSeedRanges.push({
            start: range.dst.start + delta,
            end: range.dst.start + delta + seedRange.range - 1,
            range: seedRange.range,
          });
          foundARange = true;
          break;
        }

        // split the range
        if (start <= range.src.end) {
          const delta = start - range.src.start;
          const range1 = range.dst.end - (range.dst.start + delta) + 1;
          newSeedRanges.push({ start: range.dst.start + delta, end: range.dst.end, range: range1 });
          newSeedRanges.push({ start: range.src.end + 1, end, range: seedRange.range - range1 - 1 });
          foundARange = true;
          break;
        }

        /**
         *                        [dst.start .... dst.end]
         *                        [src.start .... src.end]
         *                               [start .............. end]
         *
         *                               [dst.start + (start - src.start)
         *                                    ... dst.end]
         *
         *
         *
         */
      }
      if (!foundARange) newSeedRanges.push(seedRange);
    }

    return newSeedRanges;
  };

  seedIntervals = mapSrcToDst(input[KEYS.SEEDS], input[KEYS.SEED_TO_SOIL]);
  seedIntervals = mapSrcToDst(seedIntervals, input[KEYS.SOIL_TO_FERTILIZER]);
  seedIntervals = mapSrcToDst(seedIntervals, input[KEYS.FERTILIZER_TO_WATER]);
  seedIntervals = mapSrcToDst(seedIntervals, input[KEYS.WATER_TO_LIGHT]);
  seedIntervals = mapSrcToDst(seedIntervals, input[KEYS.LIGHT_TO_TEMP]);
  seedIntervals = mapSrcToDst(seedIntervals, input[KEYS.TEMP_TO_HUMIDITY]);
  seedIntervals = mapSrcToDst(seedIntervals, input[KEYS.HUMIDITY_TO_LOC]);
  seedIntervals.sort((a, b) => a.start - b.start);

  return seedIntervals[0].start;
}

const input1 = readInput(`d${DAY}-sample.txt`);
//const input1 = readInput(`d${DAY}-input.txt`);
console.log(`Part 1: ${part1(input1)}`);
const input2 = readInput(`d${DAY}-sample.txt`);
//const input2 = readInput(`d${DAY}-input.txt`);
console.log(`Part 2: ${part2(input2)}`);
