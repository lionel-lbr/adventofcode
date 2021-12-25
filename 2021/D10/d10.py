"""
Advent Of Code 2021
Day 10: Syntax Scoring part 1 & 2

https://adventofcode.com/2021/day/10
"""
OPEN_BRACKETS = {
  "(":1,
  "[":2,
  "{":3,
  "<":4}

CLOSE_BRACKETS = {
    ")":["(", 3],
    "]":["[", 57],
    "}":["{", 1197],
    ">":["<", 25137]}

INCOMPLETE = -1
CORRUPTED = -2
OK = 0

def getInput():
  with open("2021/D10/d10-input.txt") as f:
    lines = f.readlines()
  return [l.strip('\n') for l in lines]

def completeLine(bracketStack):
  score = 0
  while(len(bracketStack) >0 ):
    c = bracketStack.pop()
    score *= 5
    score += OPEN_BRACKETS[c]
  return score


def processLine(str):
  bracketStack=[]
  for c in str:
    if c in OPEN_BRACKETS.keys():
      bracketStack.append(c)
      continue
    if c in CLOSE_BRACKETS.keys():
      if len(bracketStack) == 0:
        return INCOMPLETE, 0
      b = bracketStack[-1]
      if b == CLOSE_BRACKETS[c][0]:
         bracketStack.pop()
         continue
      else:
        return CORRUPTED, CLOSE_BRACKETS[c][1]
  if len(bracketStack)!=0:
    return INCOMPLETE, completeLine(bracketStack)
  return OK, 0
  

allLines = getInput()
corruptedScore = 0
incompleteScore = []

for i, l in enumerate(allLines):
  ret, score = processLine(l)
  if ret == INCOMPLETE:
    print("%d:%s incomplete"%(i, l))
    incompleteScore.append(score)
  if ret == CORRUPTED:
    print("%d:%s corrupted"%(i, l))
    corruptedScore += score

print("Corrupted score:", corruptedScore)
incompleteScore.sort()
print("Incomplete score:", incompleteScore[int(len(incompleteScore)/2)])
