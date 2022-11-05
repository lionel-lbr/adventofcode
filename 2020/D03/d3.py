"""
Advent Of Code 2020
Day 3: Toboggan Trajectory part 1 & 2

https://adventofcode.com/2020/day/3
"""
import os

def readInput(filename):
  with open(os.path.join("2020", "D03", filename)) as f:
    lines = f.readlines()
  input = ((d.strip('\n')) for d in lines)
  return tuple(input)

def part1(input, slope):
  width = len(input[0])
  hight = len(input)
  slopeX, slopeY = slope
  x = 0
  treeCount = 0
  for y in range(slopeY, hight, slopeY):
    x = (x + slopeX) % width
    if input[y][x] == '#':
      treeCount += 1
  return treeCount

def part2(input):
  slopes = ((1, 1), (3, 1), (5, 1), (7, 1), (1, 2))
  treeCount = 1
  for s in slopes:
    tc = part1(input, s)
    treeCount *= tc
  return treeCount

input = readInput("d3-input.txt")
print(f"Part 1: {part1(input, (3,1))}")
print(f"Part 2: {part2(input)}")