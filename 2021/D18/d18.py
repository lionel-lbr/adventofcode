"""
Advent Of Code 2021
Day 18: Snailfish part 1 & 2

https://adventofcode.com/2021/day/18 
"""
import os

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
        l, i = self.getList(i+1)
        res.append(l)
        continue
      if self._lst[i] == "]":
        return res, i+1
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
      if len(digit) > 0:
        res.append(int(digit))
        digit = ""
      res.append(c)
    while "," in res:
      res.remove(",")
    return res

  def explodeAndReduce(self):
    while True:
      while self.explode():
        pass
      if not self.reduce():
        break
  
  def reduce(self):
    i = 0
    while i < len(self._lst):
      c = self._lst[i]
      if isinstance(c, int) and c >= 10:
        n = self._lst[i]
        l = int(n/2)
        r = n - l
        right = self._lst[i+1:]
        self._lst = list(self._lst[:i])
        self._lst.extend(["[",l,r,"]"])
        self._lst.extend(right)
        return True
      i += 1
    return False

  def explode(self):
    leftDigitIndex = -1
    deep = 0
    i = 0
    while i < len(self._lst):
      c = self._lst[i]
      if c == "[":
        deep += 1
        if deep >= 5 and isinstance(self._lst[i+1], int) \
                      and isinstance(self._lst[i+2], int):
          # propagate change to left
          if leftDigitIndex > 0:
            self._lst[leftDigitIndex] += self._lst[i+1]
          
          # remove the pair and replace by 0
          rightNumber = self._lst[i+2]
          right = self._lst[i+4:]
          self._lst = list(self._lst[0:i])
          self._lst.append(0)
          self._lst.extend(right)

          # search for the next number on the right
          i += 1
          while i < len(self._lst): 
            if isinstance(self._lst[i], int):
              self._lst[i] += rightNumber
              break 
            i+=1
          return True
      elif c == "]":
        deep -= 1
      else:
        leftDigitIndex = i
      i += 1
    return False

  def add(self, lst):
    self._lst.insert(0,'[')
    self._lst.extend(self.listToStingList(lst))
    self._lst.append(']')
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
  with open(os.path.join("2021","D18",filename)) as f:
    lines = f.readlines()
  input = [l.strip('\n') for l in lines]
  sf = None
  for i in input:
    if sf is None:
      sf = Snailfish(i)
      continue
    sf.add(i)
  print("Part 1 result for %s"%filename)
  print(sf)
  print(sf.magnitude())

def part2(filename):
  with open(os.path.join("2021","D18",filename)) as f:
    lines = f.readlines()
  input = [l.strip('\n') for l in lines]
  maxMagnitude = 0
  for i, op1 in enumerate(input):
    for j, op2 in enumerate(input):
      if i == j:
        continue
      sf = Snailfish(op1)
      sf.add(op2)
      m = sf.magnitude()
      maxMagnitude = max(maxMagnitude, m)
      print(sf)
      print("%d - %d"%(maxMagnitude, m))

  print("Part 2 result for %s"%filename)
  print("Max magnitude:", maxMagnitude)

part1("d18-sample1.txt")
part1("d18-sample2.txt")
part1("d18-input.txt")

part2("d18-sample1.txt")
part2("d18-sample2.txt")
part2("d18-input.txt")
