"""
Advent Of Code 2021
Day 25: Sea Cucumber part 1

https://adventofcode.com/2021/day/25
"""
import os

def readInput(filename):
  with open(os.path.join("2021","D25",filename)) as f:
    lines = f.readlines()
  map = [list(l.strip('\n')) for l in lines]
  return map

def hasMoved(seeFloorMap, x, y, seaCucumber, firstRowColumnSavedChar):
  width, height = len(seeFloorMap[0]), len(seeFloorMap)

  if seeFloorMap[y][x] == seaCucumber:
    # check if a spcific type of sea cucumber can move ...
    if seaCucumber == '>':
      dstX, dstY = (x+1)%width, y
      dstChar = firstRowColumnSavedChar if dstX == 0 else seeFloorMap[dstY][dstX]
    elif seaCucumber == 'v':
      dstX, dstY = x, (y+1)%height 
      dstChar = firstRowColumnSavedChar if dstY == 0 else seeFloorMap[dstY][dstX]

    # move the sea cucumber ...
    if dstChar == ".":
      seeFloorMap[dstY][dstX] = seeFloorMap[y][x]
      seeFloorMap[y][x] = '.'
      return True
  return False

def step(seeFloorMap):
  width, height = len(seeFloorMap[0]), len(seeFloorMap)
  moved = 0
  for y in range(height):
    # save x == 0 char as it'll be overwritten on the first iteration  
    firstColumnSavedChar = seeFloorMap[y][0]
    x = 0
    while x < width:
      if hasMoved(seeFloorMap, x, y, '>', firstColumnSavedChar) : 
        moved += 1
        x += 1
      x += 1
  for x in range(width):
    # save y == 0 char as it'll be overwritten on the first iteration  
    firstRowSavedChar = seeFloorMap[0][x]
    y = 0
    while y < height:
      if hasMoved(seeFloorMap, x, y, 'v', firstRowSavedChar): 
        moved += 1
        y += 1
      y += 1
  return moved

def solve(filename):
  seeFloorMap = readInput(filename)
  stepCount = 1
  while moved := step(seeFloorMap):
    print(f"Step: {stepCount} - Moved: {moved}")
    stepCount += 1
  return stepCount

print(f"\nExample solution: {solve('d25-sample1.txt')}\n")
print(f"\nPart 1 solution: {solve('d25-input.txt')}\n")