"""
Advent Of Code 2021
Day 12: Passage Pathing part 1 & 2

https://adventofcode.com/2021/day/12
"""
import os

def getInput(filename):
  with open(os.path.join("2021", "D12", filename)) as f:
    lines = f.readlines()

  graph = dict()
  for l in lines:
    o, d = l.strip('\n').split('-')
    if d != "start":
      child = graph.get(o, [])
      child.append(d)
      graph[o] = child
    if d != "end" and o != "start":
      child = graph.get(d, [])
      child.append(o)
      graph[d] = child
  return graph

def canBeAddedToPath(v, path):
  sList = [c for c in path if c.islower() and c not in ["start", "end"]]
  sSet = set(sList)
  if v in sSet and len(sList) >= len(sSet) + 1:
    return False
  return True

def visitGraph(graph, v, canBeAddedToPath, path=[]):
  fullPathSolution = []
  subpath = list(path)
  subpath.append(v)

  for c in graph[v]:
    # if end is part of children, add this path to solutions
    if c == "end":
      subpath.append('end')
      fullPathSolution.append(tuple(subpath))
      subpath.pop()
      continue
    # can we visit this vertex again
    if c.islower() and not canBeAddedToPath(c, subpath):
      continue
    # recurse on the next vertex
    fullPathSolution.extend(visitGraph(graph, c, canBeAddedToPath, subpath))
  return fullPathSolution

def solve(filename, canBeAddedToPath=lambda x, l: not (x in l)):
  graph = getInput(filename)
  allPath = visitGraph(graph, "start", canBeAddedToPath)
  return len(allPath)

# Part 1
print(" --- Part 1 ---")
print(f"Part1 for sample1: {solve('d12-sample1.txt')}")
print(f"Part1 for sample2: {solve('d12-sample2.txt')}")
print(f"Part1 for sample3: {solve('d12-sample3.txt')}")
print(f"Part1 for puzzle input: {solve('d12-input.txt')}")

# Part 2
print(" --- Part 2 ---")
print(f"Part2 for sample1: {solve('d12-sample1.txt', canBeAddedToPath=canBeAddedToPath)}")
print(f"Part2 for sample2: {solve('d12-sample2.txt', canBeAddedToPath=canBeAddedToPath)}")
print(f"Part2 for sample3: {solve('d12-sample3.txt', canBeAddedToPath=canBeAddedToPath)}")
print(f"Part2 for puzzle input: {solve('d12-input.txt', canBeAddedToPath=canBeAddedToPath)}")
