"""
Advent Of Code 2022
Day 9: Rope Bridges part 1 & 2

https://adventofcode.com/2022/day/9
"""
from time import perf_counter as pfc
import os
import functools

YEAR = "2022"
DAY = "09"

def readInput(filename):
  with open(os.path.join(f"{YEAR}", f"D{DAY}", filename)) as f:
    lines = f.readlines()
  input = (d.strip('\n') for d in lines)
  return tuple(tuple((move[0], int(move[1]))) for move in (i.split(" ") for i in input))

class Rope:
  def __init__(self, size) -> None:
    self.knots = tuple([0, 0] for i in range(size))
    self.head = self.knots[0]
    self.tail = self.knots[size - 1]
    self.trace = set()

  def shouldMove(self, head, tail):
    if (tail[0] >= head[0] - 1 and tail[0] <= head[0] + 1 and tail[1] >= head[1] - 1 and tail[1] <= head[1] + 1):
      return False
    return True

  def moveOneStep(self):
    def _move(head, tail):
      if self.shouldMove(head, tail):
        dx = head[0] - tail[0]
        dy = head[1] - tail[1]
        tail[0] += 1 if dx > 0 else -1 if dx < 0 else 0
        tail[1] += 1 if dy > 0 else -1 if dy < 0 else 0
      return tail

    functools.reduce(_move, self.knots)
    self.trace.add(tuple(self.tail))

  def moveRight(self, steps):
    while (steps > 0):
      self.head[0] += 1
      self.moveOneStep()
      steps -= 1

  def moveLeft(self, steps):
    while (steps > 0):
      self.head[0] -= 1
      self.moveOneStep()
      steps -= 1

  def moveUp(self, steps):
    while (steps > 0):
      self.head[1] += 1
      self.moveOneStep()
      steps -= 1

  def moveDown(self, steps):
    while (steps > 0):
      self.head[1] -= 1
      self.moveOneStep()
      steps -= 1

def solve(input, size):
  startTime = pfc()
  rope = Rope(size)

  for move in input:
    d, s = move
    if (d == "R"):
      rope.moveRight(s)
    elif (d == "L"):
      rope.moveLeft(s)
    elif (d == "U"):
      rope.moveUp(s)
    elif (d == "D"):
      rope.moveDown(s)

  print(f"Time: {pfc() - startTime:.4}")
  return len(rope.trace)

input = readInput(f"d{DAY}-input.txt")
print(f"Part 1 for puzzle input: {solve(input,2)}")
print(f"Part 2 for puzzle input: {solve(input,10)}")
