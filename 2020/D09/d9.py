"""
Advent Of Code 2020
Day 9: Encoding Error part 1 & 2

https://adventofcode.com/2020/day/9
"""
import os

def readInput(filename):
  with open(os.path.join("2020", "D09", filename)) as f:
    lines = f.readlines()
  input = (int(d.strip('\n')) for d in lines)
  return tuple(input)

def isValid(input, startIndex, n):
  for i, n1 in enumerate(input[startIndex - 25:startIndex - 1]):
    for m in input[startIndex - 25 + i:startIndex]:
      if n1 + m == n:
        return True
  return False

def part1(input):
  for i, n in enumerate(input[25:]):
    if isValid(input, 25 + i, n):
      continue
    return n
  return -1

def part2(input):
  invalidNumber = part1(input)
  for i, n in enumerate(input):
    j = i + 2
    currentNumber = 0
    while currentNumber < invalidNumber:
      currentNumber = sum(input[i:j])
      j += 1
    if currentNumber == invalidNumber:
      print(f"found range:{i}-{j-1}")
      minVal = min(input[i:j - 1])
      maxVal = max(input[i:j - 1])
      return minVal + maxVal
  return -1

input = readInput("d9-input.txt")
print(f"Part 1: {part1(input)}")
print(f"Part 2: {part2(input)}")