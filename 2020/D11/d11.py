"""
Advent Of Code 2020
Day 11: Seating System part 1 & 2

https://adventofcode.com/2020/day/11
"""
import os
from time import perf_counter as pfc

def readInput(filename):
  with open(os.path.join("2020", "D11", filename)) as f:
    lines = f.readlines()
  input = (tuple(d.strip('\n')) for d in lines)
  return tuple(input)

def swap(floor, floorSize, freeSeat, occupiedCount, part1Part2):
  getAdjSeatCountFct, maxOccupiedSeat = part1Part2
  width, height = floorSize
  swapFloor = list([list(r) for r in floor])
  swapCount = 0
  for y in range(height):
    for x in range(width):
      if floor[y][x] == '.':
        continue
      adjCount = getAdjSeatCountFct(floor, floorSize, x, y, freeSeat)
      if freeSeat:
        if floor[y][x] == 'L' and adjCount == 8:
          swapFloor[y][x] = '#'
          occupiedCount += 1
          swapCount += 1
      else:
        if floor[y][x] == '#' and adjCount >= maxOccupiedSeat:
          swapFloor[y][x] = 'L'
          occupiedCount -= 1
          swapCount += 1
  return (swapCount, swapFloor, occupiedCount)

def solve(input, getAdjSeatCount, maxOccupiedSeat):
  width, height = (len(input[0]), len(input))
  freeSeat = True
  floor = list(map(list, input))
  occupiedCount = 0
  startTime = pfc()
  while True:
    swapCount, floor, occupiedCount = swap(floor, (width, height),
                                           freeSeat,
                                           occupiedCount,
                                           part1Part2=(getAdjSeatCount, maxOccupiedSeat))
    if swapCount == 0:
      print(f"Time: {pfc() - startTime:.4}")
      return occupiedCount
    freeSeat = not freeSeat

def getAdjSeatCount(floor, floorSize, px, py, freeSeat=True):
  w, h = floorSize
  count = 0
  adjacentPos = ((px - 1, py - 1), (px, py - 1), (px + 1, py - 1), (px - 1, py), (px + 1, py), (px - 1, py + 1),
                 (px, py + 1), (px + 1, py + 1))
  for x, y in adjacentPos:
    if x < 0 or y < 0 or x >= w or y >= h:
      count += 1 if freeSeat else 0
      continue
    if freeSeat:
      count += 1 if floor[y][x] in ['L', '.'] else 0
    else:
      count += 1 if floor[y][x] == "#" else 0
  return count

def getAdjSeatCountPart2(floor, floorSize, px, py, freeSeat=True):
  w, h = floorSize
  count = 0
  adjacentDirection = ((-1, -1), (0, -1), (1, -1), (-1, 0), (1, 0), (-1, 1), (0, 1), (1, 1))
  for incX, incY in adjacentDirection:
    x = px
    y = py
    while True:
      x += incX
      y += incY
      if x < 0 or y < 0 or x >= w or y >= h:
        count += 1 if freeSeat else 0
        break
      if floor[y][x] != ".":
        count += 1 if freeSeat and floor[y][x] == 'L' else 0
        count += 1 if not freeSeat and floor[y][x] == '#' else 0
        break
  return count

def part1(input):
  return solve(input, getAdjSeatCount, 4)

def part2(input):
  return solve(input, getAdjSeatCountPart2, 5)

input = readInput("d11-sample.txt")
print(f"Part 1 for sample: {part1(input)}")
print(f"Part 2 for sample: {part2(input)}")

input = readInput("d11-input.txt")
print(f"Part 1 for puzzle input: {part1(input)}")
print(f"Part 2 for puzzle input: {part2(input)}")
