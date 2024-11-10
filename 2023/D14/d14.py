"""
Advent Of Code 2023
Day 14: Parabolic Reflector Dish part 1 & 2

https://adventofcode.com/2023/day/13
"""
from time import perf_counter as pfc
import os

YEAR = "2023"
DAY = "14"

def readInput(filename):
  with open(os.path.join(f"{YEAR}", f"D{DAY}", filename)) as f:
    lines = f.readlines()
  input = (tuple(d.strip('\n')) for d in lines)
  return tuple(input)

ROUNDED = 'O'
CUBE = '#'
EMPTY = '.'

def part1(input):
  startTime = pfc()
  # convert input into a map (array of array)
  map = [list(row) for row in input]
  HEIGHT = len(map)
  WIDTH = len(map[0])
  
  def moveNorth(x, y):
    if (y==0):
      return False
    if (map[y-1][x]==EMPTY):
      map[y-1][x] = map[y][x]
      map[y][x] = EMPTY
      return True
    return False
  
  STILL_MOVING=True
  while STILL_MOVING is True:
    STILL_MOVING = False
    for y, row in enumerate(map):
      if y==0:
        continue
      for x, elt in enumerate(row):
        if elt is ROUNDED:
          if moveNorth(x,y):
            STILL_MOVING = True

  # calculate score
  score = 0
  for y, row in enumerate(map):
      score += sum((HEIGHT - y for elt in row if elt is ROUNDED))

  print(f"Part 1 time: {pfc() - startTime:.4}")
  return score

def part2(input):
  startTime = pfc()
  # convert input into a map (array of array)
  map = [list(row) for row in input]
  HEIGHT = len(map)
  WIDTH = len(map[0])

  def moveNorth(x, y):
    if (y==0):
      return False
    if (map[y-1][x]==EMPTY):
      map[y-1][x] = map[y][x]
      map[y][x] = EMPTY
      return True
    return False
  
  def moveSouth(x, y):
    if (y==WIDTH-1):
      return False
    if (map[y+1][x]==EMPTY):
      map[y+1][x] = map[y][x]
      map[y][x] = EMPTY
      return True
    return False

  def moveWest(x, y):
    if (x==0):
      return False
    if (map[y][x-1]==EMPTY):
      map[y][x-1] = map[y][x]
      map[y][x] = EMPTY
      return True
    return False

  def moveEast(x, y):
    if (x==WIDTH-1):
      return False
    if (map[y][x+1]==EMPTY):
      map[y][x+1] = map[y][x]
      map[y][x] = EMPTY
      return True
    return False

  def tiltOneSide(direction):
    STILL_MOVING=True
    while STILL_MOVING is True:
      STILL_MOVING = False
      if direction=="NORTH":
        for y, row in enumerate(map):
          if y==0:
            continue
          for x, elt in enumerate(row):
            if elt is ROUNDED:
              if moveNorth(x,y):
                STILL_MOVING = True

      elif direction=="WEST":
        for y, row in enumerate(map):
          for x, elt in enumerate(row):
            if x == 0:
              continue
            if elt is ROUNDED:
              if moveWest(x,y):
                STILL_MOVING = True

      elif direction=="SOUTH":
        reversed_map_iter = reversed(map)
        for y, row in enumerate(reversed_map_iter):
          if y==0:
            continue
          for x, elt in enumerate(row):
            if elt is ROUNDED:
              if moveSouth(x,HEIGHT-1-y):
                STILL_MOVING = True
      elif direction=="EAST":
        for y, row in enumerate(map):
          reversed_row_iter = reversed(row)
          for x, elt in enumerate(reversed_row_iter):
            if x == 0:
              continue
            if elt is ROUNDED:
              if moveEast(WIDTH-1-x,y):
                STILL_MOVING = True
    
  MAX_CYCLE_COUNT = 1_000_000_000
  cycles = list()
  i=0
  while i<MAX_CYCLE_COUNT:
    tiltOneSide("NORTH")
    tiltOneSide("WEST")
    tiltOneSide("SOUTH")
    tiltOneSide("EAST")
    cycle_records = list()
    for y, row in enumerate(map):
      cycle_records.append( tuple(((x,y) for x, elt in enumerate(row) if elt == ROUNDED)))
    
    cycle_records_tuple = tuple(cycle_records)
    if cycle_records_tuple in cycles:
      index = cycles.index(cycle_records_tuple)
      cycle_length = i - index
      remaining_iter_count = MAX_CYCLE_COUNT - i
      i += cycle_length * (remaining_iter_count // cycle_length)  # "//" integer division
   
    cycles.append(cycle_records_tuple)

    i+=1


  score = 0
  for y, row in enumerate(map):
      score += sum((HEIGHT - y for elt in row if elt is ROUNDED))
  
  print(f"Part 2 time: {pfc() - startTime:.4}")
  return score

input = readInput(f"d{DAY}-input.txt")
#input = readInput(f"d{DAY}-sample.txt")
print(f"Part 1: {part1(input)}")
print(f"Part 2: {part2(input)}")
