"""
Advent Of Code 2022
Day 1: Calorie Counting part 1 & 2

https://adventofcode.com/2022/day/1
"""
from time import perf_counter as pfc
import os
import functools

YEAR = "2022"
DAY = "01"

def readInput(filename):
  with open(os.path.join(f"{YEAR}", f"D{DAY}", filename)) as f:
    lines = f.readlines()
  input = (d.strip('\n') for d in lines)
  return tuple(input)

def part1(input):
  startTime = pfc()

  result = functools.reduce(
      lambda result, n: (result[0], result[1] + int(n))
      if n.isnumeric() else (max(result[0], result[1]), 0), input, (0, 0))

  print(f"Part 1 time: {pfc() - startTime:.4}")
  return result[0]

def part2(input):
  startTime = pfc()

  # check if n should be part of the array of max 3 values
  def maxThree(array, n):
    if n > array[2]:
      array[2] = n
      array.sort(reverse=True)
    return array

  result = functools.reduce(
      lambda result, n: (result[0], result[1] + int(n))
      if n.isnumeric() else (maxThree(result[0], result[1]), 0), input, ([0, 0, 0], 0))

  print(f"Part 2 time: {pfc() - startTime:.4}")
  return sum(result[0])

input = readInput(f"d{DAY}-input.txt")
print(f"Part 1 for puzzle input: {part1(input)}")
print(f"Part 2 for puzzle input: {part2(input)}")
