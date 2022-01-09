"""
Advent Of Code 2021
Day 9: Smoke Basin part 1 & 2

https://adventofcode.com/2021/day/9
"""
import os

def readInput(filename):
  with open(os.path.join("2021", "D09", filename)) as f:
    lines = f.readlines()
  caves = [tuple(l.strip("\n")) for l in lines]
  return tuple(caves)

class CaveMap:

  def __init__(self, caves):
    self._caves = caves
    self.height = len(caves)
    self.width = len(caves[0])

  def getPoint(self, x, y):
    if y < 0 or y >= self.height or x < 0 or x >= self.width:
      return 9
    return int(self._caves[y][x])

  def calculateBasinSize(self, x, y, visited):
    size = 1
    visited.add((x, y))
    # recurse in every direction
    if (x, y - 1) not in visited and self.getPoint(x, y - 1) != 9:
      size += self.calculateBasinSize(x, y - 1, visited)
    if (x + 1, y) not in visited and self.getPoint(x + 1, y) != 9:
      size += self.calculateBasinSize(x + 1, y, visited)
    if (x, y + 1) not in visited and self.getPoint(x, y + 1) != 9:
      size += self.calculateBasinSize(x, y + 1, visited)
    if (x - 1, y) not in visited and self.getPoint(x - 1, y) != 9:
      size += self.calculateBasinSize(x - 1, y, visited)
    return size

def solve(filename):
  caves = readInput(filename)
  caveMap = CaveMap(caves)
  lowestPoints = []
  for y in range(caveMap.height):
    for x in range(caveMap.width):
      p = caveMap.getPoint(x, y)
      m = min(caveMap.getPoint(x, y - 1), caveMap.getPoint(x + 1, y), \
                caveMap.getPoint(x, y + 1), caveMap.getPoint(x - 1, y))
      if p < m:
        # in a basin, calculate the size
        size = caveMap.calculateBasinSize(x, y, visited=set([(x, y)]))
        lowestPoints.append((x, y, p + 1, size))

  riskLevelSum = sum((i[2] for i in lowestPoints))
  bigestBasin = sorted(lowestPoints, reverse=True, key=lambda x: x[3])

  r = 1
  for p in bigestBasin[:3]:
    r *= p[3]

  return riskLevelSum, r

print(f"Part 1 & 2 for sample: {solve('d9-sample1.txt')}")
print(f"Part 1 & 2 for puzzle input: {solve('d9-input.txt')}")
