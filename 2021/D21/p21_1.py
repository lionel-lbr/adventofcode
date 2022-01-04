"""
Advent Of Code 2021
Day 21: Dirac Dice part 1

https://adventofcode.com/2021/day/21 
"""
POS = 0
SCORE = 1

DICE_THROW = [i for i in range(1, 101)]

def rollDiceAndMovePlayer(p, dice):
  # roll dice
  r = 0
  for _ in range(3):
    r += DICE_THROW[dice]
    dice = (dice + 1) % 100
        
  # move player
  pos = (p[POS] + r%10) % 10
  p[POS] = 10 if pos == 0 else pos
  p[SCORE] += p[POS]
  return dice

def solve(players):
  dice = 0
  nbrOfRolls = 0
  activePlayer = 0
  while True:
    dice = rollDiceAndMovePlayer(players[activePlayer], dice)
    nbrOfRolls += 3
    if players[activePlayer][SCORE] >= 1000:
      break
    activePlayer = (activePlayer + 1) % 2 

  print(players)
  return min(players[0][SCORE], players[1][SCORE]) * nbrOfRolls

print(f"Example solution: {solve([[4,0], [8,0]])}\n")
print(f"Part 1 solution: {solve([[1,0], [3,0]])}\n")
