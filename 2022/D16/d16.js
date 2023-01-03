/*
Advent Of Code 2022
Day 16: Proboscidea Volcanium part 1 & 2

https://adventofcode.com/2022/day/16
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2022';
const DAY = '16';

function readInput(filename) {
  return fs
    .readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename))
    .toString()
    .split(`\n`)
    .filter((l) => l)
    .reduce((map, l) => {
      const nodeString = l.split(' ');
      const node = {
        name: nodeString[1],
        flow: Number(nodeString[4].split('=')[1].slice(0, -1)),
        childs: [],
      };
      for (let i = 9; i < nodeString.length; i++) {
        const s = nodeString[i];
        if (s.endsWith(',')) node.childs.push(s.slice(0, -1));
        else node.childs.push(s);
      }

      map.set(node.name, node);
      return map;
    }, new Map());
}

function PriorityQueue() {
  const queue = [];
  let needSort = true;

  this.add = (pos) => {
    queue.push(pos);
    needSort = true;
  };

  this.pop = () => {
    if (needSort) {
      queue.sort((n1, n2) => n2.g - n1.g);
      needSort = false;
    }
    return queue.pop();
  };

  this.isEmpty = () => (queue.length > 0 ? false : true);
}

function solveDijkstra(graph, start, end) {
  const visited = new Set();
  const priorityQueue = new PriorityQueue();

  // implement Dijkstra's Algorithm
  const startNode = graph.get(start);
  startNode.g = 0;
  priorityQueue.add(startNode);
  while (!priorityQueue.isEmpty()) {
    const q = priorityQueue.pop();

    // reach destination
    if (q.name === end) return q.g; // return steps count

    if (visited.has(q.name)) continue;
    visited.add(q.name);
    const neighbours = q.childs;
    for (n of neighbours) {
      if (visited.has(n.name)) continue;
      const node = graph.get(n);
      node.g = q.g + 1;
      priorityQueue.add(node);
    }
  }
}

function generateShortestPathToNodeWithFlow(nodeWithFlow) {
  const shortestPathMap = new Map();
  for (let i = 0; i < nodeWithFlow.length; i++) {
    const src = input.get(nodeWithFlow[i]).name;
    for (let j = 0; j < nodeWithFlow.length; j++) {
      const dst = input.get(nodeWithFlow[j]).name;
      if (src === dst || dst === 'AA') continue;
      const d = solveDijkstra(input, src, dst);
      shortestPathMap.set(`${src}->${dst}`, d);
    }
  }
  return shortestPathMap;
}

function part1(input) {
  console.log('Part 1 ...');
  const startTime = performance.now();
  const nodeWithFlow = [...input.keys()].filter((k) => input.get(k).flow > 0);
  nodeWithFlow.splice(0, 0, 'AA');
  const shortestPathMap = generateShortestPathToNodeWithFlow(nodeWithFlow);

  const dfs = (currentValve, currentFlow, minutes, valvesToOpen) => {
    if (minutes <= 0) return currentFlow;

    const node = input.get(currentValve);
    if (node.flow > 0) {
      // open it ...
      minutes -= 1;
      currentFlow += node.flow * minutes;
    }

    let localFlow = currentFlow;
    for (valve of valvesToOpen) {
      const k = `${currentValve}->${valve}`;
      const d = shortestPathMap.get(k);
      const flow = dfs(
        valve,
        currentFlow,
        minutes - d,
        valvesToOpen.filter((v) => v !== valve)
      );
      localFlow = Math.max(localFlow, flow);
    }

    return localFlow;
  };

  // remove "AA"
  nodeWithFlow.shift();
  const result = dfs('AA', 0, 30, nodeWithFlow);
  console.log(`Execution time: ${(performance.now() - startTime) / 1000}`);
  return result;
}

function part2(input) {
  console.log('Part 2 ...');
  const startTime = performance.now();
  const nodeWithFlow = [...input.keys()].filter((k) => input.get(k).flow > 0);
  nodeWithFlow.splice(0, 0, 'AA');
  const shortestPathMap = generateShortestPathToNodeWithFlow(nodeWithFlow);

  const dfs = (currentValves, pressure, minutes, valvesToOpen) => {
    let [minute0, minute1] = minutes;
    if (minute0 === 0 && minute1 === 0) {
      return pressure;
    }

    const [currentValve0, currentValve1] = currentValves;
    const node0 = input.get(currentValve0);
    if (node0.flow > 0) {
      // open it ...
      minute0 = Math.max(0, minute0 - 1);
      pressure += node0.flow * minute0;
    }

    const node1 = input.get(currentValve1);
    if (node1.flow > 0) {
      // open it ...
      minute1 = Math.max(0, minute1 - 1);
      pressure += node1.flow * minute1;
    }

    // one of us reach the end of time, no need to continue
    if (minute0 === 0 || minute1 === 0) {
      return pressure;
    }

    let maxPressure = pressure;
    // generate list of all possibles pairs of valves to open
    const listOfPairs = [];
    for (let i = 0; i < valvesToOpen.length - 1; i++) {
      for (let j = i + 1; j < valvesToOpen.length; j++) {
        listOfPairs.push([valvesToOpen[i], valvesToOpen[j]]);
      }
    }
    for (const valves of listOfPairs) {
      // remove the pair of valves from the list of valves to open ...
      const remainingValvesToOpen = valvesToOpen.filter((v) => v !== valves[0] && v !== valves[1]);

      for (let i = 0; i < 2; i++) {
        const [valve0, valve1] = valves;
        const d0 = shortestPathMap.get(`${currentValve0}->${valve0}`);
        const d1 = shortestPathMap.get(`${currentValve1}->${valve1}`);

        // no need to recurse if node can't be reached within remaining time
        if (d0 >= minute0 && d1 >= minute1) continue;

        // recurse down the tree
        const p = dfs(valves, pressure, [Math.max(0, minute0 - d0), Math.max(0, minute1 - d1)], remainingValvesToOpen);
        maxPressure = Math.max(maxPressure, p);

        // swap the 2 valves and iterate again
        const t = valves[0];
        valves[0] = valves[1];
        valves[1] = t;
      }
    }
    return maxPressure;
  };

  // remove "AA"
  nodeWithFlow.shift();
  const result = dfs(['AA', 'AA'], 0, [26, 26], nodeWithFlow);
  console.log(`Execution time: ${(performance.now() - startTime) / 1000}`);
  return result;
}

//const input = readInput(`d${DAY}-sample.txt`);
const input = readInput(`d${DAY}-input.txt`);
console.log(`Part 1: ${part1(input)}`);
console.log(`Part 2: ${part2(input)}`);
