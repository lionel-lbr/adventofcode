"""
Advent Of Code 2020
Day 1: Report Repair part 1 & 2

https://adventofcode.com/2020/day/1
"""
import os
from time import perf_counter as pfc

def readInput(filename):
  with open(os.path.join("2020", "D01", filename)) as f:
    lines = f.readlines()
  input = (int(d.strip('\n')) for d in lines if len(d.strip('\n')) > 0)
  return tuple(input)

def part1(sortedInput):
  for v1 in reversed(sortedInput):
    for v2 in sortedInput:
      if v1 + v2 > 2020:
        break
      if v1 + v2 == 2020:
        return v1 * v2

def part2(sortedInput):
  for v1 in reversed(sortedInput):
    for j, v2 in enumerate(sortedInput):
      if v1 + v2 > 2020:
        break
      for v3 in sortedInput[j + 1:]:
        if v1 + v2 + v3 > 2020:
          break
        if v1 + v2 + v3 == 2020:
          return v1 * v2 * v3

def solve(filename):
  input = list(readInput(filename))
  input.sort()
  start = pfc()
  r1 = part1(input)
  print(f"Part 1: {r1} - time:{(pfc() - start):.3}")

  start = pfc()
  r2 = part2(input)
  print(f"Part 2: {r2} - time:{(pfc() - start):.2}")

solve('d1-input.txt')
