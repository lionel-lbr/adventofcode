"""
Advent Of Code 2021
Day 19: Beacon Scanner part 1 & 2

https://adventofcode.com/2021/day/19 
"""
import os
import numpy as np

UNIT_MATRIX = np.array([[1, 0, 0], [0, 1, 0], [0, 0, 1]])
ROTATION_X = np.array([[1, 0, 0], [0, 0, -1], [0, 1, 0]])
ROTATION_Y = np.array([[0, 0, 1], [0, 1, 0], [-1, 0, 0]])
ROTATION_Z = np.array([[0, -1, 0], [1, 0, 0], [0, 0, 1]])

rotationsMatrices = [[UNIT_MATRIX], [ROTATION_Y], [ROTATION_Y, ROTATION_Y], [ROTATION_Y, ROTATION_Y, ROTATION_Y], [ROTATION_Z],
                     [ROTATION_Z, ROTATION_Y], [ROTATION_Z, ROTATION_Y, ROTATION_Y], [ROTATION_Z, ROTATION_Y, ROTATION_Y, ROTATION_Y],
                     [ROTATION_Z, ROTATION_Z], [ROTATION_Z, ROTATION_Z, ROTATION_Y], [ROTATION_Z, ROTATION_Z, ROTATION_Y, ROTATION_Y],
                     [ROTATION_Z, ROTATION_Z, ROTATION_Y, ROTATION_Y, ROTATION_Y], [ROTATION_Z, ROTATION_Z, ROTATION_Z],
                     [ROTATION_Z, ROTATION_Z, ROTATION_Z, ROTATION_Y], [ROTATION_Z, ROTATION_Z, ROTATION_Z, ROTATION_Y, ROTATION_Y],
                     [ROTATION_Z, ROTATION_Z, ROTATION_Z, ROTATION_Y, ROTATION_Y, ROTATION_Y], [ROTATION_X], [ROTATION_X, ROTATION_Y],
                     [ROTATION_X, ROTATION_Y, ROTATION_Y], [ROTATION_X, ROTATION_Y, ROTATION_Y, ROTATION_Y], [ROTATION_X, ROTATION_X, ROTATION_X],
                     [ROTATION_X, ROTATION_X, ROTATION_X, ROTATION_Y], [ROTATION_X, ROTATION_X, ROTATION_X, ROTATION_Y, ROTATION_Y],
                     [ROTATION_X, ROTATION_X, ROTATION_X, ROTATION_Y, ROTATION_Y, ROTATION_Y]]

def readInputFile(filename):
  with open(os.path.join("2021", "D19", filename)) as f:
    lines = f.readlines()
  scannerIndex = -1
  scanners = []
  for l in lines:
    if l.startswith("---"):
      scannerIndex += 1
      scanners.append([])
      continue
    if len(l.strip('\n')) == 0:
      continue
    point = tuple(int(v) for v in l.strip('\n').split(','))
    scanners[scannerIndex].append(point)

  # convert all inputs to numpy array
  for i, s in enumerate(scanners):
    scanners[i] = np.array(s)
  return scanners

def applyMatrix(matrix, point):
  p = point
  for m in matrix:
    p = np.sum(m * p, axis=1)
  return p

def rotateBeacons(scanner, matrix):
  rb = []
  for b in scanner:
    r = applyMatrix(matrix, b)
    rb.append(r)
  return np.array(rb)

def findOverlapOrientation(scanner, refScanner):
  for _, matrix in enumerate(rotationsMatrices):
    # rotate all scanner's beacons
    rotatedBeacons = rotateBeacons(scanner, matrix)
    # translate all rotated beacons to scanner 0 system
    for p1 in refScanner:
      for p2 in rotatedBeacons:
        newOrigin = p2 - p1
        translatedBeacons = rotatedBeacons - newOrigin
        beacons = list(set(map(tuple, translatedBeacons)).intersection(set(map(tuple, refScanner))))
        if len(beacons) >= 12:
          return (translatedBeacons, newOrigin)
  return None

def solve(filename):
  scanners = readInputFile(filename)
  uniqueBeacons = set()
  todo = [(0, scanners[0])]
  scanners[0] = None
  newOrigin = {0: np.array([0, 0, 0])}
  while todo:
    i, refScanner = todo.pop()
    uniqueBeacons.update(map(tuple, refScanner))
    for j, scanner in enumerate(scanners):
      if scanner is None:
        continue
      result = findOverlapOrientation(scanner, refScanner)
      if result is not None:
        print(f">> Scanners {i} and {j} are overlaping <<")
        trsBeacons, newOrg = result
        if (j, trsBeacons) not in todo:
          todo.append((j, trsBeacons))
          scanners[j] = None
          newOrigin[j] = newOrg
  print(f"Part1: Total number beacons: {len(uniqueBeacons)}")
  # part 2, calculate max distance
  maxDistance = -1
  for i in range(len(scanners) - 1):
    for j in range(i + 1, len(scanners)):
      d = newOrigin[j] - newOrigin[i]
      s = int(sum(map(abs, d)))
      maxDistance = max(maxDistance, s)
  print(f"Part2: Max distance: {maxDistance}")

solve("d19-sample1.txt")
solve("d19-input.txt")