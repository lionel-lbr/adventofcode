"""
Advent Of Code 2022
Day 4: Camp Cleanup part 1 & 2

https://adventofcode.com/2022/day/4
"""
from time import perf_counter as pfc
import os
import functools

YEAR = "2022"
DAY = "04"

def readInput(filename):
  with open(os.path.join(f"{YEAR}", f"D{DAY}", filename)) as f:
    lines = f.readlines()
  input = (d.strip('\n') for d in lines)
  return tuple((tuple((int(n[0]), int(n[1])) for n in (p.split("-") for p in i.split(","))) for i in input))

def part1(input):
  startTime = pfc()

  def checkBound(c, ranges):
    (ls, le), (rs, re) = ranges
    return c + 1 if (rs >= ls and re <= le) or (ls >= rs and le <= re) else c

  result = functools.reduce(checkBound, input, 0)

  print(f"Part 1 time: {pfc() - startTime:.4}")
  return result

def part2(input):
  startTime = pfc()

  def checkBound(c, ranges):
    (ls, le), (rs, re) = ranges
    return c + 1 if (rs >= ls and rs <= le) or (re >= ls and re <= le) or (ls >= rs and ls <= re) or (
        le >= rs and le <= re) else c

  result = functools.reduce(checkBound, input, 0)

  print(f"Part 2 time: {pfc() - startTime:.4}")
  return result

input = readInput(f"d{DAY}-input.txt")
print(f"Part 1 for puzzle input: {part1(input)}")
print(f"Part 2 for puzzle input: {part2(input)}")
