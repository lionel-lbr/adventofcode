"""
Advent Of Code 2021
Day 6: Lanternfish part 1 & 2

https://adventofcode.com/2021/day/6 
"""

def countFish(flock, nbrOfDay):
  firstGeneration = flock.copy()
  newGenerations = []
  for d in range(nbrOfDay):
    newFishCount = 0
    for i in range(len(firstGeneration)):
      if firstGeneration[i] > 0:
        firstGeneration[i] -= 1
      else:
        firstGeneration[i] = 6
        newFishCount+=1
    
    # one generation grow and reproduce at the same rate
    for ng in newGenerations:
      if ng[1] > 0:
        ng[1] -= 1
      else:
        ng[1] = 6
        newFishCount += ng[0]
    
    newGenerations.append([newFishCount, 8])
  
  nbrOfFish = len(firstGeneration)
  for ng in newGenerations:
    nbrOfFish += ng[0]
  return nbrOfFish

sample = [3,4,3,1,2]
with open("2021/D6/d6-input.txt") as f:
  lines = f.readlines()

input = [int(i) for i in lines[0].strip('\n').split(',')]

print(countFish(sample, 18))
print(countFish(sample, 80))
print(countFish(input, 80))

print(countFish(sample, 256))
print(countFish(input, 256))