"""
Advent Of Code 2021
Day 7: The Treachery of Whales part 1 & 2

https://adventofcode.com/2021/day/7
"""
infinity = float("inf")

def findBestPosition(crabs, fuelCostFct = lambda x: x):
  highestPos = max(crabs)
  lowestPos = min(crabs)
  bestPosition = 0
  minFuel = infinity
  for pos in range(lowestPos, highestPos+1):
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


sample = [16,1,2,0,4,2,7,1,2,14]
with open("2021/D7/d7-input.txt") as f:
  lines = f.readlines()
input = [int(i) for i in lines[0].strip('\n').split(',')]

print("Part 1 sample:",findBestPosition(sample))
print("Part 1 puzzle:",findBestPosition(input))

# for part 2 fuel cost now evolve as divergent serie 
print("Part 2 sample:",findBestPosition(sample, fuelCostFct=lambda x: (x*(x+1)/2)))
print("Part 2 puzzle:",findBestPosition(input, fuelCostFct=lambda x: (x*(x+1)/2)))
