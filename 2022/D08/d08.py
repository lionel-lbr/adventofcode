"""
Advent Of Code 2022
Day 8: Treetop Tree House part 1 & 2

https://adventofcode.com/2022/day/8
"""
from time import perf_counter as pfc
import os

YEAR = "2022"
DAY = "08"

def readInput(filename):
  with open(os.path.join(f"{YEAR}", f"D{DAY}", filename)) as f:
    lines = f.readlines()
  input = (d.strip('\n') for d in lines)
  return tuple(tuple([int(n) for n in i]) for i in input)

def part1(input):
  startTime = pfc()
  result = set()

  def checkMax(val, x, y, localMax=-1):
    if val > localMax:
      result.add((x, y))
      return val
    return localMax

  for y, row in enumerate(input):
    localMax = -1
    for x, val in enumerate(row):
      localMax = checkMax(val, x, y, localMax)

  for y, row in enumerate(input):
    localMax = -1
    for x, val in reversed(list(enumerate((row)))):
      localMax = checkMax(val, x, y, localMax)

  for x in range(len(input)):
    localMax = -1
    for y, row in enumerate(input):
      localMax = checkMax(row[x], x, y, localMax)

  for x in range(len(input)):
    localMax = -1
    for y, row in reversed(list(enumerate(input))):
      localMax = checkMax(row[x], x, y, localMax)

  print(f"Part 1 time: {pfc() - startTime:.4}")
  return len(result)

def part2(input):
  startTime = pfc()
  mapLength = len(input)

  def scenicScore(x, y, tree=None):
    if tree == None:
      tree = input[y][x]
    else:
      if x == 0 or x == mapLength - 1 or y == 0 or y == mapLength - 1 or input[y][x] >= tree:
        return False
      return True

    # recurse in 4 directions
    up = 1
    while (scenicScore(x, y - up, tree)):
      up += 1
    right = 1
    while (scenicScore(x + right, y, tree)):
      right += 1
    down = 1
    while (scenicScore(x, y + down, tree)):
      down += 1
    left = 1
    while (scenicScore(x - left, y, tree)):
      left += 1
    return up * right * down * left

  score = 0
  for y in range(1, mapLength - 1):
    for x in range(1, mapLength - 1):
      score = max(score, scenicScore(x, y))

  print(f"Part 2 time: {pfc() - startTime:.4}")
  return score

input = readInput(f"d{DAY}-input.txt")
print(f"Part 1 for puzzle input: {part1(input)}")
print(f"Part 2 for puzzle input: {part2(input)}")
