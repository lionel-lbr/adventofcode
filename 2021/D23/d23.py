"""
Advent Of Code 2021
Day 23: Amphipod part 1 & 2

https://adventofcode.com/2021/day/23 
"""
from time import perf_counter as pfc

X = 0
Y = 1
ORIGIN = 0 
DEST = 1
INFINITY = float("inf")

INPUT_EXAMPLE = [
  "...........",
  "  B C B D  ",
  "  A D C A  ",
]
INPUT_PART1 = [
  "...........",
  "  A C C D  ",
  "  B D A B  ",
]
INPUT_PART2 = [
  "...........",
  "  A C C D  ",
  "  D C B A  ",
  "  D B A C  ",
  "  B D A B  ",
]

PARKING = [(0,0),(1,0),(3,0),(5,0),(7,0),(9,0),(10,0)]
ENERGY = {'A':1, 'B':10, 'C':100, 'D': 1000 }
WIDTH = 11

INPUT = "".join(INPUT_PART1)
HEIGHT = len(INPUT_PART1)

EMPTY_MAZE = [" " for _ in range(WIDTH * HEIGHT)]
GOALS = { 'A': [(2,y) for y in range(1,HEIGHT)],
          'B': [(4,y) for y in range(1,HEIGHT)],
          'C': [(6,y) for y in range(1,HEIGHT)],
          'D': [(8,y) for y in range(1,HEIGHT)]}

def setGlobal(input):
  global INPUT, HEIGHT, EMPTY_MAZE, GOALS
  INPUT = "".join(input)
  HEIGHT = len(input)

  EMPTY_MAZE = [" " for _ in range(WIDTH * HEIGHT)]
  GOALS = { 'A': [(2,y) for y in range(1,HEIGHT)],
          'B': [(4,y) for y in range(1,HEIGHT)],
          'C': [(6,y) for y in range(1,HEIGHT)],
          'D': [(8,y) for y in range(1,HEIGHT)]}
#
# Optimized priority queue
# 
class PriorityQueue:
  def __init__(self):
    self._stack = []

  def push(self, v, payload):
    i = (v // 1000) + 1
    if i > len(self._stack):
      toAdd = i - len(self._stack)
      self._stack.extend([[] for _ in range(toAdd)])
    self._push(i-1, v, payload)

  def _push(self, index, v, payload):
    stack = self._stack[index]
    for i, elt in enumerate(stack):
      if elt[0] <= v:
        stack.insert(i, (v, payload))
        return 
    # append smallest at the end
    stack.append((v, payload))

  def pop(self):
    for s in self._stack:
      if s:
        return s.pop()

  def isEmpty(self):
    for s in self._stack:
      if s:
        return False
    return True

  def getTop(self):
    for s in self._stack:
      if s:
        return s[-1] 

def getPathWithCost(state, p1, p2):
  amphipod = state[p1]
  distance = abs(p1[X] - p2[X]) + abs(p1[Y] - p2[Y])
  cost = distance * ENERGY[amphipod]
  return (cost, (p1, p2))

def stateToMaze(state):
  maze = list(EMPTY_MAZE)
  for p in state: maze[p[X] + p[Y]*WIDTH] = state[p]
  return "".join(maze)

def mazeToState(maze):
  state = dict()
  for i, c in enumerate(maze):
    if c == " ": continue
    y, x = divmod(i,WIDTH)
    state[(x,y)] = c
  return state

def hasReachedGoal(state):
  for c in "ABCD":
    for p in GOALS[c]:
      if state[p] != c:
        return False
  return True 

def getParkingMove(state, p1):
  moves = []
  # find current position in Parking lot
  for i, p in enumerate(PARKING):
    if p[X] >= p1[X]: break
  # checking how far can we go left
  i -= 1 if p1[X] <= p[X] else 0
  for p2 in reversed(PARKING[:i+1]):
    if state[p2] != '.': break
    moves.append(getPathWithCost(state, p1, p2)) 
  # checking how far can we go right
  i += 1 if p1[X] <= p[X] else 0
  for p2 in PARKING[i:]:
    if state[p2] != '.': break
    moves.append(getPathWithCost(state, p1, p2))
  return moves

def getBackToSlotMove(state, org):
  amphipod = state[org]
  goals = GOALS[amphipod]
  # check that destination slot for Amphipod is free 
  dst = None
  for p in reversed(goals):
    if state[p] not in [".", amphipod]:
      return None
    if state[p] == ".":
      dst = p
      break 
  if p == None:
    return None
  # there is a free slot, check no blocker in the packing lots
  i = PARKING.index(org)
  j = abs(org[X] - goals[0][X]) // 2
  # going left or right
  pathToSlot = PARKING[i+1:i+1+j] if org[X] < goals[0][X] else PARKING[i-j:i]
  # check no blocker
  for p in pathToSlot:
    if state[p] != '.': return None
  # no blocker so append path to list of moves
  return getPathWithCost(state, org, dst)

def canAmphipodGoOut(state, p1):
  amphipod = state[p1]
  # if Amphipod not in their right slot, check that nothing on the way
  if p1 not in GOALS[amphipod]:
    y = p1[Y]-1
    while y > 0:
      if state[(p1[X], y)] != ".": return False
      y -= 1
    return True
  # if Amphipod in it slots with its sliblings, don't move it
  for p in reversed(GOALS[amphipod]):
    if state[p] not in [".",amphipod]:
      return True
  return False
  
def getAllPossibleMoves(state):
  moves = []
  for p1 in state:
    if state[p1] == '.': continue
    # Amphipod already in the parking lot
    if p1[Y] == 0:
      m = getBackToSlotMove(state, p1)
      if m is not None:
        moves.append(m)
      continue
    # check if an Amphipod can go out
    if canAmphipodGoOut(state, p1):
      m = getParkingMove(state, p1)
      moves.extend(m)
  return moves
  
  
def solve(originMaze):
  queue = PriorityQueue()
  queue.push(0, mazeToState(originMaze))
  visited = {originMaze: 0}
  while not queue.isEmpty():
    cost, state = queue.pop()
    if hasReachedGoal(state):
      return cost
    for _cost, move in getAllPossibleMoves(state):
      newCost = cost + _cost
      # create new state/maze and move the amphipod
      _state = dict(state)
      _state[move[DEST]] = state[move[ORIGIN]]
      _state[move[ORIGIN]] = "."
      maze = stateToMaze(_state)
      # add it to visited if doesn't exist or if cost is better
      if newCost < visited.get(maze, INFINITY):
        visited[maze] = newCost
        queue.push(newCost , _state)

setGlobal(INPUT_EXAMPLE)
print("\nTrying example ...")
startTime = pfc()
cost = solve(INPUT)
print(f"Example cost: {cost} : {'correct' if cost == 12521 else 'ERROR'}")
print(f"Time: {pfc() - startTime}")

setGlobal(INPUT_PART1)
print("\nTrying part 1 ...")
startTime = pfc()
print(f"Part 1 cost: {solve(INPUT)}")
print(f"Time: {pfc() - startTime}")

setGlobal(INPUT_PART2)
startTime = pfc()
print("\nTrying part 2 ...")
print(f"Part2 cost: {solve(INPUT)}")
print(f"Time: {pfc() - startTime}")
