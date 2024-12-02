"""
Advent Of Code 2024
Day 2: Red-Nosed Reports part 1 & 2

https://adventofcode.com/2024/day/2
"""
from time import perf_counter as pfc
import os

YEAR = "2024"
DAY = "02"

def elapsedTime(name, fct, input) :
  startTime = pfc()
  result = fct(input)
  print(f"${name} time: {pfc() - startTime:.4} s")
  print(f"${name} result: {result}")

def readInput(filename):
  with open(os.path.join(f"{YEAR}", f"D{DAY}", filename)) as f:
    lines = f.readlines()
  input = (d.strip('\n') for d in lines)
  return tuple(input)

def part1(input):
 
  return

def part2(input):

  return

#input = readInput(f"d{DAY}-sample.txt")
input = readInput(f"d{DAY}-input.txt")
elapsedTime("Part 1",part1, input)
elapsedTime("Part 2",part2, input)