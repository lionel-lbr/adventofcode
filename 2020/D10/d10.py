"""
Advent Of Code 2020
Day 10: Adapter Array part 1 & 2

https://adventofcode.com/2020/day/10
"""
import os

def readInput(filename):
  with open(os.path.join("2020", "D10", filename)) as f:
    lines = f.readlines()
  input = (int(d.strip('\n')) for d in lines)
  return tuple(input)

def part1(input):
  adapters = [0] + list(input) + [max(input) + 3]
  adapters.sort()
  oneCount = 0
  threeCount = 0
  for i, n in enumerate(adapters):
    if i == 0: continue
    d = n - adapters[i - 1]
    if d == 1:
      oneCount += 1
    else:
      threeCount += 1

  return oneCount * threeCount

def part2(input):
  adapters = list(input)
  adapters.sort()
  count = (0, 0, 1)
  for i, n in enumerate(reversed(adapters[1:])):
    if n == adapters[len(adapters) - (i + 2)] + 3:
      count = (0, 0, count[2])
      continue
    if n == adapters[len(adapters) - (i + 2)] + 1:
      count = (*count[1:], sum(count))
  return sum(count)

input = readInput("d10-sample.txt")
print(f"Part 1 for sample: {part1(input)}")
print(f"Part 2 for sample: {part2(input)}")

input = readInput("d10-input.txt")
print(f"Part 1 for puzzle input: {part1(input)}")
print(f"Part 2 for puzzle input: {part2(input)}")
