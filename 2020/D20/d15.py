"""
Advent Of Code 2020
Day 15: xxx part 1 & 2

https://adventofcode.com/2020/day/15
"""
from time import perf_counter as pfc
import os

DAY = "15"

def readInput(filename):
  with open(os.path.join("2020", f"D{DAY}", filename)) as f:
    lines = f.readlines()
  input = (d.strip('\n') for d in lines)
  return tuple(input)

def part1(input):
  startTime = pfc()
  print(f"Part 1 time: {pfc() - startTime:.4}")
  return

def part2(input):
  startTime = pfc()
  print(f"Part 2 time: {pfc() - startTime:.4}")
  return

input = readInput(f"d{DAY}-input.txt")
print(f"Part 1 for puzzle input: {part1(input)}")
print(f"Part 2 for puzzle input: {part2(input)}")
