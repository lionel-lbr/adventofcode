"""
Advent Of Code 2021
Day 12: Passage Pathing part 1 & 2

https://adventofcode.com/2021/day/12
"""
import os

def getGraph(filename):
  with open(os.path.join("2021","D12", filename)) as f:
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
  s_list = [c for c in path if c.islower() and c not in ["start", "end"]]
  s_set = set(s_list)
  if v in s_set and len(s_list) >= len(s_set) + 1:
    return False  
  return True
  
def visitGraph(graph, v, canBeAddedToPath, path=[], ):
  fullPathSolution = []
  subpath = list(path)
  subpath.append(v)
  
  for c in graph[v]:
    # if end is part of children add this path to solutions
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
  allPath = []
  graph = getGraph(filename)
  allPath = visitGraph(graph, "start", canBeAddedToPath)
  print(len(allPath))
  return allPath

# Part 1
print(" --- Part 1 ---")
solve("d12-sample1.txt")
solve("d12-sample2.txt")
solve("d12-sample3.txt")
solve("d12-input.txt")

# Part 2
print(" --- Part 2 ---")
solve("d12-sample1.txt", canBeAddedToPath=canBeAddedToPath)
solve("d12-sample2.txt", canBeAddedToPath=canBeAddedToPath)
solve("d12-sample3.txt", canBeAddedToPath=canBeAddedToPath)
solve("d12-input.txt", canBeAddedToPath=canBeAddedToPath)
