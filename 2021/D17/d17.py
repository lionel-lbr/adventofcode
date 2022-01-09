"""
Advent Of Code 2021
Day 17: Trick Shot part 1 & 2

https://adventofcode.com/2021/day/17 
"""

def part1(targetX, targetY):
  v = abs(targetY[1]) - 1
  y = int(v * (v + 1) / 2)  # divergent serie formulat n(n+1)/2
  return y

# brut force for part 2 ....
def fire(velX, velY, targetX, targetY):
  x, y = 0, 0
  while velX > 0 or y >= targetY[1]:
    if x >= targetX[0] and x <= targetX[1] and y <= targetY[0] and y >= targetY[1]:
      return True

    if y < targetY[1]:
      return False
    x += velX
    y += velY
    velX = max(0, velX - 1)
    velY -= 1
  return False

def part2(targetX, targetY):
  velYRange = (targetY[1], abs(targetY[1]) - 1)
  velXRange = (1, targetX[1])
  velocities = []
  for velx in range(velXRange[0], velXRange[1] + 1, 1):
    for vely in range(velYRange[0], velYRange[1] + 1, 1):
      if fire(velx, vely, targetX, targetY):
        velocities.append((velx, vely))
  return len(velocities)

# example
print(f'Part 1 for sample: {part1((20, 30),(-5, -10))}')
print(f'Part 2 for sample: {part2((20, 30),(-5, -10))}')

# my puzzle input
print(f'Part 1 for puzzle input: {part1((257, 286),(-57, -101))}')
print(f'Part 2 for puzzle input: {part2((257, 286),(-57, -101))}')