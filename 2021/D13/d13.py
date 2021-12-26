"""
Advent Of Code 2021
Day 13: Transparent Origami part 1 & 2

https://adventofcode.com/2021/day/13
"""
import os

def getPoints(filename):
  points = set()
  folding = []
  with open(os.path.join("2021","D13", filename)) as f:
    lines = f.readlines()
    for l in [l.strip(('\n')) for l in lines if len(l)>1]:
      if l.startswith("fold"):
        axis, value = l.split("fold along ")[1].split("=")
        folding.append((axis, int(value)))
        continue
      x, y = l.split(',')
      points.add((int(x), int(y)))
  return points, folding

def foldY(points, foldingIndex):
  newPoints = set()
  for p in points:
    if p[1] < foldingIndex:
      newPoints.add(p)
      continue
    # translate Y
    newY = foldingIndex - (p[1]-foldingIndex)
    newPoints.add((p[0], newY))
  return newPoints

def foldX(points, foldingIndex):
  newPoints = set()
  for p in points:
    if p[0] < foldingIndex:
      newPoints.add(p)
      continue
    # Translate X
    newX = foldingIndex - (p[0]-foldingIndex)
    newPoints.add((newX, p[1]))
  return newPoints

def showCode(points):
  maxX = -1
  maxY = -1
  for x, y in points:
    maxX = max(maxX, x)
    maxY = max(maxY, y)
  
  sheet = [[" " for i in range(maxX+1)] for i in range(maxY+1)]
  for x, y in points:
    sheet[y][x]="#"

  for s in sheet:
    print("".join(s))

def solve(filename):
  print("Solving: %s"%filename)
  points, folding = getPoints(filename)
  for axis, foldIndex in folding:
    if axis == "x":
      np = foldX(points, foldIndex)
    if axis == "y":
      np = foldY(points, foldIndex)
    print("Folding on axis:%s at index:%d -> %d points"%(axis, foldIndex, len(np)))
    points = np
  showCode(points)
   
solve("d13-sample1.txt")
solve("d13-input.txt")
