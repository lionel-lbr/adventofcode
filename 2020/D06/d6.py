"""
Advent Of Code 2020
Day 6: Custom Customs part 1 & 2

https://adventofcode.com/2020/day/6
"""
import os

def readInput(filename):
  with open(os.path.join("2020", "D06", filename)) as f:
    lines = f.readlines()
  return tuple((d.strip('\n') for d in lines))

def part1(lines):
  result = 0
  theSet = set()
  for s in lines:
    if len(s) == 0:
      result += len(theSet)
      theSet = set()
      continue
    theSet.update(list(s))
  return result

def part2(lines):
  result = 0
  newGroup = True
  for s in lines:
    if len(s) == 0:
      result += len(theSet)
      newGroup = True
      continue
    if newGroup:
      theSet = set(list(s))
      newGroup = False
    else:
      theSet = theSet.intersection(set(list(s)))
  return result

input = readInput("d6-input.txt")
print(f"Part 1: {part1(input)}")
print(f"Part 2: {part2(input)}")