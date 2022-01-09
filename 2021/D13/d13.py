"""
Advent Of Code 2021
Day 13: Transparent Origami part 1 & 2

https://adventofcode.com/2021/day/13
"""
import os

def getInput(filename):
  with open(os.path.join("2021", "D13", filename)) as f:
    lines = f.readlines()

  points = set()
  folding = []
  for l in (l.strip(('\n')) for l in lines if len(l) > 1):
    if l.startswith("fold"):
      axis, value = l.split("fold along ")[1].split("=")
      folding.append((axis, int(value)))
      continue
    x, y = l.split(',')
    points.add((int(x), int(y)))
  return points, tuple(folding)

def fold(points, foldingIndex, foldOnXAxis=True):
  newPoints = set()
  for x, y in points:
    if foldOnXAxis:
      # translate X if folding on X axis and X above folding index
      x = x if x < foldingIndex else foldingIndex - (x - foldingIndex)
    else:
      # translate Y if folding on Y axis and Y above folding index
      y = y if y < foldingIndex else foldingIndex - (y - foldingIndex)
    newPoints.add((x, y))
  return newPoints

def solve(filename):
  points, folding = getInput(filename)
  pointsCount = []
  for axis, foldIndex in folding:
    points = fold(points, foldIndex, axis == "x")
    pointsCount.append(len(points))
  return points, tuple(pointsCount)

def showCode(points):
  maxX, maxY = -1, -1
  for x, y in points:
    maxX, maxY = max(maxX, x), max(maxY, y)
  sheet = tuple([" "] * (maxX + 1) for _ in range(maxY + 1))
  for x, y in points:
    sheet[y][x] = "#"
  return "".join((f'\n{"".join(s)}' for s in sheet))

points, pointsCount = solve("d13-sample1.txt")
print(f'Part 1 for sample: {pointsCount[0]}')
print(f'Part 2 for sample: {showCode(points)}')

points, pointsCount = solve("d13-input.txt")
print(f'Part 1 for puzzle input: {pointsCount[0]}')
print(f'Part 2 for puzzle input: {showCode(points)}')
