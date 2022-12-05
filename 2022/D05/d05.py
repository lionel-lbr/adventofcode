"""
Advent Of Code 2022
Day 5: Supply Stacks part 1 & 2

https://adventofcode.com/2022/day/5
"""
from time import perf_counter as pfc
import os

YEAR = "2022"
DAY = "05"

def readInput(filename):
  with open(os.path.join(f"{YEAR}", f"D{DAY}", filename)) as f:
    lines = f.readlines()
  input = (d.strip('\n') for d in lines)
  return tuple(map(lambda l: tuple(int(x) for x in l if x.isdigit()), map(lambda x: x.split(" "), input)))

INITIAL_CRATE = ['FHBVRQDP', 'LDZQWV', 'HLZQGRPC', 'RDHFJVB', 'ZWLC', 'JRPNTGVM', 'JRLVMBS', 'DPJ', 'DCNWV']

def part1(input):
  crate = [list(l) for l in INITIAL_CRATE]
  startTime = pfc()
  for move in input:
    count, fr, to = move
    crate[to - 1].extend(crate[fr - 1][-count:][::-1])  # reverse the payload
    crate[fr - 1] = crate[fr - 1][:-count]

  print(f"Part 1 time: {pfc() - startTime:.4}")
  return "".join(n[-1] for n in crate)

def part2(input):
  crate = [list(l) for l in INITIAL_CRATE]
  startTime = pfc()
  for move in input:
    count, fr, to = move
    crate[to - 1].extend(crate[fr - 1][-count:])
    crate[fr - 1] = crate[fr - 1][:-count]

  print(f"Part 2 time: {pfc() - startTime:.4}")
  return "".join(n[-1] for n in crate)

input = readInput(f"d{DAY}-input.txt")
print(f"Part 1 for puzzle input: {part1(input)}")
print(f"Part 2 for puzzle input: {part2(input)}")
