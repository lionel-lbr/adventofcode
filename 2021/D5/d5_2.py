"""
Advent Of Code 2021
Day 5: Hydrothermal Venture part 2

https://adventofcode.com/2021/day/5 
"""
with open("2021/D5/d5-input.txt") as f:
    lines = f.readlines()

ORG = 0
DST = 1
X = 0
Y = 1

samples = ["0,9 -> 5,9",
"8,0 -> 0,8",
"9,4 -> 3,4",
"2,2 -> 2,1",
"7,0 -> 7,4",
"6,4 -> 2,0",
"0,9 -> 2,9",
"3,4 -> 1,4",
"0,0 -> 8,8",
"5,5 -> 8,2"]

# process input
segments = []
for l in lines:
  p1, p2 = l.strip('\n').split(" -> ")
  x1, y1 = p1.split(',')
  x2, y2 = p2.split(',')
  segments.append(((int(x1),int(y1)),(int(x2),int(y2))))

# process
points = dict()
for s in segments:
  if s[ORG][X] == s[DST][X]:
    startY = min(s[ORG][Y], s[DST][Y])
    endY = max(s[ORG][Y], s[DST][Y])
    for y in range(startY, endY+1):
      n = points.get((s[ORG][X] , y), 0)
      points[(s[ORG][X] , y)] = n + 1
    continue

  if s[ORG][Y] == s[DST][Y]:
    startX = min(s[ORG][X], s[DST][X])
    endX = max(s[ORG][X], s[DST][X])
    for x in range(startX, endX+1):
      n = points.get((x, s[ORG][Y]), 0)
      points[(x, s[ORG][Y])] = n + 1
    continue

  dstX = max(s[ORG][X], s[DST][X]) - min(s[ORG][X], s[DST][X])
  dstY = max(s[ORG][Y], s[DST][Y]) - min(s[ORG][Y], s[DST][Y])
  if dstX == dstY:
    org, dst = (s[ORG], s[DST]) if s[ORG][Y] < s[DST][Y] else (s[DST], s[ORG])
    step = -1 if dst[X] < org[X] else 1
    x, y = org
    while x != dst[X] and y != dst[Y]:
      n = points.get((x, y), 0)
      points[(x, y)] = n + 1
      y += 1
      x += step
    n = points.get((x, y), 0)
    points[(x, y)] = n + 1
    continue

# calculate overlaping
nbrOfOverlaps=0
for k in points.keys():
  nbrOfOverlaps += 1 if points[k] >= 2 else 0

print("Nbr of overlap:", nbrOfOverlaps)