"""
Advent Of Code 2021
Day 5: Hydrothermal Venture part 1

https://adventofcode.com/2021/day/5 
"""
with open("2021/D5/d5-input.txt") as f:
    lines = f.readlines()

ORG = 0
DST = 1
X = 0
Y = 1

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

# calculate overlaping
nbrOfOverlaps=0
for k in points.keys():
  nbrOfOverlaps += 1 if points[k] >= 2 else 0

print("Nbr of overlap:",nbrOfOverlaps)