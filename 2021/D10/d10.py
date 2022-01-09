"""
Advent Of Code 2021
Day 10: Syntax Scoring part 1 & 2

https://adventofcode.com/2021/day/10
"""
import os

OPEN_BRACKETS = {"(": 1, "[": 2, "{": 3, "<": 4}
CLOSE_BRACKETS = {")": ["(", 3], "]": ["[", 57], "}": ["{", 1197], ">": ["<", 25137]}

INCOMPLETE = -1
CORRUPTED = -2
OK = 0

def readInput(filename):
  with open(os.path.join("2021", "D10", filename)) as f:
    lines = f.readlines()
  input = (l.strip('\n') for l in lines)
  return tuple(input)

def completeLine(bracketStack):
  score = 0
  while bracketStack:
    c = bracketStack.pop()
    score *= 5
    score += OPEN_BRACKETS[c]
  return score

def processLine(str):
  bracketStack = []
  for c in str:
    if c in OPEN_BRACKETS:
      bracketStack.append(c)
      continue
    if c in CLOSE_BRACKETS:
      if len(bracketStack) == 0:
        return INCOMPLETE, 0
      b = bracketStack[-1]
      if b == CLOSE_BRACKETS[c][0]:
        bracketStack.pop()
        continue
      else:
        return CORRUPTED, CLOSE_BRACKETS[c][1]
  if bracketStack:
    return INCOMPLETE, completeLine(bracketStack)
  return OK, 0

def solve(filename):
  allLines = readInput(filename)
  corruptedScore = 0
  incompleteScore = []

  for l in allLines:
    ret, score = processLine(l)
    if ret == INCOMPLETE:
      incompleteScore.append(score)
    if ret == CORRUPTED:
      corruptedScore += score

  incompleteScore.sort()
  return corruptedScore, incompleteScore[int(len(incompleteScore) / 2)]

print(f"Part 1 and 2 for sample: {solve('d10-sample1.txt')}")
print(f"Part 1 and 2 for puzzle input: {solve('d10-input.txt')}")