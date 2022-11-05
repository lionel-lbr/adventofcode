"""
Advent Of Code 2020
Day 5: Binary Boarding part 1 & 2

https://adventofcode.com/2020/day/5
"""
import os

def readInput(filename):
  with open(os.path.join("2020", "D05", filename)) as f:
    lines = f.readlines()
  input = (d.strip('\n') for d in lines)
  return tuple(input)

def part1(input):
  result = []
  for i in input:
    row = (0, 127)
    col = (0, 7)
    for c in i:
      if c == 'F':
        first, last = row
        row = (first, first + int((last - first) / 2))
      elif c == 'B':
        first, last = row
        row = (last - int((last - first) / 2), last)
      elif c == 'L':
        first, last = col
        col = (first, first + int((last - first) / 2))
      elif c == 'R':
        first, last = col
        col = (last - int((last - first) / 2), last)
    result.append(max(col) + min(row) * 8)
    result.sort()
  return result

def part2(input):
  seatList = part1(input)
  for i, v in enumerate(seatList):
    if seatList[i + 1] != v + 1:
      return v + 1

#input = readInput("d5-sample1.txt")
input = readInput("d5-input.txt")
print(f"Part 1: {max(part1(input))}")
print(f"Part 2: {part2(input)}")