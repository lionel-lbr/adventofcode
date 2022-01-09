"""
Advent Of Code 2021
Day 15: Chiton part 1 & 2

https://adventofcode.com/2021/day/15 
"""
import os
from time import perf_counter as pfc

INFINITY = float("inf")

class Vertex:

  def __init__(self, x, y, risk):
    self.x = x
    self.y = y
    self.risk = risk
    self.children = [None, None, None, None]
    self.visited = False
    self.riskFromOrigin = INFINITY

  def getXY(self):
    return (self.x, self.y)

  def addLeftChild(self, node):
    self.children[0] = node

  def addRightChild(self, node):
    self.children[1] = node

  def addBottomChild(self, node):
    self.children[2] = node

  def addTopChild(self, node):
    self.children[3] = node

def buildDirectedGraph(lines, tileWidth, tileHigh, multiplicator):
  width = tileWidth * multiplicator
  high = tileHigh * multiplicator
  vertices = [[None] * width for _ in range(high)]

  def insertOneVertex(x, y, r):
    n = Vertex(x, y, r)
    vertices[y][x] = n
    if x > 0 and vertices[y][x - 1] is not None:
      vertices[y][x - 1].addRightChild(n)
      n.addLeftChild(vertices[y][x - 1])
    if x < (width - 1) and vertices[y][x + 1] is not None:
      n.addRightChild(vertices[y][x + 1])
      vertices[y][x + 1].addLeftChild(n)
    if y > 0 and vertices[y - 1][x] is not None:
      vertices[y - 1][x].addBottomChild(n)
      n.addTopChild(vertices[y - 1][x])
    if y < (high - 1) and vertices[y + 1][x] is not None:
      n.addBottomChild(vertices[y + 1][x])
      vertices[y + 1][x].addTopChild(n)

  def addVertexToMultipleTile(x, y, r):
    riskY = r
    for posY in range(y, high, tileHigh):
      riskX = riskY
      for posX in range(x, width, tileWidth):
        insertOneVertex(posX, posY, riskX)
        riskX = max((riskX + 1) % 10, 1)
      riskY = max((riskY + 1) % 10, 1)

  for y in range(tileHigh):
    for x in range(tileWidth):
      addVertexToMultipleTile(x, y, int(lines[y][x]))
  return vertices

def dijkstra(vertices):
  currentVertex = vertices[0][0]
  currentVertex.riskFromOrigin = 0
  visitedVertices = []
  while True:
    # mark current as visited
    currentVertex.visited = True
    for child in currentVertex.children:
      if child == None or child.visited:
        continue

      # inserting into the visited queue
      if child not in visitedVertices:
        visitedVertices.append(child)
      risk = currentVertex.riskFromOrigin + child.risk

      # adjust risk to child from origin is lower
      if (risk < child.riskFromOrigin):
        child.riskFromOrigin = risk

    # remove current node from priority queue
    if currentVertex in visitedVertices:
      visitedVertices.remove(currentVertex)
    if not visitedVertices:
      break

    # get the vertex with min risk from the queue
    minRisk = INFINITY
    minRiskIndex = -1
    for i, v in enumerate(visitedVertices):
      if v.riskFromOrigin < minRisk:
        minRiskIndex = i
        minRisk = v.riskFromOrigin
    currentVertex = visitedVertices[minRiskIndex]

  # return exit vertex total risk from origin
  return vertices[-1][-1].riskFromOrigin

def readInput(filename):
  with open(os.path.join("2021", "D15", filename)) as f:
    lines = f.readlines()
  return lines

def solve(filename, multiplicator=1):
  lines = readInput(filename)
  tileHigh = len(lines)
  tileWidth = len(lines[0].strip('\n'))
  vertices = buildDirectedGraph(lines, tileWidth, tileHigh, multiplicator)
  start = pfc()
  riskFromOrigin = dijkstra(vertices)
  print(f"time: {pfc() - start} seconds")
  return riskFromOrigin

print(f"Part 1: {solve('d15-input.txt')}")
print(f"Part 2: {solve('d15-input.txt', 5)}")