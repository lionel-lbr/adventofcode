"""
Advent Of Code 2021
Day 3: Binary Diagnostic part 1 & 2

https://adventofcode.com/2021/day/3
"""
import os

def readInput(filename):
  with open(os.path.join("2021", "D3", filename)) as f:
    lines = f.readlines()
  input = (d.strip('\n') for d in lines)
  return tuple(input)

def solvePart1(input):
  gamma, epsilon = 0, 0
  for i in range(len(input[0])):
    zeroCount, oneCount = 0, 0
    gamma = gamma << 1
    epsilon = epsilon << 1
    for d in input:
      if d[i] == '1':
        oneCount += 1
      else:
        zeroCount += 1
    if oneCount > zeroCount:
      gamma |= 1
    else:
      epsilon |= 1
  return gamma * epsilon

def splitZeroAndOne(lines, bitIndex):
  zeroOneSorted = ([], [])
  for d in lines:
    zeroOneSorted[int(d[bitIndex], 2)].append(d)
  return zeroOneSorted

def solvePart2(input):
  o2Level, co2Level = 0, 0
  co2Input, o2Input = input, input
  for i in range(len(input[0])):
    if len(co2Input) > 1:
      zeros, ones = splitZeroAndOne(co2Input, i)
      co2Input = ones if len(ones) < len(zeros) else zeros
    if len(o2Input) > 1:
      zeros, ones = splitZeroAndOne(o2Input, i)
      o2Input = ones if len(ones) >= len(zeros) else zeros

  co2Level = int(co2Input[0], 2)
  o2Level = int(o2Input[0], 2)
  return co2Level * o2Level

input = readInput("d3-input.txt")
print(f'Part 1: {solvePart1(input)}')
print(f'Part 2: {solvePart2(input)}')