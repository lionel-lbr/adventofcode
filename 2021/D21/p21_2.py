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
  for dice in product([1,2,3], repeat = 3):
    r = sum(dice)  

    p = [list(players[0]), list(players[1])]
    pos = (p[activePlayer][POS] + r) % 10
    p[activePlayer][POS] = 10 if pos == 0 else pos
    p[activePlayer][SCORE] += p[activePlayer][POS]

    if p[activePlayer][SCORE] >= 21:
      winners[activePlayer]+=1
    else: 
      # recurse and swap player ..
      w = runOneUniverse((tuple(p[0]), tuple(p[1])), (activePlayer+1)%2)
      winners[0] += w[0]
      winners[1] += w[1]

  print(winners)
  return winners

# @lru_cache needs tuple (hashable)
#players = ((4,0), (8,0))
players = ((1,0), (3,0))
w = runOneUniverse(players, 0)
print(w)

