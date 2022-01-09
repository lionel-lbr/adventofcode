"""
Advent Of Code 2021
Day 11: Dumbo Octopus part 1 & 2

https://adventofcode.com/2021/day/11
"""

import os

def readInput(filename):
  with open(os.path.join("2021", "D11", filename)) as f:
    lines = f.readlines()
  input = [list(map(lambda x: int(x), l)) for l in [list(l.strip('\n')) for l in lines]]
  return tuple(input)

class OctopusMap:

  def __init__(self, input):
    self._octopusMap = input
    self.height = len(input)
    self.width = len(input[0])

  def increaseAdjacent(self, x, y, flashed):
    v = self._octopusMap[y][x]
    if v == 0 and (x, y) in flashed:
      return
    v += 1
    if v <= 9:
      self._octopusMap[y][x] = v
      return

    # flash this position, added to flashed visited and check adjacents
    self._octopusMap[y][x] = 0
    flashed.append((x, y))
    adjacents = ((x - 1, y - 1), (x, y - 1), (x + 1, y - 1), (x - 1, y), (x + 1, y), (x - 1, y + 1), (x, y + 1), (x + 1, y + 1))
    for x, y in adjacents:
      if x < 0 or x >= self.width or y < 0 or y >= self.height:
        continue
      self.increaseAdjacent(x, y, flashed)
    return len(flashed)

  def flash(self):
    flashed = []  # will hold coordinate of this step's already flashed octopus
    for y in range(self.height):
      for x in range(self.width):
        self.increaseAdjacent(x, y, flashed)
    return len(flashed)

def part1(filename):
  octopusMap = OctopusMap(readInput(filename))
  stepCount = 100
  flashedCount = 0
  while stepCount:
    flashedCount += octopusMap.flash()
    stepCount -= 1
  return flashedCount

def part2(filename):
  octopusMap = OctopusMap(readInput(filename))
  stepCount = 1
  flashedNum = octopusMap.width * octopusMap.height
  while octopusMap.flash() < flashedNum:
    stepCount += 1
  return stepCount

print("Part1 for sample:", part1("d11-sample2.txt"))
print("Part1 for puzzle input:", part1("d11-input.txt"))
print("Part2 for sample:", part2("d11-sample2.txt"))
print("Part2 for puzzle input", part2("d11-input.txt"))
