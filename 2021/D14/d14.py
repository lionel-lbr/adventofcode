"""
Advent Of Code 2021
Day 14: Extended Polymerization part 1 and 2

https://adventofcode.com/2021/day/14 
"""

from collections import Counter

# will proceed with pair insertion
# counterMap will keep track of already calculated polymer per step
def pairInsertion(pair, steps, counterMap=dict()):
  
  # check if a polymer counter already exist
  c = counterMap.get((steps, pair), None)
  if c is not None: 
    return c

  # new element to insert
  newElt = insertionRules[pair]
  
  if steps==0:
    c = Counter()
  else:
    # recurse on left pair & right pair
    counterLeft = pairInsertion(pair[0]+newElt, steps-1, counterMap)
    counterRight = pairInsertion(newElt+pair[1], steps-1, counterMap)
    
    # create a new Counter adding up left and right
    c = Counter(counterLeft)
    c.update(counterRight)
  
  # count the newly created element
  c.update(newElt)
  counterMap[(steps, pair)] = c
  return c


def run(maxNumberOfSteps):

  topCounter = Counter(input)
  for j in range(0, len(input)-1):
    c = pairInsertion(input[j:j+2], maxNumberOfSteps-1)
    topCounter.update(c)

  # get min & max occurence
  mostCommonCount = topCounter.most_common()[0][1]
  leastCommonCount = topCounter.most_common()[-1][1] # last of the list ...
  return mostCommonCount - leastCommonCount

# read puzzle input
with open("2021/D14/d14-input.txt") as f:
  lines = f.readlines()
insertionRules = dict([l.strip('\n').split(' -> ') for l in lines])

input = "FPNFCVSNNFSFHHOCNBOB"

print("AdventOfCode 2021 D14 part 1:", run(10))
print("AdventOfCode 2021 D14 part 2:", run(40))
