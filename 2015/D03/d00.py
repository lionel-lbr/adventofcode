"""
Advent Of Code 2015
Day X: xxx part 1 & 2

https://adventofcode.com/2015/day/X
"""
from time import perf_counter as pfc
import os

YEAR = "2015"
DAY = "00"

def readInput(filename):
  with open(os.path.join(f"{YEAR}", f"D{DAY}", filename)) as f:
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
print(f"Part 1: {part1(input)}")
print(f"Part 2: {part2(input)}")
