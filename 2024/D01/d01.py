"""
Advent Of Code 2024
Day 1: Historian Hysteria part 1 & 2

https://adventofcode.com/2024/day/1
"""
from time import perf_counter as pfc
import os

YEAR = "2024"
DAY = "01"

def readInput(filename):
  with open(os.path.join(f"{YEAR}", f"D{DAY}", filename)) as f:
    lines = f.readlines()
  input = ((int(e[0]), int(e[1])) for e in (e.split("   ") for e in (d.strip('\n') for d in lines)))
  return tuple(input)

def elapsedTime(name, fct, input) :
  startTime = pfc()
  result = fct(input)
  print(f"${name} time: {pfc() - startTime:.4} s")
  print(f"${name} result: {result}")


def part1(input):
  tuple1, tuple2  = zip(*input)
  
  # sort the 2 array
  sorted_tuple1 = sorted(tuple1)
  sorted_tuple2 = sorted(tuple2)

  # iterate through 1st tuple and calculate distance 
  result = 0
  for index, e1 in enumerate(sorted_tuple1):
    result += abs(e1- sorted_tuple2[index])

  return result

def part2(input): 
  tuple1, tuple2  = zip(*input)
  # generate a tuple of occurrence count
  occurrences = (v*tuple2.count(v) for v in tuple1)
  return sum(occurrences)

#input = readInput(f"d{DAY}-sample.txt")
input = readInput(f"d{DAY}-input.txt")
elapsedTime("Part 1",part1, input)
elapsedTime("Part 2",part2, input)
