"""
Advent Of Code 2020
Day 16: Ticket Translation part 1 & 2

https://adventofcode.com/2020/day/16
"""
from time import perf_counter as pfc
import os

def readInput(filename):
  with open(os.path.join("2020", "D16", filename)) as f:
    lines = f.readlines()

  linesIter = iter(lines)
  allRules = []
  for l in linesIter:
    l = l.strip("\n")
    if not l:
      continue
    if l.startswith("your ticket:"):
      myTicket = next(linesIter).strip("\n").split(",")
      myTicket = tuple(map(int, myTicket))
      continue
    if l.startswith("nearby tickets:"):
      otherTickets = tuple(tuple(map(int, l)) for l in (l.split(",") for l in linesIter))
      continue

    _, rule = l.split(":")
    allRules.append(tuple(tuple(map(int, r.split("-"))) for r in (r.strip(" \n") for r in rule.split("or"))))
  return tuple(allRules), myTicket, otherTickets

def isValid(rules, ticket):
  for field in ticket:
    inrange = False
    for ranges in rules:
      for min, max in ranges:
        if field >= min and field <= max:
          inrange = True
          break
      if inrange:
        break
    if not inrange:
      return False
  return True

def part1(rules, otherTickets):
  startTime = pfc()
  result = 0
  for ticket in otherTickets:
    for field in ticket:
      inrange = False
      for ranges in rules:
        for min, max in ranges:
          if field >= min and field <= max:
            inrange = True
            break
        if inrange:
          break
      result += field if not inrange else 0

  print(f"Part 1 time: {pfc() - startTime:.4}")
  return result

def findNotMachingRules(value, rules):
  result = [i for i in range(20)]
  for i, ranges in enumerate(rules):
    for min, max in ranges:
      if value >= min and value <= max:
        result.remove(i)
        break
  return result

def part2(rules, myTicket, otherTickets):
  startTime = pfc()
  otherValidTickets = tuple(t for t in otherTickets if isValid(rules, t))
  rulesRefSet = set(range(20))
  matchingRules = []
  # for each ticket's field index, find which rules match all tickets
  for fieldIndex in range(len(myTicket)):
    notMatchingRules = set()
    for ticket in otherValidTickets:
      notMatchingRules.update(findNotMachingRules(ticket[fieldIndex], rules))
    matchingRules.append(list(rulesRefSet.difference(notMatchingRules)))

  fieldCount = 0
  result = 1
  while fieldCount < 6:
    # find a field with only one matching rule
    rules = tuple((i, rules[0]) for i, rules in enumerate(matchingRules) if len(rules) == 1)
    fieldIndex, ruleIndex = rules[0]
    # rule 0to 5 starts with "Departure"
    if ruleIndex <= 5:
      result *= myTicket[fieldIndex]
      fieldCount += 1
    # remove this rule from other matching rules
    for r in matchingRules:
      if ruleIndex in r:
        r.remove(ruleIndex)

  print(f"Part 2 time: {pfc() - startTime:.4}")
  return result

rules, myTicket, otherTickets = readInput(f"d16-input.txt")
print(f"Part 1 for puzzle input: {part1(rules, otherTickets)}")
print(f"Part 2 for puzzle input: {part2(rules, myTicket, otherTickets)}")
