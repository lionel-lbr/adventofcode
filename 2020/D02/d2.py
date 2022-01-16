"""
Advent Of Code 2020
Day 2: Password Philosophy part 1 & 2

https://adventofcode.com/2020/day/2
"""
import os

def readInput(filename):
  with open(os.path.join("2020", "D02", filename)) as f:
    lines = f.readlines()
  input = []
  for s in (d.strip('\n') for d in lines):
    rule, password = s.split(":")
    rep, sign = rule.split(" ")
    min, max = rep.split("-")
    input.append((((int(min), int(max)), sign.strip(" ")), password.strip(" ")))
  return tuple(input)

def part1(input):
  validCount = 0
  for v in input:
    ((min, max), sign), password = v
    count = password.count(sign)
    if count >= min and count <= max:
      validCount += 1
  return validCount

def part2(input):
  validCount = 0
  for v in input:
    ((i1, i2), sign), password = v
    validCount += 1 if (password[i1 - 1], password[i2 - 1]).count(sign) == 1 else 0
  return validCount

input = readInput("d2-input.txt")
print(f"Part 1: {part1(input)}")
print(f"Part 2: {part2(input)}")