"""
Advent Of Code 2022
Day 10: Cathode-Ray Tube part 1 & 2

https://adventofcode.com/2022/day/10
"""
from time import perf_counter as pfc
import os

YEAR = "2022"
DAY = "10"

def readInput(filename):
  with open(os.path.join(f"{YEAR}", f"D{DAY}", filename)) as f:
    lines = f.readlines()
  input = (d.strip('\n') for d in lines)
  return tuple((tuple(i.split(" ")) for i in input))

def part1(input):
  startTime = pfc()
  cycle = 0
  strength = 0
  regX = 1

  def incCycleAndStrength():
    nonlocal cycle, strength
    cycle += 1
    if (cycle + 20) % 40 == 0:
      strength += cycle * regX

  for move in input:
    if move[0] == "noop":
      incCycleAndStrength()
    else:
      incCycleAndStrength()
      incCycleAndStrength()
      inc = int(move[1])
      regX += inc

  print(f"Part 1 time: {pfc() - startTime:.4}")
  return strength

def part2(input):
  startTime = pfc()
  cycle = 0
  regX = 1
  result = []

  def incCycleAndDrawPixel():
    nonlocal cycle, result
    cycle += 1
    pos = (cycle - 1) % 40
    if pos == 0: result.append('\n')
    if (pos >= regX - 1 and pos <= regX + 1):
      result.append('0')
    else:
      result.append(' ')

  for move in input:
    if move[0] == "noop":
      incCycleAndDrawPixel()
    else:
      incCycleAndDrawPixel()
      incCycleAndDrawPixel()
      regX += int(move[1])

  print(f"Part 2 time: {pfc() - startTime:.4}")
  return "".join(result)

input = readInput(f"d{DAY}-input.txt")
print(f"Part 1 for puzzle input: {part1(input)}")
print(f"Part 2 for puzzle input: {part2(input)}")
