"""
Advent Of Code 2020
Day 11: Adapter Array part 1 & 2

https://adventofcode.com/2020/day/11
"""
import os
from time import perf_counter as pfc

def readInput(filename):
  with open(os.path.join("2020", "D11", filename)) as f:
    lines = f.readlines()
  input = "".join((d.strip('\n') for d in lines))
  return tuple(input), len(lines[0].strip('\n'))

def swap(floor, width, freeSeat, occupiedCount, part1Part2):
  getAdjSeatCountFct, maxOccupiedSeat = part1Part2
  swapFloor = list(floor)
  swapCount = 0
  for i, n in enumerate(floor):
    if n == '.':
      continue
    adjCount = getAdjSeatCountFct(floor, width, i, freeSeat)
    if freeSeat:
      if n == 'L' and adjCount == 8:
        swapFloor[i] = '#'
        occupiedCount += 1
        swapCount += 1
    else:
      if n == '#' and adjCount >= maxOccupiedSeat:
        swapFloor[i] = 'L'
        occupiedCount -= 1
        swapCount += 1
  return (swapCount, tuple(swapFloor), occupiedCount)

def solve(input, width, getAdjSeatCount, maxOccupiedSeat):
  freeSeat = True
  floor = input
  occupiedCount = 0
  startTime = pfc()
  while True:
    swapCount, floor, occupiedCount = swap(floor,
                                           width,
                                           freeSeat,
                                           occupiedCount,
                                           part1Part2=(getAdjSeatCount, maxOccupiedSeat))
    if swapCount == 0:
      print(f"Time: {pfc() - startTime:.4}")
      return occupiedCount
    freeSeat = not freeSeat

def getAdjSeatCount(floor, width, index, freeSeat=True):
  py, px = divmod(index, width)
  height, _ = divmod(len(floor), width)
  count = 0
  adjacentPos = ((px - 1, py - 1), (px, py - 1), (px + 1, py - 1), (px - 1, py), (px + 1, py), (px - 1, py + 1),
                 (px, py + 1), (px + 1, py + 1))
  for x, y in adjacentPos:
    if x < 0 or y < 0 or x >= width or y >= height:
      count += 1 if freeSeat else 0
      continue
    newIndex = (y * width) + x
    if freeSeat:
      count += 1 if floor[newIndex] in ['L', '.'] else 0
    else:
      count += 1 if floor[newIndex] == "#" else 0
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

def part1(input, width):
  return solve(input, width, getAdjSeatCount, 4)

def part2(input):
  return solve(input, getAdjSeatCountPart2, 5)

input, width = readInput("d11-sample.txt")
print(f"Part 1 for sample: {part1(input, width)}")
# print(f"Part 2 for sample: {part2(input)}")

input, width = readInput("d11-input.txt")
print(f"Part 1 for puzzle input: {part1(input, width)}")
# print(f"Part 2 for puzzle input: {part2(input)}")
