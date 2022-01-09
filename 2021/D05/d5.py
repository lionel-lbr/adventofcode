"""
Advent Of Code 2021
Day 5: Hydrothermal Venture part 1

https://adventofcode.com/2021/day/5 
"""
import os

def readInput(filename):
  with open(os.path.join("2021", "D05", filename)) as f:
    lines = f.readlines()
  segments = []
  for l in lines:
    p1, p2 = l.strip('\n').split(" -> ")
    x1, y1 = p1.split(',')
    x2, y2 = p2.split(',')
    segments.append(((int(x1), int(y1)), (int(x2), int(y2))))
  return tuple(segments)

# process
def solve(filename):
  segments = readInput(filename)
  part1Points = dict()
  part2Points = dict()
  for org, dst in segments:
    # part 1 and 2
    orgX, orgY = org
    dstX, dstY = dst
    if orgX == dstX:
      startY = min(orgY, dstY)
      endY = max(orgY, dstY)
      for y in range(startY, endY + 1):
        part1Points[(orgX, y)] = part1Points.get((orgX, y), 0) + 1
        part2Points[(orgX, y)] = part2Points.get((orgX, y), 0) + 1
      continue
    if orgY == dstY:
      startX = min(orgX, dstX)
      endX = max(orgX, dstX)
      for x in range(startX, endX + 1):
        part1Points[(x, orgY)] = part1Points.get((x, orgY), 0) + 1
        part2Points[(x, orgY)] = part2Points.get((x, orgY), 0) + 1
      continue

    # part 2 section ...
    deltaX = max(orgX, dstX) - min(orgX, dstX)
    detalY = max(orgY, dstY) - min(orgY, dstY)
    if deltaX == detalY:
      org, dst = (org, dst) if orgY < dstY else (dst, org)
      orgX, orgY = org
      dstX, dstY = dst
      step = -1 if dstX < orgX else 1
      while orgX != dstX and orgY != dstY:
        part2Points[(orgX, orgY)] = part2Points.get((orgX, orgY), 0) + 1
        orgY += 1
        orgX += step
      part2Points[(orgX, orgY)] = part2Points.get((orgX, orgY), 0) + 1
      continue

  # calculate overlaping for part 1 and 2
  part1OverlapsCount = 0
  for k in part1Points:
    part1OverlapsCount += 1 if part1Points[k] >= 2 else 0

  part2OverlapsCount = 0
  for k in part2Points:
    part2OverlapsCount += 1 if part2Points[k] >= 2 else 0

  return (part1OverlapsCount, part2OverlapsCount)

part1Result, part2Result = solve('d5-input.txt')
print(f"Part 1, overlap count:{part1Result}")
print(f"Part 2, overlap count:{part2Result}")
