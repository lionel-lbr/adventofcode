"""
Advent Of Code 2021
Day 4: Giant Squid part 1 & 2

https://adventofcode.com/2021/day/4
"""
import os

def readInput(filename):
  with open(os.path.join("2021", "D4", filename)) as f:
    lines = f.readlines()
  randoms = (int(n) for n in lines[0].strip('\n').split(","))

  boards = []
  tableRows = []
  for i in range(2, len(lines)):
    row = lines[i]
    if row == '\n':
      boards.append(Board(tableRows))
      tableRows = []
      print("Append board:%d" % len(boards))
    else:
      print("Adding row:%s" % row)
      tableRows.append([int(n) for n in row.strip('\n').split(" ") if n !=''])

  return tuple(randoms), tuple(boards)

class Board:

  def __init__(self, rows):
    self._hasWon = False
    self._lines = []
    for r in rows:
      self._lines.append(r)

    self._buildColunm(rows)

  def _buildColunm(self, rows):
    for i in range(5):
      col = []
      for r in rows:
        col.append(r[i])
      self._lines.append(col)

  def hasWon(self):
    return self._hasWon

  def won(self, n):
    winner = False
    for l in self._lines:
      while len(l) > 0 and n in l:
        l.remove(n)
      if len(l) == 0:
        winner = True
        self._hasWon = True
    return winner

  def calculateScore(self):
    score = 0
    for i in range(5):
      r = self._lines[i]
      for n in r:
        score += n
    return score

def solve(filename):
  randoms, boards = readInput(filename)
  winningBoards = []
  for r in randoms:
    for board in boards:
      if board.hasWon():
        continue
      if board.won(r):
        score = board.calculateScore()
        winningBoards.append((board, score, r))

  # return first and last winning board
  return (winningBoards[0], winningBoards[-1])

firstWinningBoard, lastWinningBoard = solve("d4-input.txt")
print(f"Part 1 score is: {firstWinningBoard[1] * firstWinningBoard[2]}")
print(f"Part 2 score is: {lastWinningBoard[1] * lastWinningBoard[2]}")
