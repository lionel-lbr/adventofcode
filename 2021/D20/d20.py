"""
Advent Of Code 2021
Day 20: Trench Map part 1 & 2

https://adventofcode.com/2021/day/20 
"""
import os

def readInput(filename):
  with open(os.path.join("2021", "D20", filename)) as f:
    lines = f.readlines()
  algo = lines[0].strip('\n')
  input = [[c for c in l.strip('\n')] for l in lines[1:]]
  return algo, input

def getPixelValue(map, x, y, defaultPixelValue=0):
  v = 0
  for i in range(y - 1, y + 2):
    for j in range(x - 1, x + 2):
      v = v << 1
      v |= defaultPixelValue if (i < 0 or j < 0 or j >= len(map) or i >= len(map[0])) else 0 if map[i][j] == '.' else 1
  return v

def solve(filename, maxIteration):
  algo, inputMap = readInput(filename)
  outputMap = []
  border = 2
  for iterationCount in range(maxIteration):
    iMapH = len(inputMap)
    iMapW = len(inputMap[0])
    outputMap = []
    lightenPixelCount = 0
    for y in range(-border, iMapH + border):
      row = []
      for x in range(-border, iMapW + border):
        # swap defaultPixelValue for each iteration
        v = getPixelValue(inputMap, x, y, defaultPixelValue=iterationCount % 2)
        nc = algo[v]
        row.append(nc)
        lightenPixelCount += 1 if nc == "#" else 0
      outputMap.append(row)
    inputMap = outputMap
    # adjust border at the last iteration
    border = 0 if iterationCount == maxIteration - 2 else 1
  return lightenPixelCount

print(f"Part 1: {solve('d20-input.txt', 2)}")
print(f"Part 2: {solve('d20-input.txt', 50)}")
