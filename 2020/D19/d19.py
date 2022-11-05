"""
Advent Of Code 2020
Day 19: xxx part 1 & 2

https://adventofcode.com/2020/day/19
"""
from time import perf_counter as pfc
import os

def readInput(filename):
  with open(os.path.join("2020", "D19", filename)) as f:
    lines = f.readlines()
  rules = {}
  linesIter = iter(lines)
  for l in linesIter:
    if not l.strip('\n'):
      break
    rid, rule = l.strip("\n").split(':')
    rid = int(rid)
    rules[rid] = []
    if "a" in rule:
      rules[rid].append(True)
      rules[rid].append(tuple(tuple('a')))
      continue
    if "b" in rule:
      rules[rid].append(True)
      rules[rid].append(tuple(tuple('b')))
      continue
    rules[rid].append(False)
    t = []
    for r in rule.split("|"):
      t.append("".join(tuple(f"<{id}>" for id in r.strip(' \n').split(' '))))
    rules[rid].append(t)
  messages = list(l.strip(' \n') for l in linesIter)
  messages.sort()
  # messages = tuple(m for m in messages if len(m) == 24)
  return rules, tuple(messages)

def reduceRule(crid, seq, rule):
  p = f"<{crid}>"
  reduced = []
  for r in rule:
    n = r.count(p)
    if n == 0:
      reduced.append(r)
    elif n > 1 and len(seq) > 1:
      reduced.extend(r.replace(p, e) for e in seq)
      # print(f"{crid} : {rule} - {seq}")
      # nn = [r] * n * len(seq)
      # rCount = 0
      # for i, n in enumerate(nn):
      #   nn[i] = n.replace(p, seq[rCount], 1)

      # nn = [r.replace(p, e, i + 1) for i in range(n) for e in seq]
      # reduced.extend(n1.replace(p, e) for n1 in nn for e in seq)
      # print(f"{reduced}")
    else:
      reduced.extend(r.replace(p, e) for e in seq)
  return reduced

def part1(rules, messages):
  startTime = pfc()
  #reduce rules
  aRules = []
  for r in range(len(rules)):
    aRules.append(rules[r])

  while not aRules[0][0]:
    # find a completed rule
    for crid, rule in enumerate(aRules):
      if not rule:
        continue
      if rule[0]:
        break
    seq = rule[1]
    # replace rule id
    for rid, rule in enumerate(aRules):
      if not rule:
        continue
      if rule[0]:
        continue
      ne = reduceRule(crid, seq, rule[1])
      completed = all(map(lambda x: x.isalpha(), ne))
      aRules[rid] = (completed, ne)
    aRules[crid] = None

  rules = aRules[0][1]
  m = tuple(m for m in messages if len(m) == 24 and m in rules)
  m = set(m)
  r = set(rules).intersection(m)
  result = len(r)

  print(f"Part 1 time: {pfc() - startTime:.4}")
  return result

def part2(input):
  startTime = pfc()
  print(f"Part 2 time: {pfc() - startTime:.4}")
  return

rules, messages = readInput(f"d19-input.txt")
#rules, messages = readInput(f"d19-sample.txt")
print(f"Part 1 for puzzle input: {part1(rules, messages)}")
print(f"Part 2 for puzzle input: {part2(input)}")
