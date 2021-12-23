"""
Advent Of Code 2021
Day 22: Reactor Reboot part 2

https://adventofcode.com/2021/day/22 
"""
def getInput(filename):
  with open(filename) as f:
    lines = f.readlines()

  input = []
  for l in lines:
    action, ranges = l.strip('\n').split(" ")
    xRange, yRange, zRange = ranges.split(',')

    x = [int(i) for i in xRange.split("=")[1].split("..")]
    x.sort() 
    y = [int(i) for i in yRange.split("=")[1].split("..")] 
    y.sort() 
    z = [int(i) for i in zRange.split("=")[1].split("..")]
    z.sort() 
    input.append((action, x, y, z))

  return input


class Cube:
  def __init__(self, action, xEdge, yEdge, zEdge):
    self.action = action
    self.xEdge = xEdge
    self.yEdge = yEdge
    self.zEdge = zEdge
    self.overlaps = []
    self.nbrCubes = (abs(self.xEdge[1] - self.xEdge[0]) + 1) * \
                      (abs(self.yEdge[1] - self.yEdge[0]) + 1) * \
                        (abs(self.zEdge[1] - self.zEdge[0]) + 1) 
    
  def intersectWith(self, cube2):
    # no intersection
    overlapX = max(-1, min(self.xEdge[1], cube2.xEdge[1]) - max(self.xEdge[0], cube2.xEdge[0]))
    overlapY = max(-1, min(self.yEdge[1], cube2.yEdge[1]) - max(self.yEdge[0],  cube2.yEdge[0]))
    overlapZ = max(-1, min(self.zEdge[1], cube2.zEdge[1]) - max(self.zEdge[0],  cube2.zEdge[0]))
    if (overlapX < 0 or overlapY < 0  or overlapZ < 0):
      return None
    
    x = (max(self.xEdge[0], cube2.xEdge[0]), min(self.xEdge[1], cube2.xEdge[1]))
    y = (max(self.yEdge[0], cube2.yEdge[0]), min(self.yEdge[1], cube2.yEdge[1]))
    z = (max(self.zEdge[0], cube2.zEdge[0]), min(self.zEdge[1], cube2.zEdge[1]))
    return Cube(cube2.action , x, y, z)

  def addOverlap(self, otherCube):
    for i, cube in enumerate(self.overlaps):
      c = otherCube.intersectWith(cube)
      if c is not None:
        otherCube.addOverlap(c)
    self.overlaps.append(otherCube)

  def processOverlap(self):
    nc = 0
    for c in self.overlaps:
      nc += c.processOverlap()
    return self.nbrCubes - nc

input = getInput("2021/D22/d22-input.txt")
allCubes = []
for i in input:
  c = Cube(i[0], i[1], i[2], i[3])
  allCubes.append(c)

processedQueue = []
for i, cube in enumerate(allCubes):
  for otherCube in reversed(processedQueue):
    c = otherCube.intersectWith(cube)
    if c is not None:
      otherCube.addOverlap(c)
  
  if cube.action == 'on':
    processedQueue.append(cube)

nbrCubesOn = 0
for cube in processedQueue:
  nbrCubesOn += cube.processOverlap()

print(nbrCubesOn)