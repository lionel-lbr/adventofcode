"""
Advent Of Code 2022
Day 3: Rucksack Reorganization part 1 & 2

https://adventofcode.com/2022/day/3
"""
from time import perf_counter as pfc
import os

YEAR = "2022"
DAY = "03"

def readInput(filename):
  with open(os.path.join(f"{YEAR}", f"D{DAY}", filename)) as f:
    lines = f.readlines()
  input = (d.strip('\n') for d in lines)
  return tuple(input)

ASCII = " abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

def part1(input):
  startTime = pfc()

  result = 0
  for r in input:
    s1 = set(r[:len(r) // 2])  # integer division
    s2 = set(r[len(r) // 2:])
    c = s1.intersection(s2).pop()
    result += ASCII.index(c)

  print(f"Part 1 time: {pfc() - startTime:.4}")
  return result

def part2(input):
  startTime = pfc()

  result = 0
  for i in range(0, len(input), 3):
    s1 = set(input[i])
    s2 = set(input[i + 1])
    s3 = set(input[i + 2])
    c = s1.intersection(s2.intersection(s3)).pop()
    result += ASCII.index(c)

  print(f"Part 2 time: {pfc() - startTime:.4}")
  return result

input = readInput(f"d{DAY}-input.txt")
print(f"Part 1 for puzzle input: {part1(input)}")
print(f"Part 2 for puzzle input: {part2(input)}")
