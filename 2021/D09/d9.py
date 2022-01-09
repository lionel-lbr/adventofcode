"""
Advent Of Code 2021
Day 9: Smoke Basin part 1 & 2

https://adventofcode.com/2021/day/9
"""
def getLavaMap():
  with open("2021/D9/d9-input.txt") as f:
    lines = f.readlines()
  
  caves = [list(l.strip("\n")) for l in lines]
  return caves

caves = getLavaMap()
hight = len(caves)
width = len(caves[0])

def getPoint(x, y):
  if y < 0 or y >= hight or x < 0 or x >= width:
    return 9
  return int(caves[y][x])

def calculateBasinSize(x, y, visited):
  size = 1
  visited.add((x,y))
  # recurse in every direction
  if (x, y-1) not in visited and getPoint(x, y-1) != 9:
    size += calculateBasinSize(x, y-1, visited)
  if (x+1, y) not in visited and getPoint(x+1, y) != 9:
    size += calculateBasinSize(x+1, y, visited)
  if (x, y+1) not in visited and getPoint(x, y+1) != 9:
    size += calculateBasinSize(x, y+1, visited)
  if (x-1, y) not in visited and getPoint(x-1, y) != 9:
    size += calculateBasinSize(x-1, y, visited)
  return size

lowestPoints = []
for y in range(hight):
  for x in range(width):
    p = getPoint(x, y)
    points = []
    points.append(getPoint(x, y-1))
    points.append(getPoint(x+1, y))
    points.append(getPoint(x, y+1))
    points.append(getPoint(x-1, y))
    m = min(points)
    if p < m:
      # in a basin, calculate the size
      size = calculateBasinSize(x,y, visited=set([(x,y)]))
      lowestPoints.append((x,y,p,size))

riskLevelSum = sum([i[3] for i in lowestPoints]) + len(lowestPoints)
bigestBasin = sorted(lowestPoints, reverse=True, key=lambda x: x[3])
print(riskLevelSum, bigestBasin[0][3]*bigestBasin[1][3]*bigestBasin[2][3], bigestBasin[:3])