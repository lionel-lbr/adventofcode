"""
Advent Of Code 2020
Day 14: Docking Data part 1 & 2

https://adventofcode.com/2020/day/14
"""
from time import perf_counter as pfc
import os

def readInput(filename):
  with open(os.path.join("2020", "D14", filename)) as f:
    lines = f.readlines()
  input = []
  entry = []
  for l in lines:
    if l.startswith("mask"):
      if entry:
        input.append(entry)
      mask = l.split("=")[1].strip(" \n")
      entry = [mask]
      continue
    adr, value = l.split("=")
    adr = adr[adr.index("[") + 1:adr.index("]")]
    adr = int(adr)
    value = int(value.strip(" "))
    entry.append((adr, value))

  input.append(entry)
  return tuple(input)

def applyMask(mask, val, bit='X'):
  result = list(mask)
  bitStr = bin(val)[2:]
  bitStr = bitStr.zfill(len(mask))
  for i, b in enumerate(result):
    if b == bit:
      result[i] = bitStr[i]
  return "".join(result)

def part1(input):
  mask = ""
  addresses = dict()
  for e in input:
    mask = e[0]
    for addr, value in e[1:]:
      addresses[addr] = int(applyMask(mask, value))
  return sum(addresses.values())

def part2(input):
  startTime = pfc()
  mask = ""
  addresses = []
  values = []
  for e in input:
    mask = e[0]
    for addr, value in e[1:]:
      newAdr = applyMask(mask, addr, bit='0')
      if newAdr not in addresses:
        addresses.append(newAdr)
        values.append(value)
      else:
        index = addresses.index(newAdr)
        addresses[index] = newAdr
        values[index] = value

  uniqueAddresses = set()
  result = 0
  values = reversed(values)
  for adr in reversed(addresses):
    currValue = next(values)
    bitVal = 1
    currAddresses = [0]
    for b in reversed(adr):
      if b == 'X':
        newAddresses = list(currAddresses)
        for i, v in enumerate(currAddresses):
          currAddresses[i] = v + bitVal
        currAddresses += newAddresses
      else:
        b = int(b) * bitVal
        for i, v in enumerate(currAddresses):
          currAddresses[i] = v + b
      bitVal *= 2
    addrCount = len(uniqueAddresses)
    uniqueAddresses.update(currAddresses)
    result += currValue * (len(uniqueAddresses) - addrCount)
  print(f"Time:{pfc() - startTime}")
  return result

input = readInput("d14-input.txt")
print(f"Part 1 for puzzle input: {part1(input)}")
print(f"Part 2 for puzzle input: {part2(input)}")
