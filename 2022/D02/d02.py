"""
Advent Of Code 2022
Day 2: Rock Paper Scissors part 1 & 2

https://adventofcode.com/2022/day/2
"""
from time import perf_counter as pfc
import os
import functools

YEAR = "2022"
DAY = "02"

def readInput(filename):
  with open(os.path.join(f"{YEAR}", f"D{DAY}", filename)) as f:
    lines = f.readlines()
  input = (d.strip('\n') for d in lines)
  return tuple((i[0], i[2]) for i in tuple(input))

WIN_PAIRS = {"A": 'Y', "B": 'Z', "C": 'X'}
LOOSE_PAIRS = {"A": 'Z', "B": 'X', "C": 'Y'}
DRAW_PAIRS = {"A": 'X', "B": 'Y', "C": 'Z'}

POINTS = {"X": 1, "Y": 2, "Z": 3}

def part1(input):
  startTime = pfc()

  def game(s, g):
    (player1, player2) = g
    if WIN_PAIRS[player1] == player2:  # win
      return s + 6 + POINTS[player2]
    if DRAW_PAIRS[player1] == player2:  # draw
      return s + 3 + POINTS[player2]
    return s + POINTS[player2]  # loose

  result = functools.reduce(game, input, 0)
  print(f"Part 1 time: {pfc() - startTime:.4}")
  return result

def part2(input):
  startTime = pfc()

  def game(s, g):
    (player1, player2) = g
    if player2 == "X":  # loose
      return s + POINTS[LOOSE_PAIRS[player1]]
    if player2 == "Y":  # draw
      return s + 3 + POINTS[DRAW_PAIRS[player1]]
    if player2 == "Z":  # win
      return s + 6 + POINTS[WIN_PAIRS[player1]]

  result = functools.reduce(game, input, 0)
  print(f"Part 2 time: {pfc() - startTime:.4}")
  return result

input = readInput(f"d{DAY}-input.txt")
print(f"Part 1 for puzzle input: {part1(input)}")
print(f"Part 2 for puzzle input: {part2(input)}")
