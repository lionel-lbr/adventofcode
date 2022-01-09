"""
Advent Of Code 2021
Day 2: Dive! part 1 & 2

https://adventofcode.com/2021/day/2
"""
import os

def readInput(filename):
  with open(os.path.join("2021", "D02", filename)) as f:
    lines = f.readlines()
  input = ((cmd, int(val)) for cmd, val in (d.strip('\n').split(' ') for d in lines))
  return tuple(input)

def solvePart1(filename):
  input = readInput(filename)
  depth, horizon = (0, 0)
  for cmd, val in input:
    if cmd == 'forward':
      horizon += val
      continue
    if cmd == 'down':
      depth += val
      continue
    if cmd == 'up':
      depth -= val
      continue
  return depth * horizon

def solvePart2(filename):
  input = readInput(filename)
  depth, horizon, aim = (0, 0, 0)
  for cmd, val in input:
    if cmd == 'forward':
      horizon += val
      depth += aim * val
      continue
    if cmd == 'down':
      aim += val
      continue
    if cmd == 'up':
      aim -= val
      continue
  return depth * horizon

print(f"Part 1: {solvePart1('d2-input.txt')}")
print(f"Part 2: {solvePart2('d2-input.txt')}")