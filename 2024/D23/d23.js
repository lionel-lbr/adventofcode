/*
Advent Of Code 2024
Day 23: LAN Party part 1 & 2

https://adventofcode.com/2024/day/23
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2024';
const DAY = '23';

function readInput(filename) {
  const readRawInput = () => {
    const data = fs.readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename));
    const input = data
      .toString()
      .split('\n')
      .filter((l) => l.length > 0)
      .map((l) => l.split('-'));
    return input;
  };
  try {
    return readRawInput();
  } catch (err) {
    console.error(err);
  }
}

function solution1(input) {
  const groups = new Set();
  const connected = new Map();

  for (const pair of input) {
    const [c1, c2] = pair;
    if (connected.has(c1)) connected.get(c1).push(c2);
    else connected.set(c1, [c2]);
    if (connected.has(c2)) connected.get(c2).push(c1);
    else connected.set(c2, [c1]);
  }

  let groupWithTCount = 0;
  for (const c1 of connected.keys()) {
    for (const c2 of connected.get(c1)) {
      for (const c3 of connected.get(c2)) {
        if (connected.get(c1).find((c) => c === c3)) {
          const g = [c1, c2, c3].sort();
          const k = g.join(',');
          if (!groups.has(k)) {
            groups.add(k);
            if (c1.startsWith('t') || c2.startsWith('t') || c3.startsWith('t')) groupWithTCount++;
          }
        }
      }
    }
  }
  let result = groupWithTCount;
  return result;
}

// Use a variation of Pairwise Intersection of Neighbors
function findSharedNodes(graph) {
  const sharedNodes = new Map();
  const nodes = [...graph.keys()];

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const nodeA = nodes[i];
      const nodeB = nodes[j];

      const neighborsA = new Set(graph.get(nodeA));
      const neighborsB = new Set(graph.get(nodeB));

      // Find intersection
      const intersection = [...neighborsA].filter((neighbor) => neighborsB.has(neighbor));
      const key = `${nodeA},${nodeB}`;
      sharedNodes.set(key, intersection);
    }
  }

  // get the highest number of mutual connection
  let commonNodeSetCount = [...sharedNodes.values()].reduce((m, c) => Math.max(m, c.length), -1);

  while (commonNodeSetCount > 0) {
    const validPairs = new Set([...sharedNodes.keys()].filter((p) => sharedNodes.get(p).length === commonNodeSetCount));
    // ignore set of pairs if not enough pairs to satisfied number of connections
    if (validPairs.size < (commonNodeSetCount * (commonNodeSetCount + 1)) / 2) {
      commonNodeSetCount--;
      continue;
    }

    for (const pair of [...validPairs]) {
      // all pairs should shared the same connections
      const nodeSet = new Set([...pair.split(','), ...sharedNodes.get(pair)]);
      const nodeArray = [...nodeSet];
      let endSearch = false;
      for (let i = 0; i < nodeArray.length - 1; i++) {
        const c1 = nodeArray[i];
        for (let j = i + 1; j < nodeArray.length; j++) {
          endSearch = true;
          const c2 = nodeArray[j];
          const k1 = `${c1},${c2}`;
          const k2 = `${c2},${c1}`;
          if (!validPairs.has(k1) && !validPairs.has(k2)) break;
          const nextSet = sharedNodes.has(k1) ? sharedNodes.get(k1) : sharedNodes.get(k2);
          // check that check each connections of the pair is already in the set
          if (![...nextSet].every((v) => nodeSet.has(v))) break;
          endSearch = false;
        }
        if (endSearch) break;
      }
      if (!endSearch) return nodeArray;
    }
    commonNodeSetCount--;
  }
  return []; // didn't find any sets
}

function solution2(input) {
  const connected = new Map();

  for (const pair of input) {
    const [c1, c2] = pair;
    if (connected.has(c1)) connected.get(c1).push(c2);
    else connected.set(c1, [c2]);
    if (connected.has(c2)) connected.get(c2).push(c1);
    else connected.set(c2, [c1]);
  }

  let result = findSharedNodes(connected);
  return result.sort();
}

function part1(mode) {
  const input = readInput(`d${DAY}-${mode}.txt`);

  const startTime = performance.now();
  const result = solution1(input);
  const elapsed = performance.now() - startTime;
  console.log(`Part 1 ${mode} time: ${Math.floor(elapsed / 60000)}:${Math.floor((elapsed % 60000) / 1000)}:${Math.floor(elapsed % 1000)}`);
  console.log(`Part 1 ${mode} result: ${result}`);
}

function part2(mode) {
  const input = readInput(`d${DAY}-${mode}.txt`);

  const startTime = performance.now();
  const result = solution2(input);
  const elapsed = performance.now() - startTime;
  console.log(`Part 2 ${mode} time: ${Math.floor(elapsed / 60000)}:${Math.floor((elapsed % 60000) / 1000)}:${Math.floor(elapsed % 1000)}`);
  console.log(`Part 2 ${mode} result: ${result}`);
}

part1('sample');
part1('input');
part2('sample');
part2('input');
