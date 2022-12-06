"""
Advent Of Code 2022
Day 6: Tuning Trouble part 1 & 2

https://adventofcode.com/2022/day/6
"""
from time import perf_counter as pfc
import os

YEAR = "2022"
DAY = "06"

def readInput(filename):
  with open(os.path.join(f"{YEAR}", f"D{DAY}", filename)) as f:
    lines = f.readlines()
  return list(lines[0].strip('\n'))

def solve(input, packetSize):
  startTime = pfc()
  for i, _ in enumerate(input):
    if len(set(input[i:i + packetSize])) == packetSize:
      break
  print(f"Time: {pfc() - startTime:.4}")
  return i + packetSize

input = readInput(f"d{DAY}-input.txt")
print(f"Part 1 for puzzle input: {solve(input,4)}")
print(f"Part 2 for puzzle input: {solve(input,14)}")
