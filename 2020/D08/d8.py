"""
Advent Of Code 2020
Day 8: Handheld Halting part 1 & 2

https://adventofcode.com/2020/day/8
"""
import os

def readInput(filename):
  with open(os.path.join("2020", "D08", filename)) as f:
    lines = f.readlines()
  input = ((i, int(v)) for i, v in (d.strip('\n').split(" ") for d in lines))
  return tuple(input)

def part1(input):
  visited = [False] * len(input)
  acc = 0
  pc = 0
  while True:
    if visited[pc] == True:
      return acc
    visited[pc] = True
    op, val = input[pc]
    if op == "nop":
      pc += 1
      continue
    if op == "acc":
      acc += val
      pc += 1
      continue
    if op == "jmp":
      pc += val
      continue

def part2(input):
  lastPc = len(input)
  jmpNopIndex = (i for i, (op, _) in enumerate(input) if op in ["nop", "jmp"])
  for i in jmpNopIndex:
    inputList = list(input)
    # swap nop <-> jmp
    op, val = inputList[i]
    inputList[i] = ("nop", val) if op == "jmp" else ("jmp", val)
    acc, pc = 0, 0
    visited = [False] * len(input)
    while True:
      if pc == lastPc:
        return acc
      if pc < 0 or pc >= len(visited) or visited[pc] == True:
        break
      visited[pc] = True
      op, val = inputList[pc]
      if op == "nop":
        pc += 1
        continue
      if op == "acc":
        acc += val
        pc += 1
        continue
      if op == "jmp":
        pc += val
        continue

input = readInput("d8-input.txt")
print(f"Part 1: {part1(input)}")
print(f"Part 2: {part2(input)}")