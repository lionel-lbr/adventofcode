"""
Advent Of Code 2021
Day 7: The Treachery of Whales part 1 & 2

https://adventofcode.com/2021/day/7
"""
import os

INFINITY = float("inf")

def readInput(filename):
  with open(os.path.join("2021", "D07", filename)) as f:
    lines = f.readlines()
  input = [int(i) for i in lines[0].strip('\n').split(',')]
  return tuple(input)

def solve(crabs, fuelCostFct=lambda x: x):
  highestPos = max(crabs)
  lowestPos = min(crabs)
  bestPosition = 0
  minFuel = INFINITY
  for pos in range(lowestPos, highestPos + 1):
    totalFuel = 0
    for c in crabs:
      fuel = abs(c - pos)
      totalFuel += fuelCostFct(fuel)

      if totalFuel > minFuel:
        break

    if totalFuel < minFuel:
      minFuel = totalFuel
      bestPosition = pos

  return bestPosition, minFuel

sample = [16, 1, 2, 0, 4, 2, 7, 1, 2, 14]
input = readInput("d7-input.txt")

print(f"Part 1 sample: {solve(sample)}")
print(f"Part 1 puzzle input: {solve(input)}")

# for part 2 fuel cost now evolve as divergent serie
print(f"Part 2 sample: {solve(sample, fuelCostFct=lambda x: (x * (x + 1) / 2))}")
print(f"Part 2 puzzle input: {solve(input, fuelCostFct=lambda x: (x * (x + 1) / 2))}")
