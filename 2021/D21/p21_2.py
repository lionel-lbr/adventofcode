"""
Advent Of Code 2021
Day 21: Dirac Dice part 2

https://adventofcode.com/2021/day/21 
"""
from itertools import product
from functools import lru_cache

POS = 0
SCORE = 1

@lru_cache(maxsize=None)
def runOneUniverse(players, activePlayer):
  winners = [0, 0]

  # iterate over each possible combinaison of the dice
  for dice in product([1,2,3], repeat = 3):
    r = sum(dice)
    # create a new player copy to play in this universe
    p = [list(p) for p in players]
    pos = (p[activePlayer][POS] + r) % 10
    p[activePlayer][POS] = 10 if pos == 0 else pos
    p[activePlayer][SCORE] += p[activePlayer][POS]

    if p[activePlayer][SCORE] >= 21:
      # one player one, stop recursion (terminate this universe)
      winners[activePlayer] += 1
    else: 
      # Swap player and recurse ..
      w = runOneUniverse((tuple(p[0]), tuple(p[1])), (activePlayer+1)%2)
      # addup each player previous result 
      winners[0] += w[0]
      winners[1] += w[1]

  print(winners)
  return winners

# @lru_cache needs tuple (hashable)
print(f"\nExample solution: {max(runOneUniverse(((4,0), (8,0)), 0))}")
print(f"\nPart 2 solution: {max(runOneUniverse(((1,0), (3,0)), 0))}")

