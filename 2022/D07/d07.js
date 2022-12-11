/*
Advent Of Code 2022
Day 7: No Space Left On Device part 1 & 2

https://adventofcode.com/2022/day/7
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2022';
const DAY = '07';

const EntryType = Object.freeze({
  FILE: 'FILE',
  FOLDER: 'FOLDER',
});

function Entry(name, type, size = null) {
  this.name = name;
  this.type = type;
  this.size = size;
  this.parent = null;
  this.childs = [];

  this.addChild = (entry) => {
    this.childs.push(entry);
    entry.parent = this;
  };

  this.getChild = (name) => {
    const child = this.childs.find((e) => e.name === name);
    return child;
  };

  this.calculateSize = () => {
    const _calculate = (entry) => {
      if (entry.type === EntryType.FILE) return entry.size;
      const size = entry.childs.reduce((s, e) => s + _calculate(e), 0);
      if (entry.type === EntryType.FOLDER) entry.size = size;
      return size;
    };
    _calculate(this);
    return this.size;
  };

  this.getFolders = (criteria) => {
    const list = [];
    const _getFolders = (entry) => {
      if (entry.type === EntryType.FILE) return;
      if (entry.type === EntryType.FOLDER && criteria(entry)) list.push(entry);
      entry.childs.forEach((e) => _getFolders(e));
    };

    _getFolders(this);
    return list;
  };
}

function readInput(filename) {
  return fs
    .readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename))
    .toString()
    .split(`\n`)
    .filter((l) => l);
}

const fileSystem = new Entry('ROOT', EntryType.FOLDER);

function part1(input) {
  let currentFolder = fileSystem;

  const isCommand = (i) => i.startsWith('$');
  const isDir = (i) => i.startsWith('dir');
  const getCommand = (i) => {
    const [_, cmd, fname] = i.split(' ');
    return { cmd, fname };
  };
  const getInfo = (i) => {
    const [size, fname] = i.split(' ');
    return { size, fname };
  };

  for (i of input) {
    if (isCommand(i)) {
      const { cmd, fname } = getCommand(i);
      // navigate to subfolder or parent
      if (cmd === 'cd') {
        if (fname === '..') {
          currentFolder = currentFolder.parent;
        } else {
          let child = currentFolder.getChild(fname);
          if (!child) {
            child = new Entry(fname, EntryType.FOLDER);
            currentFolder.addChild(child);
          }
          currentFolder = child;
        }
      }
      continue;
    }

    // add Dir
    if (isDir(i)) {
      const { fname } = getInfo(i);
      let child = currentFolder.getChild(fname);
      if (!child) {
        child = new Entry(fname, EntryType.FOLDER);
        currentFolder.addChild(child);
      }
      continue;
    }

    // add File
    const { size, fname } = getInfo(i);
    let child = currentFolder.getChild(fname);
    if (!child) {
      child = new Entry(fname, EntryType.FILE, Number(size));
      currentFolder.addChild(child);
    }
  }

  fileSystem.calculateSize();
  const folders = fileSystem.getFolders((e) => e.size <= 100_000);
  const result = folders.reduce((s, e) => s + e.size, 0);
  return result;
}

function part2() {
  const TOTAL_SPACE = 70_000_000;
  const REQUIRED_SPACE = 30_000_000;

  const usedSpace = fileSystem.size;
  const toBeDeleted = REQUIRED_SPACE - (TOTAL_SPACE - usedSpace);

  const folders = fileSystem.getFolders((e) => e.size >= toBeDeleted);
  folders.sort((a, b) => a.size - b.size); // smallest is at pos 0
  return folders[0].size;
}

const input = readInput(`d${DAY}-input.txt`);
console.log(`Part 1: ${part1(input)}`);
console.log(`Part 2: ${part2()}`);
