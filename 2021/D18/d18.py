"""
Advent Of Code 2021
Day 18: Snailfish part 1 & 2

https://adventofcode.com/2021/day/18 
"""
import os
from time import perf_counter as pfc

def readInput(filename):
  with open(os.path.join("2021", "D18", filename)) as f:
    lines = f.readlines()
  input = tuple(l.strip('\n') for l in lines)
  return input

class Snailfish:
  def __init__(self, lst):
    self._lst = self.listToStingList(lst)

  def __str__(self):
    return str(self.getList())

  def getList(self, index=0):
    i = index
    res = []
    while i < len(self._lst):
      if self._lst[i] == "[":
        l, i = self.getList(i + 1)
        res.append(l)
        continue
      if self._lst[i] == "]":
        return res, i + 1
      res.append(self._lst[i])
      i += 1
    return res[0]

  def listToStingList(self, lst):
    rstr = str(lst).replace(' ', '')
    res = []
    digit = ""
    for c in rstr:
      if c.isdigit():
        digit += c
        continue
      if digit:
        res.append(int(digit))
        digit = ""
      res.append(c)
    # remove all comma
    return list(filter(lambda x: x != ",", res))

  def explodeAndReduce(self):
    while True:
      while self.explode():
        pass
      if not self.reduce():
        break

  def reduce(self):
    for i, c in enumerate(self._lst):
      if isinstance(c, int) and c >= 10:
        ln = int(c / 2)
        rn = c - ln
        right = self._lst[i + 1:]
        self._lst = self._lst[:i] + ["[", ln, rn, "]"] + right
        return True
    return False

  def explode(self):
    leftDigitIndex = -1
    deep = 0
    for i, c in enumerate(self._lst):
      if c == "[":
        deep += 1
        if deep >= 5 and isinstance(self._lst[i+1], int) \
                      and isinstance(self._lst[i+2], int):
          # propagate change to left
          if leftDigitIndex > 0:
            self._lst[leftDigitIndex] += self._lst[i + 1]

          # remove the pair and replace by 0
          rightNumber = self._lst[i + 2]
          right = self._lst[i + 4:]
          self._lst = self._lst[:i] + [0] + right

          # search for the next number on the right
          for j in range(i + 1, len(self._lst)):
            if isinstance(self._lst[j], int):
              self._lst[j] += rightNumber
              break
          return True
      elif c == "]":
        deep -= 1
      else:
        leftDigitIndex = i
    return False

  def add(self, lst):
    self._lst = ['['] + self._lst + self.listToStingList(lst) + [']']
    self.explodeAndReduce()

  def magnitude(self, lst=None):
    if lst is None:
      lst = self.getList()
    if isinstance(lst[0], int):
      lm = lst[0] * 3
    else:
      lm = self.magnitude(lst[0]) * 3
    if isinstance(lst[1], int):
      rm = lst[1] * 2
    else:
      rm = self.magnitude(lst[1]) * 2
    return lm + rm

def part1(filename):
  input = readInput(filename)
  start = pfc()
  sf = Snailfish(input[0])
  for i in input[1:]:
    sf.add(i)
  return sf.magnitude(), pfc() - start

def part2(filename):
  input = readInput(filename)
  start = pfc()
  maxMagnitude = 0
  for i, op1 in enumerate(input):
    for j, op2 in enumerate(input):
      if i == j:
        continue
      sf = Snailfish(op1)
      sf.add(op2)
      m = sf.magnitude()
      maxMagnitude = max(maxMagnitude, m)
  return maxMagnitude, pfc() - start

result, time = part1('d18-sample1.txt')
print(f"Part 1 for sample 1: {result}, time:{time:.2f} sec")
result, time = part1('d18-sample2.txt')
print(f"Part 1 for sample 2: {result}, time:{time:.2f} sec")
result, time = part1('d18-input.txt')
print(f"Part 1 for puzzle input: {result}, time:{time:.2f} sec")
print("")
result, time = part2('d18-sample1.txt')
print(f"Part 2 for sample 1: {result}, time:{time:.2f} sec")
result, time = part2('d18-sample2.txt')
print(f"Part 2 for sample 1: {result}, time:{time:.2f} sec")
result, time = part2('d18-input.txt')
print(f"Part 2 for puzzle input: {result}, time:{time:.2f} sec")
