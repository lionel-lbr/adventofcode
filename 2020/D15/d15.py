"""
Advent Of Code 2020
Day 15: Rambunctious Recitation part 1 & 2

https://adventofcode.com/2020/day/15
"""
from time import perf_counter as pfc

def solve(input, maxTurn):
  startTime = pfc()
  spoken = dict()
  for i, n in enumerate(input[:-1]):
    spoken[n] = i + 1
  turn = len(spoken) + 1
  lastSpoken = input[-1]
  while turn < maxTurn:
    if lastSpoken not in spoken:
      spoken[lastSpoken] = turn
      lastSpoken = 0
    else:
      nextSpoken = turn - spoken[lastSpoken]
      spoken[lastSpoken] = turn
      lastSpoken = nextSpoken
    turn += 1

  print(f"Time: {pfc() - startTime:.4}")
  return lastSpoken

input = [1, 0, 16, 5, 17, 4]
print(f"Part 1 for puzzle input: {solve(input, 2020)}")
print(f"Part 2 for puzzle input: {solve(input, 30000000)}")
