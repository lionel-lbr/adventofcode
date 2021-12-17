"""
Advent Of Code 2021
Day 15: Chiton part 1

https://adventofcode.com/2021/day/15 
"""
infinity = float("inf")
class Node:
  def __init__(self, x, y, risk):
    self.x = x
    self.y = y
    self.risk = risk
    self.children = [None, None, None]
    self.visited = False

  def addRightChild(self, node):
    self.children[1] = node

  def addBottomChild(self, node):
    self.children[2] = node

def buildDirectedGraph(lines, gridWidth, gridHigh):
  nodes = []
  for y in range(gridHigh):
    l = lines[y]
    nRow = []
    for x in range(gridWidth):
      risk = int(l[x])
      n = Node(x, y, risk)
      if x==0 and y==0:
        nRow.append(n)
        continue
      
      if y==0:
        nRow[x-1].addRightChild(n)
        nRow.append(n)
        continue
      
      nodes[y-1][x].addBottomChild(n)
      nRow.append(n)
      if x>0:
        left = nRow[x-1]
        left.addRightChild(n)

    nodes.append(nRow)
  return nodes

def dijkstraDist(nodes):
	# will store risks from origin to each node
  riskMatrix = [[infinity for i in range(gridWidth)] for i in range(gridHigh)]
  riskMatrix[0][0] = 0
  currentNode = nodes[0][0]

	# Will store visited node
  visitedSet = set()	
  while (True):
		
		# mark current as visited and go through children
    currentNode.visited = True
    for child in currentNode.children:
      if child == None or child.visited:
        continue

      # add visited node to set, and calculate risk to origin
      visitedSet.add(child)
      alt = riskMatrix[currentNode.y][currentNode.x] + child.risk

      # update risk matrix 
      if (alt < riskMatrix[child.y][child.x]):	
        riskMatrix[child.y][child.x] = alt

    # remove visited node from the set
    if currentNode in visitedSet:		
      visitedSet.remove(currentNode)
    if (len(visitedSet) == 0):
      break

		# choose the next node
    minDist = infinity
    for n in visitedSet:	
      if (riskMatrix[n.y][n.x] < minDist):		
        minDist = riskMatrix[n.y][n.x]
        currentNode = n

  # return last node risk 
  return riskMatrix[-1][-1]


with open("2021/D15/d15-input.txt") as f:
    lines = f.readlines()

gridHigh = len(lines)
gridWidth = len(lines[0].strip('\n'))
nodes = buildDirectedGraph(lines, gridWidth, gridHigh)
totalRisk = dijkstraDist(nodes)
print("AdventOfCode 2021 D15 part 1:", totalRisk)
