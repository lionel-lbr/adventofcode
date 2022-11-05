"""
Advent Of Code 2020
Day 12: Rain Risk part 1 & 2

https://adventofcode.com/2020/day/12
"""
import os, math

def readInput(filename):
  with open(os.path.join("2020", "D12", filename)) as f:
    lines = f.readlines()
  input = ((d[0], int(d[1:])) for d in (d.strip('\n') for d in lines))
  return tuple(input)

def part1(input):
  x, y = 0, 0
  incX, incY = 1, 0
  for d, v in input:
    if d == "E":
      x += v
    elif d == "W":
      x -= v
    elif d == "N":
      y += v
    elif d == "S":
      y -= v
    elif d == "F":
      x += v * incX
      y += v * incY
    elif d == "R":
      incX, incY = (incX * int(math.cos(math.radians(v))) + incY * int(math.sin(math.radians(v))),
                    incX * -int(math.sin(math.radians(v))) + incY * int(math.cos(math.radians(v))))
    elif d == "L":
      incX, incY = (incX * int(math.cos(math.radians(-v))) + incY * int(math.sin(math.radians(-v))),
                    incX * -int(math.sin(math.radians(-v))) + incY * int(math.cos(math.radians(-v))))
  return abs(x) + abs(y)

def part2(input):
  posX, posY = 0, 0
  vect = (10, 1)
  for d, v in input:
    if d == "E":
      incX, incY = vect
      vect = (incX + v, incY)
    elif d == "W":
      incX, incY = vect
      vect = (incX - v, incY)
    elif d == "N":
      incX, incY = vect
      vect = (incX, incY + v)
    elif d == "S":
      incX, incY = vect
      vect = (incX, incY - v)
    elif d == "F":
      incX, incY = vect
      posX += v * incX
      posY += v * incY
    elif d == "R":
      incX, incY = vect
      vect = (incX * int(math.cos(math.radians(v))) + incY * int(math.sin(math.radians(v))),
              incX * -int(math.sin(math.radians(v))) + incY * int(math.cos(math.radians(v))))
    elif d == "L":
      incX, incY = vect
      vect = (incX * int(math.cos(math.radians(-v))) + incY * int(math.sin(math.radians(-v))),
              incX * -int(math.sin(math.radians(-v))) + incY * int(math.cos(math.radians(-v))))
  return abs(posX) + abs(posY)

input = readInput("d12-input.txt")
print(f"Part 1 for puzzle input: {part1(input)}")
print(f"Part 2 for puzzle input: {part2(input)}")
