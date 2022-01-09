"""
Advent Of Code 2021
Day 14: Extended Polymerization part 1 and 2

https://adventofcode.com/2021/day/14 
"""
import os
from collections import Counter

def readInput(filename):
  with open(os.path.join("2021", "D14", filename)) as f:
    lines = f.readlines()
  insertionRules = dict([l.strip('\n').split(' -> ') for l in lines])
  input = "FPNFCVSNNFSFHHOCNBOB"
  return input, insertionRules

# will proceed with pair insertion
#   counterCache will cache already calculated polymer for each step
def pairInsertion(insertionRules, pair, steps, counterCache=dict()):
  # check if a polymer counter is already cached
  c = counterCache.get((steps, pair), None)
  if c is not None:
    return c

  # new element to insert
  newElt = insertionRules[pair]
  if steps == 0:
    c = Counter()
  else:
    # recurse on left pair & right pair
    counterLeft = pairInsertion(insertionRules, pair[0] + newElt, steps - 1, counterCache)
    counterRight = pairInsertion(insertionRules, newElt + pair[1], steps - 1, counterCache)
    # create a new Counter adding up left and right
    c = Counter(counterLeft)
    c.update(counterRight)

  # count the newly created element
  c.update(newElt)
  counterCache[(steps, pair)] = c
  return c

def run(input, insertionRules, maxNumberOfSteps):
  topCounter = Counter(input)
  for j in range(len(input) - 1):
    c = pairInsertion(insertionRules, input[j:j + 2], maxNumberOfSteps - 1)
    topCounter.update(c)
  # get min & max occurence
  mostCommonCount = topCounter.most_common()[0][1]
  leastCommonCount = topCounter.most_common()[-1][1]  # last of the list ...
  return mostCommonCount - leastCommonCount

input, insertionRules = readInput("d14-input.txt")
print("Part 1:", run(input, insertionRules, 10))
print("Part 2:", run(input, insertionRules, 40))
