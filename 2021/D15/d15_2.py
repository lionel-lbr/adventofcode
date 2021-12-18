"""
Advent Of Code 2021
Day 15: Chiton part 2

https://adventofcode.com/2021/day/15 
"""
INFINITY = float("inf")

NBR_TILES = 5
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


def buildDirectedGraph(lines, tileWidth, tileHigh):
  width = tileWidth * NBR_TILES
  high = tileHigh * NBR_TILES
  vertices = [[None for i in range(width)] for i in range(high)]

  def insertOneVertex(x,y,r):
    n = Vertex(x, y, r)
    vertices[y][x] = n
    if x>0 and vertices[y][x-1] is not None:
      vertices[y][x-1].addRightChild(n)
      n.addLeftChild(vertices[y][x-1])  
    if x<(width-1) and vertices[y][x+1] is not None:
      n.addRightChild(vertices[y][x+1])
      vertices[y][x+1].addLeftChild(n)
    if y>0 and vertices[y-1][x] is not None:
      vertices[y-1][x].addBottomChild(n)
      n.addTopChild(vertices[y-1][x]) 
    if y<(high-1) and vertices[y+1][x] is not None:
      n.addBottomChild(vertices[y+1][x])
      vertices[y+1][x].addTopChild(n)

  def addVertexToMultipleTile(x,y,r):
    riskY = r
    for posY in range(y, high, tileHigh):
      riskX = riskY
      for posX in range(x, width, tileWidth):
        insertOneVertex(posX, posY, riskX)
        riskX = max((riskX+1)%10, 1)
      riskY = max((riskY+1)%10, 1)
        
  for y in range(tileHigh):
    l = lines[y]
    for x in range(tileWidth):
      risk = int(l[x])
      addVertexToMultipleTile(x,y,risk)

  return vertices

def dijkstraDist(vertices):
  currentVertex = vertices[0][0]
  currentVertex.riskFromOrigin = 0
  visitedVertices = []

  while (True):
		# Mark current as visited
    currentVertex.visited = True
    for child in currentVertex.children:
      if child == None or child.visited:
        continue

      # Inserting into the visited queue
      if child not in visitedVertices:
        visitedVertices.append(child)
      risk = currentVertex.riskFromOrigin + child.risk

      # adjust risk to child from origin is lower
      if (risk < child.riskFromOrigin):	
        child.riskFromOrigin = risk

    # remove current node from priority queue
    if currentVertex in visitedVertices:
      visitedVertices.remove(currentVertex)	
    if (len(visitedVertices) == 0):
      break

		# get the vertex with min risk from the queue
    visitedVertices.sort(key=lambda v: v.riskFromOrigin)
    currentVertex = visitedVertices[0]

  # return exit vertex total risk from origin
  return vertices[-1][-1].riskFromOrigin

with open("2021/D15/d15-input.txt") as f:
  lines = f.readlines()

tileHigh = len(lines)
tileWidth = len(lines[0].strip('\n'))
vertices = buildDirectedGraph(lines, tileWidth, tileHigh)
riskFromOrigin = dijkstraDist(vertices)
print("AdventOfCode 2021 D15 part 2:", riskFromOrigin)
