"""
Advent Of Code 2021
Day 11: Dumbo Octopus part 1 & 2

https://adventofcode.com/2021/day/11
"""

with open("2021/D11/d11-input.txt") as f:
  lines = f.readlines()

octopusMap =[list(map(lambda x: int(x),l)) for l in [list(l.strip('\n')) for l in lines]]
width = len(octopusMap[0])
height = len(octopusMap)

def increaseAdjacent(x, y, flashed):
  v = octopusMap[y][x]
  if v == 0 and (x, y) in flashed:
    return 
  v += 1
  if v <= 9:
    octopusMap[y][x] = v
    return

  # flash this position, added to flashed visited and check adjacents
  octopusMap[y][x] = 0
  flashed.append((x,y))

  adjacents = (
    (x-1, y-1), (x, y-1), (x+1, y-1), (x-1, y), (x+1, y), (x-1, y+1), (x, y+1), (x+1, y+1))
  
  for pos in adjacents:
    if pos[0] < 0 or pos[0] >= width or pos[1] < 0 or pos[1] >= height:
      continue
    increaseAdjacent(pos[0], pos[1], flashed)

  return len(flashed)

def step():
  flashed=[] # will hold coordinate of this step's already flashed octopus
  for y in range(height):
    for x in range(width):
      increaseAdjacent(x, y, flashed)
  return len(flashed)

def part1():
  nbrOfSteps = 1
  totalNbrOfFlashed = 0
  while nbrOfSteps <= 100:
    l = step()
    totalNbrOfFlashed += l
    print("Step:%d, flashed:%d, totalNbrOfFlashed:%d"%(nbrOfSteps, l, totalNbrOfFlashed))
    nbrOfSteps += 1
  return totalNbrOfFlashed

def part2():
  nbrOfSteps = 1
  totalNbrOfFlashed = 0
  while True:
    l = step()
    totalNbrOfFlashed += l
    print("Step:%d, flashed:%d, totalNbrOfFlashed:%d"%(nbrOfSteps, l, totalNbrOfFlashed))
    if l == width * height:
      print("They all flashed.")
      return nbrOfSteps
    nbrOfSteps += 1

print("Part1 solution:", part1())
# regenerate the map before part2
octopusMap =[list(map(lambda x: int(x),l)) for l in [list(l.strip('\n')) for l in lines]]
print("Part2 solution:", part2())
