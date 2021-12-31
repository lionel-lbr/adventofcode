"""
Advent Of Code 2021
Day 20: Trench Map part 1 & 2

https://adventofcode.com/2021/day/20 
"""

with open("2021/D20/d20-input.txt") as f:
  lines = f.readlines()

algo = lines[0].strip('\n')

def getInputMap(lines, width, height):
  oMap = [['.' for i in range(width)] for i in range(height)]
  for y in range(width):
    for x in range(height):
      oMap[y][x] = lines[y][x]
  return oMap

def getPixelValue(map, x,y, defaultPixelValue=0):
  v = 0
  for i in range(y-1, y+2):
    for j in range(x-1, x+2):
      v = v << 1
      v |= defaultPixelValue if (i<0 or j<0 or j>= len(map) or i>=len(map[0])) else 0 if map[i][j] == '.' else 1
      
  return v


inputMap = getInputMap(lines[1:], len(lines[1].strip('\n')), len(lines) - 1)
outputMap = []

MAX_ITER = 50
count = 0
border = 2
while count < MAX_ITER:
  iMapH = len(inputMap)
  iMapW = len(inputMap[0])
  outputMap = []
  nbrOfLightPixel = 0
  for y in range(-border,iMapH+border):
    row = []
    for x in range(-border,iMapW+border):
      v = getPixelValue(inputMap, x, y, defaultPixelValue=count%2)
      nc = algo[v]
      row.append(nc)
      nbrOfLightPixel += 1 if nc == "#" else 0
    outputMap.append(row)
  inputMap = outputMap
  count +=1
  print("nbrOfLightPixel after %d iteration: %d"%(count, nbrOfLightPixel))
  if count == MAX_ITER - 1:
    border = 0
  else:
    border = 1



