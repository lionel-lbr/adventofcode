"""
Advent Of Code 2020
Day 17: Conway Cubes part 1 & 2

https://adventofcode.com/2020/day/17
"""
from time import perf_counter as pfc
import os
import numpy as np

def readInput(filename):
  with open(os.path.join("2020", "D17", filename)) as f:
    lines = f.readlines()
  input = (tuple(map(lambda x: 1 if x == "#" else 0, d.strip('\n'))) for d in lines)
  return tuple(input)

def isActive(elt, pos, surfaces):
  srcX, srcY, srcZ = pos
  r = surfaces[max(srcZ - 2, 0):srcZ + 1, max(srcY - 2, 0):srcY + 1, max(srcX - 2, 0):srcX + 1]
  r = (r == 1).sum()
  if elt == 1:
    return r in [3, 4]
  return r == 3

def expand(s, axis, sizes):
  s = np.insert(s, s.shape[axis], np.zeros(sizes), axis=axis)
  s = np.insert(s, 0, np.zeros(sizes), axis=axis)
  return s

def part1(input):
  startTime = pfc()
  size = len(input[0])
  surfaces = np.array(input).reshape(1, size, size)
  iter = 6
  while iter:
    destSurfaces = surfaces.copy()
    destSurfaces = expand(destSurfaces, 2, destSurfaces.shape[2])
    destSurfaces = expand(destSurfaces, 1, destSurfaces.shape[2])
    destSurfaces = expand(destSurfaces, 0, destSurfaces.shape[1:])
    for z, surface in enumerate(destSurfaces):
      for y, row in enumerate(surface):
        for x, elt in enumerate(row):
          destSurfaces[z][y][x] = 1 if isActive(elt, (x, y, z), surfaces) else 0

    surfaces = destSurfaces
    print(f"{iter}: {(surfaces == 1).sum()}")
    iter -= 1

  result = (surfaces == 1).sum()
  print(f"Part 1 time: {pfc() - startTime:.4}")
  return result

def isActive2(elt, pos, cubes):
  srcX, srcY, srcZ, srcW = pos
  r = cubes[max(srcW - 2, 0):srcW + 1, max(srcZ - 2, 0):srcZ + 1, max(srcY - 2, 0):srcY + 1, max(srcX - 2, 0):srcX + 1]
  r = (r == 1).sum()
  if elt == 1:
    return r in [3, 4]
  return r == 3

def part2(input):
  startTime = pfc()
  size = len(input[0])
  cubes = np.array(input).reshape(1, 1, size, size)
  iter = 6
  while iter:
    destCubes = cubes.copy()
    destCubes = expand(destCubes, 3, destCubes.shape[3])
    destCubes = expand(destCubes, 2, destCubes.shape[3])
    destCubes = expand(destCubes, 1, destCubes.shape[2:])
    destCubes = expand(destCubes, 0, destCubes.shape[1:])

    for w, cube in enumerate(destCubes):
      for z, surface in enumerate(cube):
        for y, row in enumerate(surface):
          for x, elt in enumerate(row):
            destCubes[w][z][y][x] = 1 if isActive2(elt, (x, y, z, w), cubes) else 0

    cubes = destCubes
    print(f"{iter}: {(cubes == 1).sum()}")
    iter -= 1

  result = (cubes == 1).sum()
  print(f"Part 2 time: {pfc() - startTime:.4}")
  return result

input = readInput(f"d17-input.txt")
#input = readInput(f"d17-sample.txt")
print(f"Part 1 for puzzle input: {part1(input)}")
print(f"Part 2 for puzzle input: {part2(input)}")
