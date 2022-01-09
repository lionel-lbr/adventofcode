"""
Advent Of Code 2021
Day 6: Lanternfish part 1 & 2

https://adventofcode.com/2021/day/6 
"""
import os

def readInput(filename):
  with open(os.path.join("2021", "D6", filename)) as f:
    lines = f.readlines()
  input = [int(i) for i in lines[0].strip('\n').split(',')]
  return tuple(input)

def countFish(flock, numberOfDay):
  firstGeneration = list(flock)
  newGenerations = []
  for _ in range(numberOfDay):
    newFishCount = 0
    for i in range(len(firstGeneration)):
      if firstGeneration[i] > 0:
        firstGeneration[i] -= 1
      else:
        firstGeneration[i] = 6
        newFishCount += 1

    # one generation grow and reproduce at the same rate
    for ng in newGenerations:
      if ng[1] > 0:
        ng[1] -= 1
      else:
        ng[1] = 6
        newFishCount += ng[0]

    newGenerations.append([newFishCount, 8])

  fishCount = len(firstGeneration)
  fishCount += sum(map(lambda x: x[0], newGenerations))
  return fishCount

sample = [3, 4, 3, 1, 2]
input = readInput("d6-input.txt")
print(f"Part 1, sample with 18 days: {countFish(sample, 18)}")
print(f"Part 1, sample with 80 days: {countFish(sample, 80)}")
print(f"Part 1, puzzle input with 80 days: {countFish(input, 80)}")

print(f"Part 2, sample with 256 days: {countFish(sample, 256)}")
print(f"Part 2, puzzle input with 256 days: {countFish(input, 256)}")
