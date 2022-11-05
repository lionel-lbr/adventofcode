"""
Advent Of Code 2020
Day 13: Shuttle Search part 1 & 2

https://adventofcode.com/2020/day/13
"""
from time import perf_counter as pfc

INFINIT = float('inf')

def part1(dTime, busLines):
  delta = INFINIT
  busId = -1
  for l in busLines:
    if l == 'x':
      continue
    t = int(dTime / l) + 1
    d = (t * l) - dTime
    if d > 0 and d < delta:
      delta = d
      busId = l
  return busId * delta

def part2(input):
  indexes = tuple((delta, val) for delta, val in enumerate(input) if v != 'x')
  done = [False] * len(indexes)
  timestamp = 0
  step = 1
  startTime = pfc()
  while True:
    timestamp += step
    for i, (delta, val) in enumerate(indexes):
      if done[i]:
        continue
      if (timestamp + delta) % val == 0:
        step *= val
        done[i] = True
        break

    if all(done):
      print(f"Time:{pfc()-startTime:.4}")
      return timestamp

INPUT = (1_001_612, (19, 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 41, 'x', 'x', 'x', 37, 'x', 'x', 'x', 'x', 'x', 821,
                     'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 13, 'x', 'x', 'x', 17, 'x', 'x', 'x',
                     'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 29, 'x', 463, 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x',
                     'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 23))

SAMPLE1 = (939, (7, 13, 'x', 'x', 59, 'x', 31, 19))
SAMPLE2 = (0, (17, 'x', 13, 19))
SAMPLE3 = (0, (67, 7, 59, 61))
SAMPLE4 = (0, (67, 'x', 7, 59, 61))
SAMPLE5 = (0, (67, 7, 'x', 59, 61))
SAMPLE6 = (0, (1789, 37, 47, 1889))

print(f"Part 1 for sample: {part1(SAMPLE1[0], SAMPLE1[1])}")
print(f"Part 1 for puzzle input: {part1(INPUT[0], INPUT[1])}")

print(f"Part 2 for sample 1: {part2(SAMPLE1[1])}")
print(f"Part 2 for sample 2: {part2(SAMPLE2[1])}")
print(f"Part 2 for sample 3: {part2(SAMPLE3[1])}")
print(f"Part 2 for sample 4: {part2(SAMPLE4[1])}")
print(f"Part 2 for sample 5: {part2(SAMPLE5[1])}")
print(f"Part 2 for sample 6: {part2(SAMPLE6[1])}")
print(f"Part 2 for puzzle input: {part2(INPUT[1])}")
