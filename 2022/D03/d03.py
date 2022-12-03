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

ASCII_A = ord('A')  # 65
ASCII_a = ord('a')  # 97

def part1(input):
  startTime = pfc()
  duplicate = []
  for r in input:
    r1 = r[:len(r) // 2]  # integer division
    r2 = r[len(r) // 2:]
    for c in r1:
      if c in r2:
        duplicate.append(c)
        break

  result = 0
  for c in duplicate:
    result += 1 + ord(c) - ASCII_a if (ord(c) >= ASCII_a) else 27 + ord(c) - ASCII_A

  print(f"Part 1 time: {pfc() - startTime:.4}")
  return result

def part2(input):
  startTime = pfc()
  tags = []
  for i in range(0, len(input), 3):
    r1 = input[i]
    r2 = input[i + 1]
    r3 = input[i + 2]
    for c in r1:
      if c in r2 and c in r3:
        tags.append(c)
        break

  result = 0
  for c in tags:
    result += 1 + ord(c) - ASCII_a if (ord(c) >= ASCII_a) else 27 + ord(c) - ASCII_A

  print(f"Part 2 time: {pfc() - startTime:.4}")
  return result

input = readInput(f"d{DAY}-input.txt")
print(f"Part 1 for puzzle input: {part1(input)}")
print(f"Part 2 for puzzle input: {part2(input)}")
