"""
Advent Of Code 2021
Day 1: Sonar Sweep part 1 & 2

https://adventofcode.com/2021/day/1
"""
import os

def readInput(filename):
  with open(os.path.join("2021", "D01", filename)) as f:
    lines = f.readlines()
  input = (int(d.strip('\n')) for d in lines)
  return tuple(input)

def solvePart1(filename):
  count = 0
  input = readInput(filename)
  previous = input[0]
  for i in input[1:]:
    if i > previous:
      count += 1
    previous = i
  return count

def solvePart2(filename):
  count = 0
  input = readInput(filename)
  previous = input[0]
  for i, _ in enumerate(input[1:-2]):
    n = input[i] + input[i + 1] + input[i + 2]
    if n > previous:
      count += 1
    previous = n
  return count

print(f'Part1:{solvePart1("d1-input.txt")}')
print(f'Part2:{solvePart2("d1-input.txt")}')
