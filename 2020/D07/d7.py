"""
Advent Of Code 2020
Day 7: XXX part 1 & 2

https://adventofcode.com/2020/day/7
"""
import os

def readInput(filename):
  with open(os.path.join("2020", "D07", filename)) as f:
    lines = f.readlines()
  input = (int(d.strip('\n')) for d in lines)
  return tuple(input)

def part1(input):
  pass

def part2(input):
  pass

def solve(input):
  pass

input = readInput("d7-input.txt")
print(f"Part 1: {part1(input)}")
print(f"Part 2: {part2(input)}")