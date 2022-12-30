/*
Advent Of Code 2022
Day 19: Not Enough Minerals part 1 & 2

https://adventofcode.com/2022/day/19
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2022';
const DAY = '19';

function readInput(filename) {
  const parseALine = (line) => {
    const [ore, clay, obsidian, geode] = line.split(':')[1].split('.');
    const r = {
      ore: { ore: Number(ore.trim().split(' ')[4]) },
      clay: { ore: Number(clay.trim().split(' ')[4]) },
      obsidian: { ore: Number(obsidian.trim().split(' ')[4]), clay: Number(obsidian.trim().split(' ')[7]) },
      geode: { ore: Number(geode.trim().split(' ')[4]), obsidian: Number(geode.trim().split(' ')[7]) },
    };
    return r;
  };

  return fs
    .readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename))
    .toString()
    .split(`\n`)
    .filter((l) => l)
    .map((l) => parseALine(l));
}

function canBuildRobot(blueprint, mineral) {
  for (n of Object.keys(blueprint)) {
    if (blueprint[n] > mineral[n]) return false;
  }
  return true;
}

function produceMinerals(robots, minerals) {
  ['geode', 'obsidian', 'clay', 'ore'].forEach((name) => (minerals[name] += robots[name]));
}

function consumeMinerals(blueprint, mineral) {
  const names = Object.keys(blueprint);
  for (n of names) mineral[n] -= blueprint[n];
}

function neededMinerals(type, blueprint) {
  let count = -Infinity;
  for (b of Object.keys(blueprint)) {
    count = Math.max(count, blueprint[b][type] || 0);
  }
  return count;
}

function solve(blueprint, maxMinutes) {
  const neededMaterial = {
    ore: neededMinerals('ore', blueprint),
    clay: neededMinerals('clay', blueprint),
    obsidian: neededMinerals('obsidian', blueprint),
    geode: Infinity,
  };

  let maxGeodeProduced = 0;
  const dfs = (robot, mineral, minute = 0) => {
    // record max value
    if (mineral.geode > maxGeodeProduced) {
      maxGeodeProduced = mineral.geode;
    }

    // end of recursion
    if (minute === maxMinutes) {
      return mineral.geode;
    }

    // try to prune the tree and keep branches
    const timeLeft = maxMinutes - minute;
    const timeLeftProduction = (timeLeft * (timeLeft + 1)) / 2 - 1; // n+(n-1)+(n-2).. : n(n+1)/2

    // this branch won't be able to produce more geodes that the current max
    if (mineral.geode + robot.geode * timeLeft + timeLeftProduction <= maxGeodeProduced) {
      return mineral.geode;
    }

    // this branch won't be able to produce enough obsidian to create a geode robot
    if (
      robot.geode === 0 &&
      mineral.obsidian + robot.obsidian * timeLeft + timeLeftProduction < blueprint['geode']['obsidian']
    ) {
      return mineral.geode;
    }

    let maxGeodes = 0;
    ['geode', 'obsidian', 'clay', 'ore'].forEach((name) => {
      // if robots can be built in that minute, produce it and recurse
      if (robot[name] < neededMaterial[name] && canBuildRobot(blueprint[name], mineral)) {
        const updatedMineral = Object.assign({}, mineral);
        const updatedRobot = Object.assign({}, robot);
        consumeMinerals(blueprint[name], updatedMineral);
        produceMinerals(robot, updatedMineral);
        updatedRobot[name] += 1;
        const geode = dfs(updatedRobot, updatedMineral, minute + 1);
        maxGeodes = Math.max(maxGeodes, geode);
      }
    });

    // recurse without producing bot
    produceMinerals(robot, mineral);
    const geode = dfs(robot, mineral, minute + 1);
    maxGeodes = Math.max(maxGeodes, geode);
    return maxGeodes;
  };

  const robots = {
    ore: 1,
    clay: 0,
    obsidian: 0,
    geode: 0,
  };

  const minerals = {
    ore: 0,
    clay: 0,
    obsidian: 0,
    geode: 0,
  };

  const t1 = performance.now();
  const result = dfs(robots, minerals);
  console.log(`time: ${(performance.now() - t1) / 1000}`);
  return result;
}

function part1(input) {
  const startTime = performance.now();
  let result = 0;
  input.forEach((blueprint, index) => {
    const r = solve(blueprint, 24);
    result += (index + 1) * r;
    console.log(`${index + 1} -> ${r}  local score: ${result}`);
  });
  console.log(`Total time: ${(performance.now() - startTime) / 1000}`);
  return result;
}

function part2(input) {
  const startTime = performance.now();
  let result = 1;
  input.slice(0, 3).forEach((blueprint, index) => {
    const r = solve(blueprint, 32);
    result *= r;
    console.log(`${index + 1} -> ${r}  local score: ${result}`);
  });
  console.log(`Total time: ${(performance.now() - startTime) / 1000}`);
  return result;
}

//const input = readInput(`d${DAY}-sample.txt`);
const input = readInput(`d${DAY}-input.txt`);
console.log(`Part 1: ${part1(input)}`);
console.log(`Part 2: ${part2(input)}`);
